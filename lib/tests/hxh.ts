import questionBank from "./hxh-questions.json";
import type { Theme, Question } from "./types";

export const hxhTheme: Theme = {
  id: "hxh",
  name: "헌터x헌터 덕후 테스트",
  subtitle: "헌터 시험부터 키메라 앤트 편까지, 당신의 넨 이해도는?",
  badge: "Hunter x Hunter",
  accent: "#16a34a",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "헌터x헌터 덕후 테스트 - 당신은 프로 헌터급 팬인가?",
    description:
      "곤, 킬아, 크라피카, 레오리오, 환영여단, 넨 계통까지! 헌터x헌터 찐팬만 풀 수 있는 문제 20선",
  },
};
