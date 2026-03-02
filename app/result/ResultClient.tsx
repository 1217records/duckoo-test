"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { Download, MessageCircle, Instagram, Twitter, Share2, ClipboardCheck } from 'lucide-react';
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
  if (score <= 30) return "위대한 항로 루키";
  if (score <= 65) return "신세계 최악의 세대";
  if (score <= 94) return "사황";
  return "해적왕";
}

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
      const scale = isShare ? 2 : 4; // Kakao upload max is 5MB, 2 is safer for JPEG
      const canvas = await html2canvas(certificateRef.current, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      certificateRef.current.classList.remove('downloading');

      const type = isShare ? 'image/jpeg' : 'image/png';
      const quality = isShare ? 0.8 : 1.0;
      const dataUrl = canvas.toDataURL(type, quality);

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      return { dataUrl, blob };
    } catch (error) {
      console.error("이미지 생성 실패:", error);
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

    // Try to generate and upload certificate image
    try {
      const imageData = await generateCertificateImage(true);
      if (imageData) {
        const file = new File([imageData.blob], 'certificate.png', { type: 'image/png' });
        const uploadRes = await window.Kakao.Share.uploadImage({ file: [file] });
        console.log('Kakao uploadImage raw response:', uploadRes);

        // Try all known response formats
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
      // Auto-copy link to clipboard for Instagram Story "Link" sticker
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

      // Fallback: download the image and prompt user
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
    const text = `${shareText}\n나도 도전하기 →`;
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

  return (
    <div className="shell result-shell">
      <main className="panel glass result-panel">
        <div className="quiz-content-wrapper result-wrapper">
          <p className="chip">{result.themeName} RESULT</p>
          <h1 className="result-title">덕력 검증 결과</h1>

          <div className="certificate-container">

            <section
              className="certificate premium-cert"
              ref={certificateRef}
              style={{
                width: '100%',
                maxWidth: '450px',
                aspectRatio: '1 / 1',
                margin: '0 auto 40px auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '16px'
              }}
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
                  <p className="certRank" style={{ fontSize: '24px', marginTop: '8px', margin: 0 }}>{getRank(result.score, result.themeId)}</p>
                </div>

              </div>
            </section>

            <button type="button" className="downloadButton" onClick={handleDownloadImage}>
              <Download size={20} className="icon-left" />
              인증서 저장하기
            </button>
          </div>

          <div className="share-section">
            <p className="share-prompt">내 덕력 자랑하기</p>
            <div className="share-buttons">
              <button type="button" className="social-btn kakao-btn" onClick={handleKakaoShare} aria-label="카카오톡으로 공유">
                <MessageCircle size={24} />
              </button>
              <button type="button" className="social-btn ig-btn" onClick={handleInstagramShare} aria-label="인스타그램으로 공유">
                <Instagram size={24} />
              </button>
              <button type="button" className="social-btn x-btn" onClick={handleTwitterShare} aria-label="X로 공유">
                <Twitter size={24} />
              </button>
              <button type="button" className="social-btn link-btn" onClick={handleWebShare} aria-label="기타 공유">
                <Share2 size={24} />
              </button>
            </div>
          </div>

          <div className="action-row">
            <Link href={`/test/${themeId}`} className="ghostButton action-btn">
              다시 도전
            </Link>
            <Link href="/" className="startButton action-btn">
              다른 테스트 하기
            </Link>
          </div>

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
