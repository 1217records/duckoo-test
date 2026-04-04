import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestClient from "./TestClient";
import { getTheme } from "@/lib/tests/registry";

type Props = { params: Promise<{ themeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { themeId } = await params;
  const theme = getTheme(themeId);

  if (!theme) {
    return { title: "테스트를 찾을 수 없습니다" };
  }

  return {
    title: theme.seo.title,
    description: theme.seo.description,
    openGraph: {
      title: theme.seo.title,
      description: theme.seo.description,
      images: ["/og.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: theme.seo.title,
      description: theme.seo.description,
      images: ["/og.png"],
    },
  };
}

export default async function TestPage({ params }: Props) {
  const { themeId } = await params;
  const theme = getTheme(themeId);
  if (!theme) notFound();

  // 구글 봇에게 퀴즈 문제들을 그대로 읽게 해주는 JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": theme.name,
    "description": theme.seo.description,
    "hasPart": theme.questions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.options[q.answerIndex]
      },
      "suggestedAnswer": q.options.map((opt) => ({
        "@type": "Answer",
        "text": opt
      }))
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TestClient theme={theme} />
    </>
  );
}
