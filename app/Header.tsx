"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { MessageCircle, Twitter, Link as LinkIcon, ClipboardCheck } from 'lucide-react';
import { useToast } from './Toast';

const SITE_URL = "https://duckootest.pages.dev";

export default function Header() {
  const pathname = usePathname();
  const { showToast } = useToast();

  const shareTitle = "덕후테스트 - 최애 작품 덕력을 증명하세요!";
  const shareDescription = "애니, 영화, 게임 등 다양한 분야의 진정한 덕후를 가려냅니다. 당신의 덕력을 뽐내보세요.";
  const shareUrl = SITE_URL;

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareDescription,
          imageUrl: `${SITE_URL}/og.png?v=3`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '덕력 테스트 하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      showToast("카카오톡 SDK를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleTwitterShare = () => {
    const text = `${shareTitle}\n${shareDescription}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("✅ 링크가 복사되었습니다!");
    } catch {
      showToast("링크 복사에 실패했습니다.");
    }
  };

  return (
    <header className="topbar glass-header">
      <Link href="/" className="brand">
        <ClipboardCheck size={28} className="brand-icon" />
        <span className="brand-text">덕후테스트</span>
      </Link>
      <nav className="navLinks">
        <button className="iconButton kakao" onClick={handleKakaoShare} aria-label="카카오톡 공유">
          <MessageCircle size={22} />
        </button>
        <button className="iconButton x" onClick={handleTwitterShare} aria-label="X 공유">
          <Twitter size={22} />
        </button>
        <button className="iconButton copy-link" onClick={handleCopyLink} aria-label="링크 복사">
          <LinkIcon size={22} />
        </button>
      </nav>
    </header>
  );
}
