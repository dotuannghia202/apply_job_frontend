- model application
  package com.dtn.apply_job.domain;

import com.dtn.apply*job.util.constant.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.\_;

import java.time.Instant;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nộp vào Công việc nào?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // Sử dụng CV nào để nộp?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    // Trạng thái đơn (Dùng Enum)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // VÙNG DỮ LIỆU DÀNH CHO AI: Lưu điểm % phù hợp do AI chấm
    @Column(name = "match_score")
    private Double matchScore;

    // Lời nhắn gửi kèm của ứng viên (Cover Letter)
    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "applied_at")
    private Instant appliedAt;

    // Hàm tự động gán ngày nộp lúc Insert dữ liệu
    @PrePersist
    protected void onCreate() {
        appliedAt = Instant.now();
    }

}

- file Create DTO
  package com.dtn.apply_job.domain.request.application;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReqCreateApplicationDTO {
@NotNull(message = "Job ID information is missing")
private Long jobId;

    @NotNull(message = "Please select a CV to apply for (Resume ID)")
    private Long resumeId;

    // Cover letter là tùy chọn, không cần @NotNull
    private String coverLetter;

}

- file request update DTO (only user)
  package com.dtn.apply_job.domain.request.application;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateAppByCandidateDTO {
// Dùng Long và String (Object) để cho phép truyền null nếu chỉ muốn sửa 1 trong 2
private Long resumeId;
private String coverLetter;
}

- file update status (only admin, employer)
  package com.dtn.apply_job.domain.request.application;

import com.dtn.apply_job.util.constant.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateApplicationStatusDTO {
@NotNull(message = "Status isn't be null!")
private ApplicationStatus status;
}

- Controller
  package com.dtn.apply_job.controller;

import com.dtn.apply_job.common.annotation.ApiMessage;
import com.dtn.apply_job.common.response.ResultPaginationDTO;
import com.dtn.apply_job.domain.Application;
import com.dtn.apply_job.domain.request.application.ReqCreateApplicationDTO;
import com.dtn.apply_job.domain.request.application.ReqUpdateAppByCandidateDTO;
import com.dtn.apply_job.domain.request.application.ReqUpdateApplicationStatusDTO;
import com.dtn.apply_job.domain.response.application.ResApplicationDTO;
import com.dtn.apply_job.domain.response.application.ResCreateApplicationDTO;
import com.dtn.apply_job.domain.response.application.ResUpdateApplicationDTO;
import com.dtn.apply_job.service.ApplicationService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.\*;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    @ApiMessage("Successfully created a recruitment profile")
    public ResponseEntity<ResCreateApplicationDTO> create(@Valid @RequestBody ReqCreateApplicationDTO reqDTO) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.handleCreateApplication(reqDTO));
    }

    @GetMapping
    @ApiMessage("Get list applications")
    // Mở cho cả 3 Role, dữ liệu sẽ được Service tự động lọc
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER', 'ADMIN')")
    public ResponseEntity<ResultPaginationDTO> getAll(
            @Filter Specification<Application> spec,
            Pageable pageable,
            @RequestParam(required = false) String status
    ) throws Exception {
        return ResponseEntity.ok(applicationService.handleGetAllApps(spec, pageable, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER', 'ADMIN')")
    @ApiMessage("Get application by id")
    public ResponseEntity<ResApplicationDTO> getById(@PathVariable long id) throws Exception {
        return ResponseEntity.ok(applicationService.handleGetAppById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')") // Chặn cứng Candidate
    @ApiMessage("Update status application successfully!")
    public ResponseEntity<ResUpdateApplicationDTO> updateStatus(
            @PathVariable long id,
            @Valid @RequestBody ReqUpdateApplicationStatusDTO reqDTO) throws Exception {
        return ResponseEntity.ok(applicationService.handleUpdateStatus(id, reqDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')") // Chặn HR và Admin
    @ApiMessage("Application updated successfully")
    public ResponseEntity<ResApplicationDTO> updateAppByCandidate(
            @PathVariable long id,
            @Valid @RequestBody ReqUpdateAppByCandidateDTO reqDTO) throws Exception {

        return ResponseEntity.ok(applicationService.handleUpdateAppByCandidate(id, reqDTO));
    }

}

- File Res DTO
  package com.dtn.apply_job.domain.response.application;

import com.dtn.apply_job.util.constant.enums.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResApplicationDTO {
private Long id;
private ApplicationStatus status;
private Double matchScore; // Điểm AI
private String coverLetter;
private Boolean hasCoverLetter;

    private Instant appliedAt;

    private JobInfo job;
    private ResumeInfo resume;
    private CandidateInfo candidate; // Phẳng hóa dữ liệu để FE dễ dùng

    // --- INNER CLASSES (GỌN NHẸ) ---
    @Getter
    @Setter
    public static class JobInfo {
        private Long id;
        private String name;
        private String companyName;
        private String location;
        private String companyLogo;
    }

    @Getter
    @Setter
    public static class ResumeInfo {
        private Long id;
        private String fileName;
        private String fileUrl; // HR dùng link này để xem CV
    }

    @Getter
    @Setter
    public static class CandidateInfo {
        private Long id;
        private String name;
        private String email;
    }

}
