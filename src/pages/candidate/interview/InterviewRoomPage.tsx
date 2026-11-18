import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useGetInterviewSession,
  useStartInterview,
  useSubmitInterview,
} from "@/api/interviews/interview.queries";
import { getApiErrorMessage } from "@/helper/error";
import type { QuestionProgress } from "@/types/interview";

import { InterviewHeader } from "./components/InterviewHeader";
import { DeviceSetupView } from "./components/DeviceSetupView";
import { RecordingView } from "./components/RecordingView";
import { SubmittingView } from "./components/SubmittingView";
import { FinishedView } from "./components/FinishedView";

type InterviewStage = "DEVICE_CHECK" | "RECORDING" | "SUBMITTING" | "FINISHED";

export default function InterviewRoomPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith("vi");

  const { data: sessionData, isLoading, isError } = useGetInterviewSession(sessionId);
  const startMutation = useStartInterview();
  const submitMutation = useSubmitInterview();

  const session = sessionData?.data;
  const questions = session?.questions || [];

  const [stage, setStage] = useState<InterviewStage>("DEVICE_CHECK");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // Device permissions & mic audio level
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Recorded question milestones
  const [progressList, setProgressList] = useState<QuestionProgress[]>([]);
  const questionStartTimeRef = useRef<number>(0);
  const globalRecordingStartTimeRef = useRef<number>(0);

  // Media references
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 1. Initialize Camera & Mic
  const initMedia = useCallback(async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      mediaStreamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Initialize Audio Analyser for volume visualization
      type AudioContextConstructor = typeof AudioContext;
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;

      if (AudioCtxClass) {
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          if (!mediaStreamRef.current?.active) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const average = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
          requestAnimationFrame(updateVolume);
        };
        updateVolume();
      }

      setHasPermission(true);
    } catch (err) {
      console.error("Camera/Mic access denied:", err);
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    initMedia();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [initMedia]);

  // Re-attach video stream if stage switches
  useEffect(() => {
    if (videoPreviewRef.current && mediaStreamRef.current) {
      videoPreviewRef.current.srcObject = mediaStreamRef.current;
    }
  }, [stage]);

  // 2. Countdown timer during recording
  useEffect(() => {
    if (stage !== "RECORDING") return;

    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // 3. Start Interview
  const handleStartInterview = async () => {
    if (!mediaStreamRef.current || !questions.length) return;

    try {
      await startMutation.mutateAsync(sessionId!);
    } catch (e) {
      console.warn("Could not mark session as in_progress on BE:", e);
    }

    recordedChunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    recorder.start(1000);
    mediaRecorderRef.current = recorder;

    const now = Date.now();
    globalRecordingStartTimeRef.current = now;
    questionStartTimeRef.current = now;

    setStage("RECORDING");
    setCurrentIdx(0);
    setTimeLeft(questions[0].timeLimitSeconds || 60);
  };

  // 4. Progress to next question or finish
  const handleNextQuestion = () => {
    const now = Date.now();
    const duration = Math.round((now - questionStartTimeRef.current) / 1000);
    const startSec = Math.round(
      (questionStartTimeRef.current - globalRecordingStartTimeRef.current) / 1000,
    );

    const currentQ = questions[currentIdx];
    const newProgress: QuestionProgress = {
      questionId: currentQ.id,
      durationSeconds: duration,
      startTimeSeconds: startSec,
    };

    const updatedProgress = [...progressList, newProgress];
    setProgressList(updatedProgress);

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTimeLeft(questions[nextIdx].timeLimitSeconds || 60);
      questionStartTimeRef.current = Date.now();
    } else {
      finishAndSubmit(updatedProgress);
    }
  };

  // 5. Submit interview recording to Backend
  const uploadAndSubmitVideo = async (finalProgress: QuestionProgress[]) => {
    try {
      const chunks = recordedChunksRef.current;
      if (!chunks || chunks.length === 0) {
        throw new Error(
          isVi
            ? "Không tìm thấy dữ liệu video đã ghi lại. Vui lòng thử lại!"
            : "No recorded video data found. Please try again!",
        );
      }

      const fullVideoBlob = new Blob(chunks, { type: "video/webm" });
      const videoFile = new File([fullVideoBlob], `interview_${sessionId}.webm`, {
        type: "video/webm",
      });

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("progress", JSON.stringify({ questionProgresses: finalProgress }));

      await submitMutation.mutateAsync({
        sessionId: sessionId!,
        formData,
      });

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      setStage("FINISHED");
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const msg = getApiErrorMessage(err);
      alert(msg);
      setStage("RECORDING");
    }
  };

  const finishAndSubmit = (finalProgress: QuestionProgress[]) => {
    setStage("SUBMITTING");

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = () => {
        uploadAndSubmitVideo(finalProgress);
      };
      recorder.stop();
    } else {
      uploadAndSubmitVideo(finalProgress);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f17] text-white">
        <Loader2 className="size-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (session && (session.status === "EVALUATING" || session.status === "COMPLETED" || session.mediaRecordUrl)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0b0f17] text-white p-6 text-center">
        <CheckCircle2 className="size-14 text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold">
          {isVi
            ? "Buổi phỏng vấn này đã được hoàn tất!"
            : "This interview session has already been submitted!"}
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          {isVi
            ? "Video của bạn đã được lưu trữ an toàn trên Cloud. Vui lòng chuyển tới trang chi tiết đơn ứng tuyển để xem tiến độ đánh giá hoặc yêu cầu chấm lại nếu cần."
            : "Your video has been saved safely on Cloud. Please view your application detail page to check evaluation progress or request a retry."}
        </p>
        <Button
          onClick={() => navigate("/applications")}
          className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 cursor-pointer"
        >
          {isVi ? "Xem đơn ứng tuyển" : "View Application"}
        </Button>
      </div>
    );
  }

  if (isError || !questions.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0b0f17] text-white p-6">
        <ShieldAlert className="size-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">
          {isVi
            ? "Không tìm thấy buổi phỏng vấn hoặc câu hỏi chưa sẵn sàng!"
            : "Interview session not found or questions are not ready!"}
        </h2>
        <Button onClick={() => navigate("/applications")} className="mt-4 bg-slate-800 cursor-pointer">
          {isVi ? "Quay lại" : "Back"}
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f17] text-white select-none">
      <InterviewHeader sessionId={sessionId} isRecording={stage === "RECORDING"} />

      {stage === "DEVICE_CHECK" && (
        <DeviceSetupView
          videoPreviewRef={videoPreviewRef}
          hasPermission={hasPermission}
          audioLevel={audioLevel}
          onRetryPermission={initMedia}
          onStartInterview={handleStartInterview}
        />
      )}

      {stage === "RECORDING" && currentQ && (
        <RecordingView
          currentQuestion={currentQ}
          currentIdx={currentIdx}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          audioLevel={audioLevel}
          videoPreviewRef={videoPreviewRef}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {stage === "SUBMITTING" && <SubmittingView />}

      {stage === "FINISHED" && <FinishedView />}
    </div>
  );
}
