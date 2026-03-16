import questionBank from "./slamdunk-questions.json";
import type { Theme, Question } from "./types";

export const slamdunkTheme: Theme = {
  id: "slamdunk",
  name: "슬램덩크 덕후 테스트",
  subtitle: "북산의 열기부터 산왕전까지, 당신의 농구 덕력은 몇 점인가?",
  badge: "Slam Dunk",
  accent: "#dc2626",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "슬램덩크 덕후 테스트 - 당신은 전국대회 레벨 팬인가?",
    description:
      "강백호, 서태웅, 채치수, 북산과 산왕까지! 슬램덩크 찐팬만 풀 수 있는 문제 20선",
  },
};
