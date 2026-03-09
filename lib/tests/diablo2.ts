import questionBank from "./diablo2-questions.json";
import type { Theme, Question } from "./types";

export const diablo2Theme: Theme = {
    id: "diablo2",
    name: "디아블로 2 덕후 테스트",
    subtitle: "성역의 수호자여, 당신의 지식은 어느 수준인가?",
    badge: "Diablo II",
    accent: "#9f1414",
    questionCount: 20,
    questions: questionBank as unknown as Question[],
    seo: {
        title: "디아블로 2 덕후 테스트 - 당신은 진정한 네팔렘인가?",
        description:
            "디아블로 2 + LoD + 악마술사의 군림까지! 룬워드, 클래스, 보스, 메카닉을 아는 찐팬만 푸는 문제 20선",
    },
};
