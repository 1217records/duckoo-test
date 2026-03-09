"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { Download, MessageCircle, Instagram, Twitter, Share2, ClipboardCheck, ExternalLink, BookOpen, Play, Hash } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '../Toast';

const SITE_URL = "https://duckootest.pages.dev";

interface ReviewItem {
  question: string;
  options: string[];
  answerIndex: number;
  selectedIndex: number | null;
}

interface SavedResult {
  themeId: string;
  themeName: string;
  player: string;
  score: number;
  correct: number;
  rawPoints: number;
  totalPoints: number;
  totalCount: number;
  review: ReviewItem[];
}

const STORAGE_KEY = "duckoo-last-result";

function getRank(score: number, themeId: string): string {
  if (themeId === "lol") {
    if (score <= 15) return "아이언";
    if (score <= 30) return "브론즈";
    if (score <= 45) return "실버";
    if (score <= 60) return "골드";
    if (score <= 75) return "플래티넘";
    if (score <= 85) return "다이아몬드";
    if (score <= 95) return "마스터";
    return "챌린저";
  }

  if (themeId === "fma") {
    if (score <= 30) return "연금술 입문생";
    if (score <= 60) return "은시계의 연금술사";
    if (score <= 85) return "국가 연금술사";
    return "진리를 본 자";
  }

  // Default (One Piece)
  if (score <= 24) return "이스트 블루 루키";
  if (score <= 49) return "위대한 항로 모험가";
  if (score <= 69) return "최악의 세대";
  if (score <= 84) return "사황 간부";
  if (score <= 94) return "사황";
  return "해적왕";
}

// 테마별 메타 정보
const THEME_META: Record<string, {
  emoji: string;
  color: string;
  gradient: string;
  hashtags: string[];
  links: { label: string; url: string; desc: string }[];
  otherThemes: { id: string; name: string; emoji: string; desc: string; color: string }[];
}> = {
  onepiece: {
    emoji: "⛵",
    color: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    hashtags: ["#원피스덕후테스트", "#덕후테스트", "#원피스", "#ONEPIECE", "#해적왕"],
    links: [
      { label: "원피스 나무위키", url: "https://namu.wiki/w/%EC%9B%90%ED%94%BC%EC%8A%A4(%EB%A7%8C%ED%99%94)", desc: "원피스의 방대한 세계관을 정리한 나무위키" },
      { label: "원피스 공식 사이트", url: "https://one-piece.com", desc: "원피스 일본 공식 홈페이지" },
      { label: "원피스 공식 X", url: "https://twitter.com/OPcom_info", desc: "원피스 공식 트위터/X 계정" },
    ],
    otherThemes: [
      { id: "lol", name: "리그 오브 레전드 테스트", emoji: "⚔️", desc: "소환사의 협곡에서 펼쳐지는 지식 배틀! LoL 찐팬을 가려냅니다.", color: "#c8aa6e" },
      { id: "fma", name: "강철의 연금술사 테스트", emoji: "🔱", desc: "등가교환의 세계! FMA 마니아의 덕력을 검증합니다.", color: "#b91c1c" },
    ],
  },
  lol: {
    emoji: "⚔️",
    color: "#c8aa6e",
    gradient: "linear-gradient(135deg, #c8aa6e, #937341)",
    hashtags: ["#롤덕후테스트", "#덕후테스트", "#리그오브레전드", "#LeagueOfLegends", "#LoL"],
    links: [
      { label: "LoL 나무위키", url: "https://namu.wiki/w/%EB%A6%AC%EA%B7%B8%20%EC%98%A4%EB%B8%8C%20%EB%A0%88%EC%A0%84%EB%93%9C", desc: "LoL의 챔피언·세계관 정보를 담은 나무위키" },
      { label: "LoL 유니버스", url: "https://universe.leagueoflegends.com/ko_KR/", desc: "룬테라 세계관을 탐험하는 공식 사이트" },
      { label: "LoL 공식 사이트", url: "https://www.leagueoflegends.com/ko-kr/", desc: "리그 오브 레전드 한국 공식 홈페이지" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
      { id: "fma", name: "강철의 연금술사 테스트", emoji: "🔱", desc: "등가교환의 세계! FMA 마니아의 덕력을 검증합니다.", color: "#b91c1c" },
    ],
  },
  fma: {
    emoji: "🔱",
    color: "#b91c1c",
    gradient: "linear-gradient(135deg, #b91c1c, #991b1b)",
    hashtags: ["#강철의연금술사덕후테스트", "#덕후테스트", "#강철의연금술사", "#FMA", "#FullmetalAlchemist"],
    links: [
      { label: "FMA 나무위키", url: "https://namu.wiki/w/%EA%B0%95%EC%B2%A0%EC%9D%98%20%EC%97%B0%EA%B8%88%EC%88%A0%EC%82%AC", desc: "강철의 연금술사 세계관·캐릭터 나무위키" },
      { label: "FMA Brotherhood", url: "https://namu.wiki/w/%EA%B0%95%EC%B2%A0%EC%9D%98%20%EC%97%B0%EA%B8%88%EC%88%A0%EC%82%AC%20BROTHERHOOD", desc: "브라더후드 시리즈 상세 정보" },
      { label: "FMA 공식 X", url: "https://twitter.com/hagaren_anime", desc: "강철의 연금술사 공식 트위터/X 계정" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
      { id: "lol", name: "리그 오브 레전드 테스트", emoji: "⚔️", desc: "소환사의 협곡에서 펼쳐지는 지식 배틀!", color: "#c8aa6e" },
    ],
  },
};

export default function ResultClient() {
  const [result, setResult] = useState<SavedResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const searchParams = useSearchParams();
  const themeId = searchParams.get("theme") ?? "onepiece";
  const certificateRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SavedResult;
      if (parsed.themeId === themeId) {
        setResult(parsed);
      }
    } catch {
      setResult(null);
    }

    setLoaded(true);
  }, [themeId]);

  const wrongAnswers = useMemo(() => {
    if (!result) return [];
    return result.review.filter((item) => item.selectedIndex !== item.answerIndex);
  }, [result]);

  const shareUrl = `${SITE_URL}/result?theme=${themeId}`;
  const shareText = result ? `[${result.themeName}] ${result.player} 님은 ${result.score}점 (${getRank(result.score, result.themeId)}) 달성!` : "";
  const shareTitle = "덕후테스트 결과";
  const shareDescription = result ? `${result.totalCount}문제 중 ${result.correct}개 정답! 나도 도전하기 →` : "";

  const generateCertificateImage = async (isShare = false): Promise<{ dataUrl: string, blob: Blob } | null> => {
    if (!certificateRef.current) return null;
    try {
      certificateRef.current.classList.add('downloading');
      const scale = isShare ? 2 : 4;
      const canvas = await html2canvas(certificateRef.current, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      certificateRef.current.classList.remove('downloading');

      const type = isShare ? 'image/jpeg' : 'image/png';
      const quality = isShare ? 0.8 : 1.0;
      const dataUrl = canvas.toDataURL(type, quality);

      // canvas.toBlob() 방식으로 blob 변환 (fetch보다 안정적)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('toBlob 실패'));
          },
          type,
          quality
        );
      });

      return { dataUrl, blob };
    } catch (error) {
      console.error("이미지 생성 실패:", error);
      if (certificateRef.current) {
        certificateRef.current.classList.remove('downloading');
      }
      return null;
    }
  };

  const handleDownloadImage = async () => {
    const imageData = await generateCertificateImage(false);
    if (!imageData) {
      alert("이미지 저장 중 오류가 발생했습니다.");
      return;
    }

    const link = document.createElement("a");
    link.href = imageData.dataUrl;
    link.download = `duckoo_certificate_${result?.player || 'result'}.png`;
    link.click();
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        showToast("✅ 결과가 클립보드에 복사되었습니다!");
      } catch {
        showToast("복사에 실패했습니다.");
      }
    }
  };

  const handleKakaoShare = async () => {
    if (!result) return;

    if (typeof window === 'undefined' || !window.Kakao || !window.Kakao.isInitialized()) {
      showToast("카카오톡 SDK를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    let imageUrl = `${SITE_URL}/logo.png?v=2`;

    try {
      const imageData = await generateCertificateImage(true);
      if (imageData) {
        const file = new File([imageData.blob], 'certificate.png', { type: 'image/png' });
        const uploadRes = await window.Kakao.Share.uploadImage({ file: [file] });
        console.log('Kakao uploadImage raw response:', uploadRes);

        if (uploadRes?.infos?.original?.url) {
          imageUrl = uploadRes.infos.original.url;
        } else if (uploadRes?.imageUrl) {
          imageUrl = uploadRes.imageUrl;
        }
        console.log('Using imageUrl:', imageUrl);
      }
    } catch (err) {
      console.warn('Kakao image upload failed:', err);
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${shareTitle} - ${getRank(result.score, result.themeId)}`,
        description: `${result.player} 님의 ${result.themeName} ${result.score}점! ${shareDescription}`,
        imageUrl,
        link: {
          mobileWebUrl: `${SITE_URL}`,
          webUrl: `${SITE_URL}`,
        },
      },
      buttons: [
        {
          title: '나도 덕력 테스트 하기',
          link: {
            mobileWebUrl: `${SITE_URL}`,
            webUrl: `${SITE_URL}`,
          },
        },
      ],
    });
  };

  const handleInstagramShare = async () => {
    try {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("🔗 링크가 복사되었습니다! 인스타그램 스토리에 붙여넣기 해보세요.");
      } catch (clipboardError) {
        console.warn("Failed to copy link to clipboard", clipboardError);
      }

      const imageData = await generateCertificateImage(true);

      if (imageData && navigator.canShare) {
        const file = new File([imageData.blob], 'duckoo_certificate.jpg', { type: 'image/jpeg' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
          });
          return;
        }
      }

      if (imageData) {
        const link = document.createElement("a");
        link.href = imageData.dataUrl;
        link.download = `duckoo_certificate_${result?.player || 'result'}.jpg`;
        link.click();
        showToast("📸 인증서가 저장되었습니다. 인스타그램에서 업로드해주세요!");
      } else {
        showToast("이미지 생성에 실패했습니다.");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("인스타그램 공유 실패:", error);
        showToast("공유 중 오류가 발생했습니다.");
      }
    }
  };

  const handleTwitterShare = () => {
    const meta = THEME_META[themeId] ?? THEME_META["onepiece"];
    const tags = meta.hashtags.join(" ");
    const text = `${shareText}\n${tags}\n나도 도전하기 →`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`${SITE_URL}`)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!loaded) return null;

  if (!result) {
    return (
      <div className="shell">
        <main className="panel card-base-styles">
          <div className="quiz-content-wrapper">
            <h1>결과 정보가 없습니다</h1>
            <p className="lead">홈에서 테스트를 다시 시작해주세요.</p>
            <Link href="/" className="startButton">
              홈으로 이동
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const meta = THEME_META[themeId] ?? THEME_META["onepiece"];
  const rank = getRank(result.score, result.themeId);

  return (
    <div className="shell result-shell">
      <main className="panel glass result-panel">
        <div className="quiz-content-wrapper result-wrapper">
          <p className="chip">{result.themeName} RESULT</p>
          <h1 className="result-title">덕력 검증 결과</h1>

          {/* 인증서 */}
          <div className="certificate-container">
            <section
              className="certificate premium-cert"
              ref={certificateRef}
            >
              <div
                className="cert-inner"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '24px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.08,
                    zIndex: -1,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{
                    backgroundColor: '#4f46e5',
                    borderRadius: '50%',
                    width: '350px',
                    height: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ClipboardCheck size={180} color="white" strokeWidth={1.5} />
                  </div>
                </div>

                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ height: '2px', width: '24px', backgroundColor: '#4f46e5', opacity: 0.5, marginRight: '12px' }} />
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.2em', margin: 0 }}>OFFICIAL CERTIFICATE</p>
                    <div style={{ height: '2px', width: '24px', backgroundColor: '#4f46e5', opacity: 0.5, marginLeft: '12px' }} />
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.15em', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>덕후 인증서</h2>
                </div>

                <div style={{
                  backgroundColor: '#eef2ff',
                  padding: '12px 32px',
                  borderRadius: '16px',
                  display: 'inline-block',
                  marginBottom: '24px',
                  border: '2px solid #c7d2fe',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: '#4f46e5', margin: 0, letterSpacing: '0.05em' }}>{result.player}</p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <p className="certScore" style={{ fontSize: '64px', margin: 0 }}>{result.score}<span style={{ fontSize: '24px' }}>점</span></p>
                  <p className="certRank" style={{ fontSize: '24px', marginTop: '8px', margin: 0 }}>{rank}</p>
                </div>

              </div>
            </section>

            <button type="button" className="downloadButton" onClick={handleDownloadImage}>
              <Download size={20} className="icon-left" />
              인증서 저장하기
            </button>
          </div>

          {/* SNS 공유 섹션 - 강화 버전 */}
          <div className="share-section-enhanced glass">
            <div className="share-cta-text">
              <p className="share-cta-title">
                {meta.emoji} {result.player}님은 <strong style={{ color: meta.color }}>{rank}</strong> 등급!
              </p>
              <p className="share-cta-desc">
                이 결과를 친구들에게 자랑하고 덕력 배틀을 시작해보세요.
                아래 해시태그와 함께 공유하면 더 많은 덕후들과 교류할 수 있어요!
              </p>
              <div className="share-hashtags">
                {meta.hashtags.map((tag, i) => (
                  <span key={i} className="hashtag-chip">
                    <Hash size={11} />
                    {tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
            <div className="share-buttons-row">
              <button type="button" className="social-btn kakao-btn" onClick={handleKakaoShare} aria-label="카카오톡으로 공유">
                <MessageCircle size={22} />
                <span>카카오톡</span>
              </button>
              <button type="button" className="social-btn ig-btn" onClick={handleInstagramShare} aria-label="인스타그램으로 공유">
                <Instagram size={22} />
                <span>인스타그램</span>
              </button>
              <button type="button" className="social-btn x-btn" onClick={handleTwitterShare} aria-label="X로 공유">
                <Twitter size={22} />
                <span>X(트위터)</span>
              </button>
              <button type="button" className="social-btn link-btn" onClick={handleWebShare} aria-label="기타 공유">
                <Share2 size={22} />
                <span>링크 복사</span>
              </button>
            </div>
          </div>

          {/* 재도전 / 다른 테스트 */}
          <div className="action-row">
            <Link href={`/test/${themeId}`} className="ghostButton action-btn">
              다시 도전
            </Link>
            <Link href="/" className="startButton action-btn">
              다른 테스트 하기
            </Link>
          </div>

          {/* 다른 테스트 추천 카드 */}
          <section className="recommend-section">
            <h2 className="recommend-title">이런 테스트는 어떠세요?</h2>
            <p className="recommend-desc">
              {result.themeName}을 완료했군요! 다른 장르의 덕력도 검증해보세요.
            </p>
            <div className="recommend-grid">
              {meta.otherThemes.map((theme) => (
                <Link key={theme.id} href={`/`} className="recommend-card glass">
                  <div className="recommend-card-emoji" style={{ background: `linear-gradient(135deg, ${theme.color}22, ${theme.color}11)`, border: `1px solid ${theme.color}33` }}>
                    <span style={{ fontSize: '28px' }}>{theme.emoji}</span>
                  </div>
                  <div className="recommend-card-content">
                    <h3 className="recommend-card-title" style={{ color: theme.color }}>{theme.name}</h3>
                    <p className="recommend-card-desc">{theme.desc}</p>
                  </div>
                  <div className="recommend-card-action">
                    <Play size={16} />
                    <span>도전하기</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 관련 작품 소개 박스 */}
          <section className="related-works-section">
            <h2 className="related-works-title">
              <BookOpen size={20} />
              {result.themeName} 더 알아보기
            </h2>
            <p className="related-works-desc">
              테스트에서 틀린 문제가 있다면 아래 링크를 통해 원작을 더 깊이 탐구해보세요.
              다음에는 더 높은 점수로 돌아오세요!
            </p>
            <div className="related-links-grid">
              {meta.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="related-link-card glass"
                >
                  <div className="related-link-icon" style={{ background: meta.gradient }}>
                    <ExternalLink size={16} color="white" />
                  </div>
                  <div className="related-link-content">
                    <span className="related-link-label">{link.label}</span>
                    <span className="related-link-desc">{link.desc}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 오답 노트 */}
          <section className="reviewSection">
            <h3>오답 노트</h3>
            {wrongAnswers.length === 0 ? (
              <div className="perfect-score card-base-styles">
                <p className="lead">틀린 문제가 없습니다! 완벽한 마스터입니다. 🎉</p>
              </div>
            ) : (
              <ul className="wrong-list">
                {wrongAnswers.map((item, idx) => {
                  const selected = item.selectedIndex === null ? "미응답" : item.options[item.selectedIndex];
                  return (
                    <li key={`${item.question}-${idx}`} className="wrong-item glass">
                      <strong className="wrong-q">Q. {item.question}</strong>
                      <div className="wrong-answers">
                        <div className="your-answer">
                          <span className="label">내가 선택한 답</span>
                          <p className="value incorrect">{selected}</p>
                        </div>
                        <div className="correct-answer">
                          <span className="label">정답</span>
                          <p className="value correct">{item.options[item.answerIndex]}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
