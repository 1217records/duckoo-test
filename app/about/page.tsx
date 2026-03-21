"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Compass, History, CheckCircle2, Target, Users, Zap, BookOpen, Heart, MessageSquare, ChevronDown, ChevronUp, Award, Globe, Shield } from 'lucide-react';

const faqItems = [
  {
    q: "덕후테스트는 어떤 서비스인가요?",
    a: "덕후테스트(DUCKOO TEST)는 애니메이션, 게임, 영화 등 서브컬처 콘텐츠에 대한 팬의 지식과 애정을 퀴즈 형식으로 측정하고 공식 인증서를 발급하는 팬덤 검증 플랫폼입니다. 2026년 서비스를 시작하였으며 지속적으로 테마를 확장하고 있습니다."
  },
  {
    q: "회원가입이나 개인정보 제공이 필요한가요?",
    a: "아니요, 전혀 필요 없습니다. 덕후테스트는 100% 무료로 제공되며 닉네임 하나만 입력하면 즉시 모든 서비스를 이용할 수 있습니다. 이메일 주소나 연락처 등 민감한 개인정보를 요구하지 않습니다."
  },
  {
    q: "테스트 문제는 어떻게 만들어지나요?",
    a: "각 작품의 원작 스토리, 세계관 설정집, 공식 인터뷰 등 검증된 자료를 바탕으로 문제가 제작됩니다. 난이도(상/중/하)로 구분되며, 단순 스토리 요약보다 디테일한 설정과 이스터에그를 중심으로 문항이 구성됩니다."
  },
  {
    q: "인증서는 어떻게 사용할 수 있나요?",
    a: "테스트 완료 후 결과 페이지에서 PNG 형식의 인증서 이미지를 다운로드할 수 있습니다. 카카오톡, 인스타그램, X(트위터) 등 소셜 미디어에 직접 공유하는 것도 가능합니다. 인증서에는 닉네임, 점수, 등급(칭호)이 포함됩니다."
  },
  {
    q: "새로운 테스트 테마를 요청할 수 있나요?",
    a: "네! 홈페이지의 '새로운 테스트 제안하기' 또는 '문의하기' 기능을 통해 원하는 작품을 제안해주시면 내부 검토 후 테마 추가를 검토합니다. 많은 요청을 받은 작품은 우선적으로 추가됩니다."
  },
  {
    q: "같은 테스트를 여러 번 해도 문제가 같나요?",
    a: "아닙니다. 방대한 문제 은행에서 매 시도마다 무작위로 20문제가 뽑혀 출제됩니다. 따라서 같은 테마를 반복해서 도전해도 매번 새로운 문제를 만날 수 있어 반복 학습과 재도전이 의미 있습니다."
  },
  {
    q: "광고가 표시되는 이유는 무엇인가요?",
    a: "덕후테스트는 서비스 운영 및 지속적인 문제 제작 비용을 충당하기 위해 Google AdSense를 통한 광고를 게재합니다. 광고 수익은 더 많은 테마와 양질의 문항을 제공하는 데 사용됩니다."
  }
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="shell">
      <main className="panel content-page glass">
        <div className="content-header">
          <p className="chip">ABOUT US</p>
          <h1 className="result-title">어덕행덕, 더 즐거운 덕질 라이프</h1>
          <p className="lead">우리는 영화, 애니메이션, 게임부터 K-POP에 이르기까지 무한한 팬덤 유니버스를 탐구하는 플랫폼, <strong>덕후테스트(DUCKOO TEST)</strong> 입니다.</p>
        </div>

        <section className="intro-hero">
          <h2>&ldquo;당신의 덕력은 어느 정도인가요?&rdquo;</h2>
          <p>덕후테스트는 누구나 손쉽게 자신의 &lsquo;덕력&rsquo;을 증명하고 서로 공유하며 즐길 수 있는 신개념 팬덤 검증 서비스입니다. 단순한 퀴즈를 넘어, 작품의 세계관과 스토리에 대한 심층적인 질문을 통해 진정한 마스터를 찾아냅니다. 원피스, 리그 오브 레전드, 강철의 연금술사, 포켓몬스터, 디아블로 2, 나 혼자만 레벨업, 블리치, 반지의 제왕, 마블 시네마틱 유니버스(MCU), 진격의 거인, 슬램덩크, 헌터x헌터 등을 시작으로 다양한 테마의 테스트가 지속적으로 추가되고 있습니다.</p>
        </section>

        {/* 서비스 철학 섹션 */}
        <section className="content-section card-base-styles">
          <h2>🌟 우리가 덕후테스트를 만든 이유</h2>
          <p style={{ marginBottom: '24px', lineHeight: 1.8, color: 'var(--secondary-text-color)' }}>
            우리는 팬덤 문화의 진정한 가치를 믿습니다. 좋아하는 작품을 깊이 탐구하고, 그 세계관에 녹아드는 과정은 단순한 취미를 넘어 삶을 풍요롭게 하는 소중한 경험입니다. 하지만 기존의 퀴즈 플랫폼들은 너무 단순하거나, 마니아들의 수준을 만족시키지 못하는 경우가 많았습니다.
          </p>
          <p style={{ marginBottom: '24px', lineHeight: 1.8, color: 'var(--secondary-text-color)' }}>
            덕후테스트는 이러한 간극을 채우기 위해 탄생했습니다. 찐팬이라면 반드시 알아야 할 설정, 스토리의 숨겨진 복선, 캐릭터의 숨겨진 배경까지 파고드는 전문성 높은 문항을 제공합니다. 그리고 그 결과를 멋진 인증서로 시각화하여, 자신의 팬심을 자랑스럽게 공유할 수 있는 문화를 만들어가고 있습니다.
          </p>
          <div className="philosophy-grid">
            <div className="philosophy-item">
              <Target size={24} color="var(--primary-color)" />
              <div>
                <h3>전문성</h3>
                <p>표면적인 지식이 아닌 원작의 심층적인 설정과 디테일을 검증합니다. 진정한 마스터만이 알 수 있는 문제들로 구성합니다.</p>
              </div>
            </div>
            <div className="philosophy-item">
              <Heart size={24} color="#ef4444" />
              <div>
                <h3>접근성</h3>
                <p>팬덤의 문턱을 낮춥니다. 회원가입 없이, 로그인 없이, 누구나 언제든 즐길 수 있는 완전 무료 서비스를 지향합니다.</p>
              </div>
            </div>
            <div className="philosophy-item">
              <Users size={24} color="#8b5cf6" />
              <div>
                <h3>커뮤니티</h3>
                <p>개인의 덕력 측정을 넘어, 팬들이 서로 결과를 공유하고 경쟁하며 함께 성장하는 팬덤 커뮤니티를 만들어갑니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section card-base-styles">
          <h2>🔥 덕후테스트가 제공하는 가치</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <Compass size={32} color="var(--primary-color)" className="feature-icon" />
              <h3>세밀한 세계관 검증</h3>
              <p>스토리 라인 겉핥기를 넘어서, 캐릭터의 설정 한 줄, 에피소드의 디테일까지 다루는 전문적이고 심층적인 문항들로 구성되어 본인의 팬심을 객관적으로 측정합니다. 난이도별로 문항이 분류되어 입문자부터 마니아까지 모두 즐길 수 있습니다.</p>
            </div>

            <div className="feature-card">
              <Sparkles size={32} color="#8b5cf6" className="feature-icon" />
              <h3>고품격 온라인 인증서</h3>
              <p>테스트 종료 후 제공되는 멋진 디자인의 공식 &lsquo;마스터 인증서&rsquo;를 다운로드 하세요. 칭호와 점수가 부여된 이미지를 소셜 미디어에 공유하고 내 덕력을 뽐낼 수 있습니다. 테마마다 다른 디자인과 칭호 시스템이 적용됩니다.</p>
            </div>

            <div className="feature-card">
              <History size={32} color="#0ea5e9" className="feature-icon" />
              <h3>친절한 오답 노트 시스템</h3>
              <p>점수만 알려주고 끝나는 테스트는 그만. 어디에서 내 팬심이 빗나갔는지 문항별로 피드백을 확인하고, 오답노트를 통해 내가 놓친 원작 설정의 매력을 다시금 탐구할 수 있습니다. 틀린 문제의 정답을 통해 새로운 지식을 습득하는 기회가 됩니다.</p>
            </div>

            <div className="feature-card">
              <Zap size={32} color="#f59e0b" className="feature-icon" />
              <h3>빠르고 직관적인 UI</h3>
              <p>최신 웹 기술로 구현된 매끄러운 인터페이스에서 불필요한 광고나 팝업 없이 테스트에만 집중할 수 있습니다. 모바일, 태블릿, PC 어떤 환경에서도 최적화된 경험을 제공합니다.</p>
            </div>
          </div>
        </section>

        {/* 테스트 주제 소개 */}
        <section className="content-section card-base-styles">
          <h2>📚 현재 제공 중인 테스트 테마</h2>
          <p style={{ marginBottom: '24px', lineHeight: 1.8, color: 'var(--secondary-text-color)' }}>
            현재 열두 가지 테마의 테스트가 운영 중이며, 각 테마는 수십 개의 문항으로 구성된 방대한 문제 은행을 보유하고 있습니다. 매 테스트마다 20문제가 무작위로 출제되어 반복 도전의 재미를 제공합니다.
          </p>
          <div className="theme-overview-list">
            <div className="theme-overview-item">
              <div className="theme-overview-badge onepiece-badge">인기 1위</div>
              <h3>⛵ 원피스 (ONE PIECE)</h3>
              <p>해적왕을 꿈꾸는 루피와 동료들의 이야기. 위대한 항로의 세계관, 악마의 열매, 칠무해, 사황, 해군 본부 등 방대한 원피스 세계의 디테일을 검증합니다. 등급: 위대한 항로 루키 → 신세계 최악의 세대 → 사황 → 해적왕</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge lol-badge">게임</div>
              <h3>⚔️ 리그 오브 레전드 (League of Legends)</h3>
              <p>소환사의 협곡 위에서 펼쳐지는 치열한 지식 배틀. 챔피언의 스킬과 배경 스토리, 룬테라 세계관, 게임 메커니즘까지 LoL 마스터의 자격을 검증합니다. 등급: 아이언 → 브론즈 → 실버 → 골드 → 플래티넘 → 다이아몬드 → 마스터 → 챌린저</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge fma-badge">NEW</div>
              <h3>🔱 강철의 연금술사 (Fullmetal Alchemist)</h3>
              <p>등가교환의 법칙으로 이루어진 세계. 에드워드와 알폰스의 여정, 연금술의 원리, 호문클루스의 정체, 암스트롱 일가의 비밀 등 FMA의 깊은 설정을 파고드는 문제들입니다. 등급: 연금술 입문생 → 은시계의 연금술사 → 국가 연금술사 → 진리를 본 자</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge pokemon-badge" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>애니/게임</div>
              <h3>🎮 포켓몬스터 1-2세대 (Pokémon)</h3>
              <p>관동 지방과 성도 지방을 휩쓸던 포켓몬 마스터의 지식! 1-2세대 포켓몬 도감 정보, 체육관 관장, 애니메이션 한국어 더빙판 기준의 폭넓은 지식을 검증합니다. 등급: 새내기 트레이너 → 포켓몬 수집가 → 체육관 배지 수집가 → 로켓단 저지선 → 사천왕 도전자 → 챔피언 → 포켓몬 마스터</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge diablo2-badge" style={{ background: 'linear-gradient(135deg, #dc2626, #7f1d1d)', color: 'white' }}>NEW/게임</div>
              <h3>🔥 디아블로 2 (Diablo II + LoD + Warlock DLC)</h3>
              <p>성역의 수호자여! 디아블로 2 레저렉션과 최근 출시된 악마술사의 군림 DLC까지, 룬어(룬워드), 클래스 스킬트리, 우버 보스 등 하드코어한 지식을 모았습니다. 등급: 노멀 모험가 → 나이트메어 생존자 → 헬 정복자 → 우버 헌터 → 네팔렘 → 성역의 수호자</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge sololeveling-badge" style={{ background: 'linear-gradient(135deg, #6d28d9, #312e81)', color: 'white' }}>NEW/애니</div>
              <h3>🗡️ 나 혼자만 레벨업 (Solo Leveling)</h3>
              <p>전 세계를 휩쓴 K-웹툰/애니메이션의 전설! 성진우와 그림자 군단의 서사, 헌터 랭킹 및 세계관의 심층 지식을 검증합니다. 등급: E급 헌터 → C급 헌터 → A급 헌터 → S급 헌터 → 국가 권력급 → 그림자 군주</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge bleach-badge" style={{ background: 'linear-gradient(135deg, #f97316, #9a3412)', color: 'white' }}>NEW/만화/애니</div>
              <h3>⚔️ 블리치 (Bleach)</h3>
              <p>만해(卍解)..! 사신, 아란칼, 퀸시가 격돌하는 블리치 세계관! 참백도 이름과 호정 13대의 디테일한 설정을 꿰뚫는 자를 가려냅니다. 등급: 사패장 소년 → 평대원 → 석관 → 부대장 → 호정 13대 대장 → 0번대 (왕속부대)</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge lotr-badge" style={{ background: 'linear-gradient(135deg, #eab308, #854d0e)', color: 'white' }}>NEW/영화</div>
              <h3>💍 반지의 제왕 (LOTR)</h3>
              <p>호빗부터 요정, 절대반지와 사우론까지! 방대한 중간계 세계관과 종족, 반지원정대의 여정을 가장 완벽하게 꿰뚫는 자를 찾습니다. 등급: 호빗 마을 주민 → 로한/곤도르의 병사 → 정예 요정 전사 → 반지원정대 일원 → 백색의 이스타리 → 반지의 제왕</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge" style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: 'white' }}>NEW/영화</div>
              <h3>🦸 마블 시네마틱 유니버스 (MCU)</h3>
              <p>아이언맨부터 어벤져스, 인피니티 사가, 멀티버스까지. 히어로와 빌런, 인피니티 스톤, 명대사와 설정 디테일을 모두 아우르는 영화/드라마 통합 덕력 검증 테마입니다. 등급: 쉴드 신입 요원 → 정식 어벤져스 → 인피니티 사가 전문가 → 어셈블 마스터</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge" style={{ background: 'linear-gradient(135deg, #6b7280, #111827)', color: 'white' }}>NEW/애니</div>
              <h3>🪽 진격의 거인 (Attack on Titan)</h3>
              <p>시가시나, 지하실, 마레, 길, 땅울림까지 이어지는 복선 회수형 서사를 기반으로 한 고밀도 퀴즈 테마입니다. 등급: 훈련병단 신병 → 조사병단 정예 → 에르디아 비밀 해독자 → 벽 너머의 진실 도달자</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge" style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: 'white' }}>NEW/스포츠</div>
              <h3>🏀 슬램덩크 (Slam Dunk)</h3>
              <p>북산 5인방의 성장, 능남과 해남, 그리고 전국대회 산왕전까지. 농구 경기의 열기와 캐릭터 서사를 함께 기억하는 팬을 위한 테마입니다. 등급: 농구부 신입 → 주전급 플레이어 → 전국대회 핵심 전력 → 북산의 전설</p>
            </div>
            <div className="theme-overview-item">
              <div className="theme-overview-badge" style={{ background: 'linear-gradient(135deg, #22c55e, #166534)', color: 'white' }}>NEW/애니</div>
              <h3>🃏 헌터x헌터 (Hunter x Hunter)</h3>
              <p>헌터 시험, 요크신 시티, 그리드 아일랜드, 키메라 앤트, 넨 계통까지 단계적으로 파고드는 전략형 퀴즈 테마입니다. 등급: 헌터 시험 응시생 → 넨 수련자 → 헌터 협회 핵심 → 더블 스타급 헌터</p>
            </div>
          </div>
        </section>

        <section className="content-section card-base-styles mt-8">
          <h2>💡 100% 무료, 로그인 없는 즉시 플레이</h2>
          <p className="description-text">복잡한 회원가입이나 로그인 절차에 지치셨나요? 덕후테스트는 사용자의 최소한의 입력(결과창에 인쇄될 닉네임)만으로 모든 문항을 <strong>직관적이고 매끄럽게</strong> 풀 수 있습니다. 브라우저 로컬 저장소를 활용하여 개인정보 유출 걱정 없이 안전하게 즐길 수 있습니다.</p>

          <div className="service-details-grid">
            <div className="service-detail-item">
              <Globe size={20} color="var(--primary-color)" />
              <span>웹 브라우저 어디서나 접속 가능</span>
            </div>
            <div className="service-detail-item">
              <Shield size={20} color="#10b981" />
              <span>개인정보 서버 전송 없음 (로컬 저장)</span>
            </div>
            <div className="service-detail-item">
              <Zap size={20} color="#f59e0b" />
              <span>즉시 시작, 평균 소요 시간 10~15분</span>
            </div>
            <div className="service-detail-item">
              <Award size={20} color="#8b5cf6" />
              <span>테스트 완료 시 공식 인증서 즉시 발급</span>
            </div>
            <div className="service-detail-item">
              <BookOpen size={20} color="#0ea5e9" />
              <span>오답 노트로 학습 효과까지</span>
            </div>
            <div className="service-detail-item">
              <MessageSquare size={20} color="#ef4444" />
              <span>카카오톡·인스타·X 원클릭 공유</span>
            </div>
          </div>

          <div className="highlight-box">
            <p className="highlight-title">🌟 함께 만들어가는 플랫폼</p>
            <p className="highlight-desc">팬 투표를 기반으로 꾸준히 새로운 작품(애니, 드라마, 게임) 테마가 추가됩니다. 현재 나루토, 해리포터, 주술회전 테스트를 준비 중입니다. 여러분의 제안이 덕후테스트의 기출 문제가 됩니다.</p>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="content-section card-base-styles">
          <h2>❓ 자주 묻는 질문 (FAQ)</h2>
          <p style={{ marginBottom: '24px', color: 'var(--secondary-text-color)', lineHeight: 1.7 }}>
            덕후테스트 이용 전 궁금한 점들을 모아봤습니다. 아래 내용을 확인해도 해결이 되지 않으시면 문의하기를 이용해주세요.
          </p>
          <div className="faq-list">
            {faqItems.map((item, idx) => (
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

        <div className="action-row action-row-center">
          <Link href="/" className="startButton action-btn">
            <CheckCircle2 size={20} className="icon-left" /> 지금 바로 덕력 검증하기
          </Link>
          <Link href="/contact" className="ghostButton action-btn">
            <MessageSquare size={20} className="icon-left" /> 문의하기
          </Link>
        </div>
      </main>
    </div >
  );
}
