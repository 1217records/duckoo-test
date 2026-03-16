import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestClient from "./TestClient";
import { getTheme, getThemes } from "@/lib/tests/registry";

type Props = { params: Promise<{ themeId: string }> };

export function generateStaticParams() {
  return getThemes().map((theme) => ({
    themeId: theme.id,
  }));
}

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

  return <TestClient theme={theme} />;
}
