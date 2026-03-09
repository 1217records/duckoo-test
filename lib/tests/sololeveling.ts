import questionBank from "./sololeveling-questions.json";
import type { Theme, Question } from "./types";

export const sololevelingTheme: Theme = {
    id: "sololeveling",
    name: "나 혼자만 레벨업 덕후 테스트",
    subtitle: "일어나라... 당신의 진정한 덕력을 증명할 시간이다.",
    badge: "Solo Leveling",
    accent: "#4c1d95",
    questionCount: 20,
    questions: questionBank as unknown as Question[],
    seo: {
        title: "나 혼자만 레벨업 덕후 테스트 - 나는 그림자 군주인가?",
        description:
            "나 혼자만 레벨업 웹툰 및 애니메이션 세계관 덕력 고사! 성진우, 그림자 군단, 국가 권력급 헌터 지식을 테스트합니다.",
    },
};
