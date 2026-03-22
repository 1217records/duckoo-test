import questionBank from "./orv-questions.json";
import type { Theme, Question } from "./types";

export const orvTheme: Theme = {
  id: "orv",
  name: "전지적 독자 시점 덕후 테스트",
  subtitle: "멸망한 세계에서 살아남을 유일한 독자는 누구인가!",
  badge: "ORV",
  accent: "#1e3a8a",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "전지적 독자 시점 덕후 테스트 - 나는 구원의 마왕일까?",
    description: "전독시 덕력 고사! 성좌, 시나리오, 김독자 컴퍼니와 멸살법에 대한 지식을 테스트합니다.",
  },
};
