"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wand2, Gamepad2, Play, Flame, Search, Award, Share2, Asterisk, Clapperboard, Shield, BookOpen, CheckCircle, Pencil, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE = {
  name: "duckoo-player-name"
};

const DEFAULT_PLAYER_NAME = "익명 덕후";

const faqData = [
  {
    q: "테스트는 무료인가요?",
    a: "네, 덕후테스트의 모든 테스트는 완전 무료로 제공됩니다. 회원가입이나 로그인도 필요 없이 닉네임 하나만 입력하면 바로 시작할 수 있습니다."
  },
  {
    q: "문제는 매번 달라지나요?",
    a: "네! 방대한 문제 은행에서 매 테스트마다 20문제가 무작위로 출제됩니다. 같은 테스트를 여러 번 도전해도 새로운 문제들을 만날 수 있어 반복 학습 효과도 있습니다."
  },
  {
    q: "점수는 어떻게 계산되나요?",
    a: "난이도(상/중/하)에 따라 배점이 다르게 적용됩니다. 어려운 문제일수록 더 높은 점수를 얻을 수 있으며, 최종 점수에 따라 고유한 칭호와 등급이 부여됩니다."
  },
  {
    q: "인증서를 받으려면 어떻게 해야 하나요?",
    a: "테스트를 완료하면 자동으로 결과 페이지가 표시되며, 이름과 점수, 등급이 새겨진 공식 인증서를 바로 다운로드하거나 소셜 미디어에 공유할 수 있습니다."
  },
  {
    q: "앞으로 어떤 테스트가 추가되나요?",
    a: "현재 나루토, 해리포터, 블리치 테스트를 준비 중입니다. 사용자 제안과 투표를 반영하여 지속적으로 테마를 확장해 나갑니다."
  }
];

export default function HomeClient() {
  const [name, setName] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>("onepiece");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const startTest = (themeId: string) => {
    const trimmed = name.trim();
    localStorage.setItem(STORAGE.name, trimmed || DEFAULT_PLAYER_NAME);
    router.push(`/test/${themeId}`);
  };

  return (
    <div className="shell">
      <main className="hero">
        <div className="hero-content">
          <p className="eyebrow">otaku archive</p>
          <h1>테스트 둘러보기</h1>
          <p className="lead">애니, 영화, 게임 등 다양한 분야의 진정한 덕후를 가려냅니다. 당신의 덕력을 뽐내보세요.</p>
        </div>

        <section className="themeGrid" style={{ flexWrap: 'wrap', gap: '32px' }}>
          {/* One Piece Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card onepiece-card ${activeTheme === 'onepiece' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'onepiece' ? null : 'onepiece')}
          >
            {activeTheme !== 'onepiece' ? (
              <>
                <Play size={18} className="icon-left" />
                원피스 테스트
              </>
            ) : (
              <>
                <div className="card-header onepiece-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px' }}><Flame size={12} className="icon-left" />인기</span>
                  <h2 className="accordion-title">원피스 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    루피와 함께 위대한 항로를 개척할 준비가 되셨나요? 세계관, 인물, 스토리를 심층 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 밀짚모자)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton" type="button" onClick={(e) => { e.stopPropagation(); startTest("onepiece"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 시작하기
                  </button>
                </div>
              </>
            )}
          </article>

          {/* League of Legends Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card lol-card ${activeTheme === 'lol' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'lol' ? null : 'lol')}
            style={{ "--primary-color": "#c8aa6e" } as React.CSSProperties}
          >
            {activeTheme !== 'lol' ? (
              <>
                <Play size={18} className="icon-left" />
                리그 오브 레전드 테스트
              </>
            ) : (
              <>
                <div className="card-header lol-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px' }}><Gamepad2 size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">리그 오브 레전드 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    소환사의 협곡에서 펼쳐지는 당신의 지식! 챔피언, 세계관, 게임 메커니즘을 마스터했나요?
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-lol"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: Hide on bush #KR1)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton lol-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("lol"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          {/* Fullmetal Alchemist Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card fma-card ${activeTheme === 'fma' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'fma' ? null : 'fma')}
            style={{ "--primary-color": "#b91c1c" } as React.CSSProperties}
          >
            {activeTheme !== 'fma' ? (
              <>
                <Play size={18} className="icon-left" />
                강철의 연금술사 테스트
              </>
            ) : (
              <>
                <div className="card-header fma-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #b91c1c, #991b1b)' }}><Shield size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">강철의 연금술사 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    등가교환의 법칙을 넘어선 진정한 연금술 마니아인가요? 캐릭터, 스토리, 세계관을 완벽히 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-fma"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 강철의 연금술사)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton fma-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("fma"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          {/* Pokémon Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card pokemon-card ${activeTheme === 'pokemon' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'pokemon' ? null : 'pokemon')}
            style={{ "--primary-color": "#16a34a" } as React.CSSProperties}
          >
            {activeTheme !== 'pokemon' ? (
              <>
                <Play size={18} className="icon-left" />
                포켓몬스터 1-2세대 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header pokemon-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}><Gamepad2 size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">포켓몬스터 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    관동·성도 지방의 진정한 포켓몬 마스터를 가려냅니다! 1~2세대 스타터, 전설 포켓몬, 체육관까지 완벽히 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-pokemon"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 포켓몬마스터)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton pokemon-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("pokemon"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          {/* Diablo 2 Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card diablo2-card ${activeTheme === 'diablo2' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'diablo2' ? null : 'diablo2')}
            style={{ "--primary-color": "#9f1414" } as React.CSSProperties}
          >
            {activeTheme !== 'diablo2' ? (
              <>
                <Play size={18} className="icon-left" />
                디아블로 2 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header diablo2-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #dc2626, #7f1d1d)' }}><Flame size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">디아블로 2 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    성역의 수호자여! D2 + LoD + 악마술사의 군림 DLC까지 포함! 룬워드, 클래스, 보스 지식을 완벽히 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-diablo2"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 네팔렘)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton diablo2-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("diablo2"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          {/* Solo Leveling Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card sololeveling-card ${activeTheme === 'sololeveling' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'sololeveling' ? null : 'sololeveling')}
            style={{ "--primary-color": "#4c1d95" } as React.CSSProperties}
          >
            {activeTheme !== 'sololeveling' ? (
              <>
                <Play size={18} className="icon-left" />
                나 혼자만 레벨업 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header sololeveling-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #6d28d9, #312e81)' }}>웹툰/애니</span>
                  <h2 className="accordion-title">나 혼자만 레벨업 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    성진우와 그림자 군단의 이야기! 등장인물, 헌터 랭킹, 세계관의 심층 지식을 검증합니다. 당신도 그림자 군주가 될 수 있을까요?
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-sololeveling"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 성진우, 이그리트)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton sololeveling-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("sololeveling"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          {/* MCU Test Card */}
          <article
            className={`themeCard highlighted-card accordion-card mcu-card ${activeTheme === 'mcu' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'mcu' ? null : 'mcu')}
            style={{ "--primary-color": "#d32f2f" } as React.CSSProperties}
          >
            {activeTheme !== 'mcu' ? (
              <>
                <Play size={18} className="icon-left" />
                MCU 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header mcu-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}><Clapperboard size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">마블 시네마틱 유니버스 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    아이언맨부터 어벤져스, 인피니티 사가, 멀티버스까지. 히어로, 빌런, 스톤, 명장면을 모두 꿰고 있는지 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-mcu"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 어셈블마스터)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton mcu-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("mcu"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          <article
            className={`themeCard highlighted-card accordion-card aot-card ${activeTheme === 'aot' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'aot' ? null : 'aot')}
            style={{ "--primary-color": "#6b7280" } as React.CSSProperties}
          >
            {activeTheme !== 'aot' ? (
              <>
                <Play size={18} className="icon-left" />
                진격의 거인 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header aot-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #4b5563, #111827)' }}><Shield size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">진격의 거인 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    시가시나부터 마레, 길과 땅울림까지. 복선, 세계관, 계승 구조를 얼마나 정확히 이해하고 있는지 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-aot"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 조사병단)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton aot-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("aot"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          <article
            className={`themeCard highlighted-card accordion-card slamdunk-card ${activeTheme === 'slamdunk' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'slamdunk' ? null : 'slamdunk')}
            style={{ "--primary-color": "#dc2626" } as React.CSSProperties}
          >
            {activeTheme !== 'slamdunk' ? (
              <>
                <Play size={18} className="icon-left" />
                슬램덩크 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header slamdunk-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}><Award size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">슬램덩크 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    북산 5인방, 능남과 해남, 전국대회 산왕전까지. 명경기와 성장 서사를 얼마나 정확히 기억하는지 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-slamdunk"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 북산의 천재)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton slamdunk-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("slamdunk"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>

          <article
            className={`themeCard highlighted-card accordion-card hxh-card ${activeTheme === 'hxh' ? 'expanded' : ''}`}
            onClick={() => setActiveTheme(activeTheme === 'hxh' ? null : 'hxh')}
            style={{ "--primary-color": "#16a34a" } as React.CSSProperties}
          >
            {activeTheme !== 'hxh' ? (
              <>
                <Play size={18} className="icon-left" />
                헌터x헌터 덕후 테스트
              </>
            ) : (
              <>
                <div className="card-header hxh-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="chip" style={{ margin: 0, padding: '4px 8px', background: 'linear-gradient(135deg, #22c55e, #15803d)' }}><Gamepad2 size={12} className="icon-left" />NEW</span>
                  <h2 className="accordion-title">헌터x헌터 덕후 테스트</h2>
                </div>

                <div className="card-expanded-content">
                  <p className="accordion-description">
                    헌터 시험, 요크신, 그리드 아일랜드, 키메라 앤트, 넨 계통까지. 설정과 심리전을 얼마나 깊게 이해하는지 검증합니다.
                  </p>
                  <div className="accordion-info-box">
                    <span className="info-icon">💡</span>
                    <span className="info-text">
                      방대한 문제 은행에서 <strong>무작위로 20문제</strong>가 출제되며, 난이도(상/중/하)에 따라 배점이 다릅니다.
                    </span>
                  </div>
                  <div className="input-group" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="nickname-hxh"
                      className="nicknameInput"
                      placeholder="인증서 닉네임 입력 (예: 프로헌터)"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <button className="startButton hxh-btn" type="button" onClick={(e) => { e.stopPropagation(); startTest("hxh"); }}>
                    <Play size={18} className="icon-left" />
                    테스트 바로 시작
                  </button>
                </div>
              </>
            )}
          </article>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-header">
            <h2>테스트 진행 방법</h2>
            <p className="lead">3단계로 간편하게 당신의 덕력을 증명하세요.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap"><Pencil size={28} /></div>
              <h3>닉네임 입력</h3>
              <p>결과 인증서에 새겨질 나만의 닉네임을 입력하세요. 회원가입이나 로그인은 전혀 필요 없습니다. 원하는 테스트 테마를 선택하고 닉네임을 입력하면 준비 완료!</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap"><BookOpen size={28} /></div>
              <h3>20문제 무작위 출제</h3>
              <p>방대한 문제 은행에서 난이도(상/중/하) 별로 무작위 20문제가 출제됩니다. 난이도에 따라 배점이 다르게 적용되므로 어려운 문제일수록 더 많은 점수를 획득할 수 있습니다.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap"><Award size={28} /></div>
              <h3>인증서 발급 & 공유</h3>
              <p>모든 문제를 완료하면 최종 점수와 나만의 칭호가 새겨진 공식 인증서가 자동 발급됩니다. 카카오톡, 인스타그램, X(트위터) 등 SNS에 공유하여 덕력을 인증하세요!</p>
            </div>
          </div>
        </section>

        {/* SEO & Informational Content Section for AdSense */}
        <section className="seo-info-section">
          <h2 className="seo-info-title">덕후테스트란 무엇인가요?</h2>
          <p className="seo-info-desc">
            덕후테스트(DUCKOO TEST)는 자신이 열광하는 애니메이션, 영화, K-POP, 게임 등 다양한 서브컬처 작품에 대한 지식과 애정을 수치화하여 확인할 수 있는 <strong>프리미엄 팬덤 퀴즈 플랫폼</strong>입니다. 단순한 심심풀이 테스트를 넘어, 마니아층의 니즈를 충족시키는 고난도의 심층적인 문항들을 제공합니다. 원작 세계관에 충실한 문제와 찐팬만 알 수 있는 숨겨진 설정까지, 진정한 덕후를 가려내기 위한 철저한 검증 시스템을 갖추고 있습니다.
          </p>

          <div className="seo-grid">
            <div className="seo-grid-item">
              <Search size={28} color="var(--primary-color)" className="seo-grid-item-icon" />
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 700 }}>정교한 문항 설계</h3>
              <p style={{ fontSize: '15px', color: 'var(--secondary-text-color)', lineHeight: 1.6 }}>작품의 세계관, 숨겨진 설정(이스터에그), 캐릭터의 대사 등 찐팬들만 알 수 있는 디테일한 문제로 구성됩니다. 단순 암기가 아닌 진정한 이해와 애정을 측정합니다.</p>
              <p style={{ fontSize: '14px', color: 'var(--primary-color)', marginTop: '8px', fontWeight: 600 }}>* 매번 20문제가 랜덤 출제되며 난이도별 차등 배점 적용</p>
            </div>
            <div className="seo-grid-item">
              <Award size={28} color="#8b5cf6" className="seo-grid-item-icon" />
              <h3>나만의 공식 인증서</h3>
              <p>모든 관문을 통과하면 최종 점수와 등급이 각인된 세련된 디자인의 공식 마스터 인증서를 발급해 드립니다. 테마별로 고유한 칭호가 부여되며, 이미지를 저장하거나 SNS에 바로 공유할 수 있습니다.</p>
            </div>
            <div className="seo-grid-item">
              <Share2 size={28} color="#0ea5e9" className="seo-grid-item-icon" />
              <h3>쉬운 캡처 및 공유</h3>
              <p>결과 이미지를 카카오톡, 인스타그램, X(트위터) 등 소셜 미디어와 팬 커뮤니티에 간편하게 공유하고 덕력을 인증하세요. 지인에게 도전을 권유하고 점수를 비교해보세요.</p>
            </div>
            <div className="seo-grid-item">
              <BarChart2 size={28} color="#f59e0b" className="seo-grid-item-icon" />
              <h3>오답 노트 시스템</h3>
              <p>테스트 종료 후 틀린 문제와 정답을 한눈에 확인할 수 있는 오답 노트를 제공합니다. 내가 놓친 원작 설정과 디테일을 복기하며 덕력을 더욱 성장시켜 보세요.</p>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2>자주 묻는 질문 (FAQ)</h2>
            <p className="lead">덕후테스트 이용에 대한 궁금증을 해결해 드립니다.</p>
          </div>
          <div className="faq-list">
            {faqData.map((item, idx) => (
              <div key={idx} className={`faq-item glass ${openFaq === idx ? 'faq-open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AdSense friendly content section */}
        <section className="upcoming-section">
          <div className="section-header">
            <h2>오픈 예정 테스트</h2>
            <p className="lead">곧 공개될 새로운 영역의 테스트들을 미리 확인하세요. 다양한 장르와 팬덤을 아우르는 새로운 테마들이 준비 중입니다.</p>
          </div>
          <div className="infoList">
            <article className="upcoming-card">
              <div className="upcoming-icon naruto-icon"><Asterisk size={28} /></div>
              <div className="upcoming-content">
                <h3>나루토 덕후 테스트</h3>
                <p>닌자 세계의 모든 것을 꿰뚫는 당신! 나루토, 사스케, 사쿠라의 숨겨진 설정부터 차크라 종류까지, 진정한 닌자 마스터를 가립니다.</p>
              </div>
            </article>
            <article className="upcoming-card">
              <div className="upcoming-icon hp-icon"><Wand2 size={28} /></div>
              <div className="upcoming-content">
                <h3>해리포터 마법사 테스트</h3>
                <p>호그와트 마법 학교의 비밀을 얼마나 알고 있나요? 주문, 마법생물, 기숙사 역사까지 세밀하게 검증하는 마법사 레벨 측정 테스트입니다.</p>
              </div>
            </article>
            <article className="upcoming-card">
              <div className="upcoming-icon" style={{ background: 'linear-gradient(135deg, #e53935, #b71c1c)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clapperboard size={28} /></div>
              <div className="upcoming-content">
                <h3>블리치 덕후 테스트</h3>
                <p>사신, 참백도, 호로, 만해, 천년혈전까지. 전투 시스템과 설정 위계가 뚜렷해 다음 장기 운영 테마로 적합한 후보입니다.</p>
              </div>
            </article>
          </div>
          <div className="suggestion-action">
            <Link href="/contact-suggestions" className="ghostButton">새로운 테스트 제안하기</Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bottom-cta-section">
          <div className="bottom-cta-content">
            <CheckCircle size={40} color="var(--primary-color)" />
            <h2>지금 바로 당신의 덕력을 검증해보세요!</h2>
            <p>덕후테스트는 회원가입 없이 즉시 플레이 가능합니다. 친구에게 도전장을 보내고 덕력 배틀을 시작해보세요. 인증서를 공유하고 진정한 마스터임을 증명하세요.</p>
            <Link href="/about" className="ghostButton" style={{ marginTop: '16px', display: 'inline-flex' }}>서비스 더 알아보기</Link>
          </div>
        </section>

      </main>
    </div>
  );
}
