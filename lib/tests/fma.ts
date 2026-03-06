import questionBank from "./fma-questions.json";
import type { Theme } from "./types";

export const fmaTheme: Theme = {
    id: "fma",
    name: "강철의 연금술사 덕후 테스트",
    subtitle: "등가교환의 법칙, 당신의 연금술 지식은?",
    badge: "Fullmetal Alchemist",
    accent: "#b91c1c",
    questionCount: 20,
    questions: questionBank as any,
    // ✏️ 카톡 공유 제목/설명 수정은 여기서! (lib/tests/fma.ts)
    seo: {
        title: "강철의 연금술사 덕후 테스트 - 진리의 문을 열 자격이 있는가?",
        description:
            "등가교환을 넘어선 진정한 연금술 마니아인가요? 캐릭터, 스토리, 세계관을 완벽히 검증하는 퀴즈 20문제",
    },
};
