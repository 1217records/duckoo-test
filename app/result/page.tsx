import { Metadata } from 'next';
import { Suspense } from "react";
import ResultClient from "./ResultClient";
import { getTheme } from "@/lib/tests/registry";

type Props = { searchParams: Promise<{ theme?: string; score?: string; name?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const themeId = params.theme || "onepiece";
  const theme = getTheme(themeId);
  const score = params.score ? parseInt(params.score, 10) : null;
  const name = params.name || "익명 덕후";

  if (!theme) return { title: "테스트 결과" };

  const baseUrl = "https://duckootest.pages.dev";

  if (score !== null && !isNaN(score)) {
    return {
      title: `${name}님의 결과는 ${score}점! | ${theme.name}`,
      description: `${name}님이 ${theme.name}에서 ${score}점을 달성했습니다. 나도 도전해볼까요?`,
      alternates: {
        canonical: `${baseUrl}/result?theme=${theme.id}`
      },
      openGraph: {
        title: `${name}님의 결과: ${score}점! | ${theme.name}`,
        description: `나도 덕후 테스트에 도전해보세요!`,
        images: ["/og.png"],
      }
    };
  }

  return {
    title: `${theme.name} 결과`,
    alternates: {
      canonical: `${baseUrl}/result?theme=${theme.id}`
    }
  };
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="shell"><main className="panel glass"><p style={{ textAlign: 'center', marginTop: '2rem' }}>결과를 불러오는 중입니다...</p></main></div>}>
      <ResultClient />
    </Suspense>
  );
}
