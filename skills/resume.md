- file model resume
  package com.dtn.apply_job.domain;

import com.dtn.apply_job.security.SecurityUtil;
import jakarta.persistence._;
import lombok._;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ N-1: Nhiều CV thuộc về 1 Ứng viên (Bảng User)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    // VÙNG DỮ LIỆU DÀNH CHO AI (Lưu text đọc ra từ PDF)
    // Lưu ý: Dùng TEXT cho PostgreSQL
    @Column(name = "parsed_text", columnDefinition = "TEXT")
    private String parsedText;

    @Column(name = "is_active")
    private boolean active;

    // Tùy chọn: Kết nối CV với các Kỹ năng (Bảng Skill)
    @ManyToMany
    @JoinTable(
            name = "resume_skill",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skill> skills;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization_id")
    private Specialization specialization;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdBy = SecurityUtil.getCurrentUser().orElse("system");
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUser().orElse("system");
        this.updatedAt = Instant.now();
    }

}

- file controller
  package com.dtn.apply_job.controller;

import com.dtn.apply_job.common.annotation.ApiMessage;
import com.dtn.apply_job.common.response.ResultPaginationDTO;
import com.dtn.apply_job.domain.Resume;
import com.dtn.apply_job.domain.request.resume.ReqCreateResumeDTO;
import com.dtn.apply_job.domain.request.resume.ReqUpdateResumeDTO;
import com.dtn.apply_job.domain.response.resume.ResResumeDTO;
import com.dtn.apply_job.domain.response.resume.ResUpdateResumeDTO;
import com.dtn.apply_job.exception.IdInvalidException;
import com.dtn.apply_job.service.ResumeService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.\*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/resumes")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @ApiMessage("Create resume")
    public ResponseEntity<ResResumeDTO> createResume(@Valid @RequestBody ReqCreateResumeDTO req) throws Exception {
        ResResumeDTO newResume = this.resumeService.handleCreateResume(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    @PutMapping("/resumes/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @ApiMessage("Update resume")
    public ResponseEntity<ResUpdateResumeDTO> updateResume(@PathVariable long id, @Valid @RequestBody ReqUpdateResumeDTO req)
            throws Exception {
        ResUpdateResumeDTO updatedResume = this.resumeService.handleUpdateResume(id, req);
        return ResponseEntity.status(HttpStatus.OK).body(updatedResume);
    }

    @GetMapping("/resumes/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @ApiMessage("Fetch resume by Id")
    public ResponseEntity<ResResumeDTO> getResumeById(@PathVariable long id) throws Exception {
        ResResumeDTO resume = this.resumeService.handleGetResumeById(id);
        return ResponseEntity.status(HttpStatus.OK).body(resume);
    }

    @GetMapping("/resumes")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch all resumes")
    public ResponseEntity<ResultPaginationDTO> getAllResumes(
            @Filter Specification<Resume> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO result = this.resumeService.handleGetAllResumes(spec, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }


    @GetMapping("/my-cvs")
    @PreAuthorize("hasRole('CANDIDATE')")
    @ApiMessage("Get your Cv-list successfully!")
    public ResponseEntity<List<ResResumeDTO>> getMyResumes() throws IdInvalidException {
        List<ResResumeDTO> result = resumeService.handleGetMyResumes();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/resumes/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @ApiMessage("Delete resume successfully!")
    public ResponseEntity<Void> deleteResume(@PathVariable long id) throws IdInvalidException {
        resumeService.handleSoftDeleteResume(id);
        return ResponseEntity.ok().build();
    }

}

- file resume service
  package com.dtn.apply_job.service;

import com.dtn.apply_job.common.response.ResultPaginationDTO;
import com.dtn.apply_job.domain.Resume;
import com.dtn.apply_job.domain.Skill;
import com.dtn.apply_job.domain.Specialization;
import com.dtn.apply_job.domain.User;
import com.dtn.apply_job.domain.request.resume.ReqCreateResumeDTO;
import com.dtn.apply_job.domain.request.resume.ReqUpdateResumeDTO;
import com.dtn.apply_job.domain.response.resume.ResResumeDTO;
import com.dtn.apply_job.domain.response.resume.ResUpdateResumeDTO;
import com.dtn.apply_job.exception.IdInvalidException;
import com.dtn.apply_job.repository.ResumeRepository;
import com.dtn.apply_job.repository.SkillRepository;
import com.dtn.apply_job.repository.SpecializationRepository;
import com.dtn.apply_job.repository.UserRepository;
import com.dtn.apply_job.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final SpecializationRepository specializationRepository;

    @Transactional
    public ResResumeDTO handleCreateResume(ReqCreateResumeDTO req) throws IdInvalidException {
        String email = SecurityUtil.getCurrentUser()
                .orElseThrow(() -> new IdInvalidException("Vui lòng đăng nhập để tạo CV!"));
        User currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new IdInvalidException("Tài khoản không tồn tại!");
        }

        Resume resume = new Resume();
        resume.setCandidate(currentUser);
        resume.setFileName(req.getFileName());
        resume.setFileUrl(req.getFileUrl());
        resume.setParsedText(req.getParsedText());
        resume.setActive(true);

        if (req.getSkillIds() != null && !req.getSkillIds().isEmpty()) {
            List<Skill> skills = this.skillRepository.findByIdIn(req.getSkillIds());
            if (skills.size() != req.getSkillIds().size()) {
                throw new IdInvalidException("Some skill ids are invalid");
            }
            resume.setSkills(skills);
        } else {
            resume.setSkills(Collections.emptyList());
        }

        if (req.getSpecializationId() != null) {
            Specialization specialization = this.specializationRepository.findById(req.getSpecializationId())
                    .orElseThrow(() -> new IdInvalidException("Specialization id not found"));
            resume.setSpecialization(specialization);
        } else {
            resume.setSpecialization(null);
        }

        resume.setCreatedAt(Instant.now());

        Resume savedResume = this.resumeRepository.save(resume);
        return convertToResResumeDTO(savedResume);
    }

    public ResUpdateResumeDTO handleUpdateResume(long id, ReqUpdateResumeDTO reqDTO) throws IdInvalidException {
        Resume currentResume = getResumeAndCheckPermission(id);

        if (reqDTO.getFileName() != null) {
            currentResume.setFileName(reqDTO.getFileName());
        }

        if (reqDTO.getFileUrl() != null && !reqDTO.getFileUrl().equals(currentResume.getFileUrl())) {
            currentResume.setFileUrl(reqDTO.getFileUrl());

            // 🚨 GỌI LẠI AI PYTHON VÌ FILE ĐÃ THAY ĐỔI 🚨
            // String newText = pythonAiService.parsePdf(reqDTO.getFileUrl());
            // currentResume.setParsedText(newText);
        }

        if (reqDTO.getIsActive() != null) {
            currentResume.setActive(reqDTO.getIsActive());
        }

        if (reqDTO.getSkillIds() != null) {
            if (reqDTO.getSkillIds().isEmpty()) {
                currentResume.setSkills(Collections.emptyList());
            } else {
                List<Skill> skills = this.skillRepository.findByIdIn(reqDTO.getSkillIds());
                if (skills.size() != reqDTO.getSkillIds().size()) {
                    throw new IdInvalidException("Some skill ids are invalid");
                }
                currentResume.setSkills(skills);
            }
        }

        if (reqDTO.getSpecializationId() != null) {
            Specialization specialization = this.specializationRepository.findById(reqDTO.getSpecializationId())
                    .orElseThrow(() -> new IdInvalidException("Specialization id not found"));
            currentResume.setSpecialization(specialization);
        }

        currentResume.setUpdatedAt(Instant.now());

        Resume updatedResume = resumeRepository.save(currentResume);
        return convertToResUpdateResumeDTO(updatedResume);
    }

    @Transactional
    public void handleSoftDeleteResume(long id) throws IdInvalidException {
        Resume currentResume = getResumeAndCheckPermission(id);
        currentResume.setActive(false);
        resumeRepository.save(currentResume);
    }

    public ResResumeDTO handleGetResumeById(long id) throws Exception {
        Resume resume = getResumeAndCheckPermission(id);
        return convertToResResumeDTO(resume);
    }

    public ResultPaginationDTO handleGetAllResumes(Specification<Resume> spec, Pageable pageable) {
        Page<Resume> resumePage = this.resumeRepository.findAll(spec, pageable);

        List<ResResumeDTO> results = resumePage.getContent().stream()
                .map(this::convertToResResumeDTO)
                .collect(Collectors.toList());

        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(resumePage.getNumber() + 1);
        meta.setPageSize(resumePage.getSize());
        meta.setPages(resumePage.getTotalPages());
        meta.setTotal(resumePage.getTotalElements());

        resultPaginationDTO.setMeta(meta);
        resultPaginationDTO.setResult(results);

        return resultPaginationDTO;
    }

    public List<ResResumeDTO> handleGetMyResumes() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUser()
                .orElseThrow(() -> new IdInvalidException("Please log in to view your CV!"));

        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new IdInvalidException("Account doesn't exist! Please register first!");
        }

        List<Resume> myResumes = this.resumeRepository.findByCandidateAndActiveTrue(currentUser);
        return myResumes.stream()
                .map(this::convertToResResumeDTO)
                .collect(Collectors.toList());
    }

    private Resume getResumeAndCheckPermission(long resumeId) throws IdInvalidException {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IdInvalidException("CV doesn't exist!"));

        String currentUserEmail = SecurityUtil.getCurrentUser()
                .orElseThrow(() -> new IdInvalidException("Please log in to view this CV!"));
        User currentUser = userRepository.findByEmail(currentUserEmail);
        if (currentUser == null) {
            throw new IdInvalidException("Account doesn't exist! Please register first!");
        }

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().name().equals("ADMIN"));

        if (!isAdmin && !resume.getCandidate().getEmail().equals(currentUserEmail)) {
            throw new IdInvalidException("You don't have permission to view this CV! Only the owner can view it!");
        }

        return resume;
    }

    private ResResumeDTO convertToResResumeDTO(Resume resume) {
        ResResumeDTO dto = new ResResumeDTO();
        dto.setId(resume.getId());
        dto.setFileName(resume.getFileName());
        dto.setFileUrl(resume.getFileUrl());
        dto.setActive(resume.isActive());
        dto.setCreatedAt(resume.getCreatedAt());
        dto.setUpdatedAt(resume.getUpdatedAt());

        List<String> skillNames = Collections.emptyList();
        if (resume.getSkills() != null) {
            skillNames = resume.getSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList());
        }
        dto.setSkills(skillNames);

        if (resume.getCandidate() != null) {
            ResResumeDTO.CandidateInfo candidateInfo = new ResResumeDTO.CandidateInfo();
            candidateInfo.setId(resume.getCandidate().getId());
            candidateInfo.setName(resume.getCandidate().getName());
            candidateInfo.setEmail(resume.getCandidate().getEmail());
            dto.setCandidate(candidateInfo);
        }

        if (resume.getSpecialization() != null) {
            ResResumeDTO.SpecializationInfo specializationInfo = new ResResumeDTO.SpecializationInfo();
            specializationInfo.setId(resume.getSpecialization().getId());
            specializationInfo.setName(resume.getSpecialization().getName());
            dto.setSpecialization(specializationInfo);
        }

        return dto;
    }

    private ResUpdateResumeDTO convertToResUpdateResumeDTO(Resume resume) {
        ResUpdateResumeDTO dto = new ResUpdateResumeDTO();
        dto.setId(resume.getId());
        dto.setFileName(resume.getFileName());
        dto.setFileUrl(resume.getFileUrl());
        dto.setActive(resume.isActive());
        dto.setCreatedAt(resume.getCreatedAt());
        dto.setUpdatedAt(resume.getUpdatedAt());
        dto.setUpdatedBy(resume.getUpdatedBy());

        List<String> skillNames = Collections.emptyList();
        if (resume.getSkills() != null) {
            skillNames = resume.getSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList());
        }
        dto.setSkills(skillNames);

        if (resume.getCandidate() != null) {
            ResUpdateResumeDTO.CandidateInfo candidateInfo = new ResUpdateResumeDTO.CandidateInfo();
            candidateInfo.setId(resume.getCandidate().getId());
            candidateInfo.setName(resume.getCandidate().getName());
            candidateInfo.setEmail(resume.getCandidate().getEmail());
            dto.setCandidate(candidateInfo);
        }

        if (resume.getSpecialization() != null) {
            ResUpdateResumeDTO.SpecializationInfo specializationInfo = new ResUpdateResumeDTO.SpecializationInfo();
            specializationInfo.setId(resume.getSpecialization().getId());
            specializationInfo.setName(resume.getSpecialization().getName());
            dto.setSpecialization(specializationInfo);
        }

        return dto;
    }

}
