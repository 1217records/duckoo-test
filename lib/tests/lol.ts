import questionBank from "./lol-questions.json";
import type { Theme } from "./types";

export const lolTheme: Theme = {
    id: "lol",
    name: "리그 오브 레전드 덕후 테스트",
    subtitle: "소환사의 협곡에서 당신의 티어는?",
    badge: "League of Legends",
    accent: "#c8aa6e",
    questionCount: 20,
    questions: questionBank as any,
    // ✏️ 카톡 공유 제목/설명 수정은 여기서! (lib/tests/lol.ts)
    seo: {
        title: "롤 덕후 테스트 - 소환사의 협곡 마스터 검증",
        description:
            "챔피언, 아이템, 세계관, 프로씬까지! 리그 오브 레전드 진짜 팬만 풀 수 있는 고난도 퀴즈 20문제",
    },
};
