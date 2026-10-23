export type QuestionCategory =
  | "PROJECT_DEEP_DIVE"
  | "TECHNICAL_CORE"
  | "SITUATIONAL"
  | "PROBLEM_SOLVING";

export type InterviewSessionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "EVALUATING"
  | "COMPLETED"
  | "EXPIRED";

export interface QuestionProgress {
  questionId: number;
  durationSeconds: number;
  startTimeSeconds: number;
}

export interface ReqSubmitInterviewDTO {
  questionProgresses: QuestionProgress[];
}

export interface ResInterviewQuestionDTO {
  id: number;
  orderIndex: number;
  category: QuestionCategory;
  timeLimitSeconds: number;
  durationSeconds?: number | null;
  startTimeSeconds?: number | null;

  questionText: string;
  questionTextVi?: string | null;
  questionTextEn?: string | null;

  transcribedText?: string | null;
  transcribedTextVi?: string | null;
  transcribedTextEn?: string | null;

  feedback?: string | null;
  feedbackVi?: string | null;
  feedbackEn?: string | null;

  accuracyScore?: number | null;
  speedFactor?: number | null;
  finalScore?: number | null;
  evidenceQuote?: string | null;
}

export interface ResInterviewSessionDTO {
  id: number;
  status: InterviewSessionStatus;
  totalScore?: number | null;
  aiOverallFeedback?: string | null;
  aiOverallFeedbackVi?: string | null;
  aiOverallFeedbackEn?: string | null;
  mediaRecordUrl?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  questions?: ResInterviewQuestionDTO[];
}
