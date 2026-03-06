import questionBank from "./onepiece-questions.json";
import type { Theme, Question } from "./types";

export const onepieceTheme: Theme = {
  id: "onepiece",
  name: "원피스 덕후 테스트",
  subtitle: "위대한 항로부터 신세계까지, 당신의 덕후력은?",
  badge: "One Piece",
  accent: "#b7792f",
  questionCount: 20,
  questions: questionBank as unknown as Question[],
  // ✏️ 카톡 공유 제목/설명 수정은 여기서! (lib/tests/onepiece.ts)
  seo: {
    title: "원피스 덕후 테스트 - 당신은 사황급인가요?",
    description:
      "해적왕을 꿈꾸는 당신의 원피스 지식을 검증합니다! 세계관, 악마의 열매, 현상금 등 찐팬만 아는 문제 20선",
  },
};
