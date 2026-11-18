export type BoardLayout = "flow" | "equation" | "compare" | "cycle" | "timeline" | "concept";
export type BoardShape = "card" | "circle";

export interface BoardNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  shape: BoardShape;
}

export interface BoardEdge {
  from: string;
  to: string;
  label: string;
}

export interface BoardScene {
  title: string;
  layout: BoardLayout;
  nodes: BoardNode[];
  edges: BoardEdge[];
}

export interface LessonChapter {
  id: string;
  title: string;
  narration: string;
  takeaway: string;
  board: BoardScene;
}

export interface LessonQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  topic: string;
  title: string;
  hook: string;
  objective: string;
  chapters: LessonChapter[];
  quiz: LessonQuiz;
  createdAt: string;
}

export interface LessonMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SavedLesson {
  id: string;
  topic: string;
  title: string;
  hook: string;
  objective: string;
  chapters: LessonChapter[];
  quiz: LessonQuiz;
  createdAt: string;
}
