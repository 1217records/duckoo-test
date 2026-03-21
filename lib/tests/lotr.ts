import questionBank from "./lotr-questions.json";
import type { Theme, Question } from "./types";

export const lotrTheme: Theme = {
  id: "lotr",
  name: "반지의 제왕 덕후 테스트",
  subtitle: "중간계의 평화는 당신의 지식에 달렸다!",
  badge: "LOTR",
  accent: "#ca8a04",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "반지의 제왕 덕후 테스트 - 나는 반지원정대인가?",
    description:
      "반지의 제왕 영화 및 원작 세계관 덕력 고사! 호빗, 엘프, 절대반지, 사우론에 대한 지식을 테스트합니다.",
  },
};
