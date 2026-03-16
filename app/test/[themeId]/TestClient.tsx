"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildQuiz, calculateResult } from "@/lib/quiz";
import type { Theme } from "@/lib/tests/types";

const STORAGE = {
  name: "duckoo-player-name",
  result: "duckoo-last-result"
};

const DEFAULT_PLAYER_NAME = "익명 덕후";

export default function TestClient({ theme }: { theme: Theme }) {
  const router = useRouter();
  const [player, setPlayer] = useState<string | null>(null);

  const quiz = useMemo(() => buildQuiz(theme.questions, theme.questionCount), [theme.questions, theme.questionCount]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(new Array(quiz.length).fill(null));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE.name);
    const playerName = stored?.trim() || DEFAULT_PLAYER_NAME;
    localStorage.setItem(STORAGE.name, playerName);
    setPlayer(playerName);
  }, [router]);

  if (!player) {
    return null;
  }

  const current = quiz[index];
  const progress = ((index + 1) / quiz.length) * 100;

  const choose = (choiceIndex: number) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = choiceIndex;
    setAnswers(nextAnswers);

    if (index < quiz.length - 1) {
      setIndex(index + 1);
      return;
    }

    const result = calculateResult(quiz, nextAnswers);
    const review = quiz.map((question, questionIndex) => ({
      question: question.question,
      options: question.options,
      answerIndex: question.answerIndex,
      selectedIndex: nextAnswers[questionIndex]
    }));

    const payload = {
      themeId: theme.id,
      themeName: theme.name,
      player: player,
      totalCount: quiz.length,
      ...result,
      review
    };

    localStorage.setItem(STORAGE.result, JSON.stringify(payload));
    router.push(`/result?theme=${theme.id}`);
  };

  return (
    <div className="shell">
      <main className="panel card-base-styles">
        <div className="quiz-content-wrapper">
          <p className="chip">{theme.badge}</p>
          <h1>{theme.name}</h1>
          <p className="lead">{theme.subtitle}</p>

          <div className="progressBox">
            <span>
              {index + 1} / {quiz.length}
            </span>
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="meta">난이도 {current.difficulty} | {current.points}점</div>
          <h2 className="question">{current.question}</h2>

          <div className="optionList">
            {current.options.map((option, choiceIndex) => (
              <button key={`${option}-${choiceIndex}`} className="optionButton" type="button" onClick={() => choose(choiceIndex)}>
                <span>{choiceIndex + 1}</span>
                {option}
              </button>
            ))}
          </div>

          <div className="buttonRow">
            <button type="button" className="ghostButton" onClick={() => setIndex((prev) => Math.max(0, prev - 1))}>
              이전 문제
            </button>
            <Link href="/" className="ghostButton">
              홈으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
