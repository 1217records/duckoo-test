import questionBank from "./aot-questions.json";
import type { Theme, Question } from "./types";

export const aotTheme: Theme = {
  id: "aot",
  name: "진격의 거인 덕후 테스트",
  subtitle: "벽 안과 벽 밖의 진실, 당신은 어디까지 기억하고 있나?",
  badge: "Attack on Titan",
  accent: "#6b7280",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "진격의 거인 덕후 테스트 - 당신은 조사병단 핵심 전력인가?",
    description:
      "에렌, 리바이, 지크, 마레, 길, 거인의 계승까지! 진격의 거인 찐팬만 풀 수 있는 문제 20선",
  },
};
