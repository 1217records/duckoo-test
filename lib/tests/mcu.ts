import questionBank from "./mcu-questions.json";
import type { Theme, Question } from "./types";

export const mcuTheme: Theme = {
  id: "mcu",
  name: "마블 시네마틱 유니버스 덕후 테스트",
  subtitle: "인피니티 사가부터 멀티버스까지, 당신은 어셈블 마스터인가?",
  badge: "MCU",
  accent: "#d32f2f",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  seo: {
    title: "MCU 덕후 테스트 - 당신은 진짜 어벤져스 브레인인가?",
    description:
      "아이언맨, 캡틴 아메리카, 타노스, 멀티버스까지! 마블 시네마틱 유니버스 찐팬만 풀 수 있는 문제 20선",
  },
};
