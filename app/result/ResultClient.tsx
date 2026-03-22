"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { Download, MessageCircle, Instagram, Twitter, Share2, ClipboardCheck, ExternalLink, BookOpen, Play, Hash, Anchor, Skull } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '../Toast';

const SITE_URL = "https://duckootest.pages.dev";
const DEFAULT_PLAYER_NAME = "익명 덕후";

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

  if (themeId === "pokemon") {
    if (score <= 20) return "새내기 트레이너";
    if (score <= 40) return "포켓몬 수집가";
    if (score <= 60) return "체육관 배지 수집가";
    if (score <= 75) return "로켓단 저지선";
    if (score <= 89) return "사천왕 도전자";
    if (score <= 99) return "챔피언";
    return "포켓몬 마스터";
  }

  if (themeId === "sololeveling") {
    if (score <= 24) return "E급 헌터";
    if (score <= 49) return "C급 헌터";
    if (score <= 69) return "A급 헌터";
    if (score <= 84) return "S급 헌터";
    if (score <= 94) return "국가 권력급";
    return "그림자 군주";
  }

  if (themeId === "diablo2") {
    if (score <= 24) return "노멀 모험가";
    if (score <= 49) return "나이트메어 생존자";
    if (score <= 69) return "헬 정복자";
    if (score <= 84) return "우버 헌터";
    if (score <= 94) return "네팔렘";
    return "성역의 수호자";
  }

  if (themeId === "mcu") {
    if (score <= 20) return "쉴드 신입 요원";
    if (score <= 40) return "어벤져스 지원 요원";
    if (score <= 60) return "뉴욕 전투 생존자";
    if (score <= 75) return "정식 어벤져스";
    if (score <= 89) return "인피니티 사가 전문가";
    if (score <= 99) return "멀티버스 감시자";
    return "어셈블 마스터";
  }

  if (themeId === "aot") {
    if (score <= 20) return "훈련병단 신병";
    if (score <= 40) return "주둔병단 실전병";
    if (score <= 60) return "조사병단 정예";
    if (score <= 75) return "월 마리아 탈환대";
    if (score <= 89) return "에르디아 비밀 해독자";
    if (score <= 99) return "자유의 날개 계승자";
    return "벽 너머의 진실 도달자";
  }

  if (themeId === "slamdunk") {
    if (score <= 20) return "농구부 신입";
    if (score <= 40) return "북산 벤치 멤버";
    if (score <= 60) return "주전급 플레이어";
    if (score <= 75) return "현 대회 에이스";
    if (score <= 89) return "전국대회 핵심 전력";
    if (score <= 99) return "산왕전 승부사";
    return "북산의 전설";
  }

  if (themeId === "hxh") {
    if (score <= 20) return "헌터 시험 응시생";
    if (score <= 40) return "초보 헌터";
    if (score <= 60) return "넨 수련자";
    if (score <= 75) return "프로 헌터";
    if (score <= 89) return "환영여단 추적자";
    if (score <= 99) return "헌터 협회 핵심";
    return "더블 스타급 헌터";
  }

  if (themeId === "bleach") {
    if (score <= 24) return "사패장 소년";
    if (score <= 49) return "평대원";
    if (score <= 69) return "석관";
    if (score <= 84) return "부대장";
    if (score <= 94) return "호정 13대 대장";
    return "0번대 (왕속부대)";
  }

  if (themeId === "lotr") {
    if (score <= 24) return "호빗 마을 주민";
    if (score <= 49) return "로한/곤도르의 병사";
    if (score <= 69) return "정예 요정 전사";
    if (score <= 84) return "반지원정대 일원";
    if (score <= 94) return "백색의 이스타리";
    return "반지의 제왕";
  }

  if (themeId === "orv") {
    if (score <= 24) return "하차한 독자";
    if (score <= 49) return "일반 화신";
    if (score <= 69) return "상위 랭커 화신";
    if (score <= 84) return "역사급 성좌";
    if (score <= 94) return "신화급 성좌";
    return "가장 오래된 꿈 (구원의 마왕)";
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
      { id: "pokemon", name: "포켓몬스터 덕후 테스트", emoji: "🎮", desc: "1~2세대 관동·성도 지방! 포켓몬 마스터를 가려냅니다.", color: "#16a34a" },
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
      { id: "pokemon", name: "포켓몬스터 덕후 테스트", emoji: "🎮", desc: "1~2세대 관동·성도 지방! 포켓몬 마스터를 가려냅니다.", color: "#16a34a" },
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
      { id: "pokemon", name: "포켓몬스터 덕후 테스트", emoji: "🎮", desc: "1~2세대 관동·성도 지방! 포켓몬 마스터를 가려냅니다.", color: "#16a34a" },
    ],
  },
  pokemon: {
    emoji: "🎮",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    hashtags: ["#포켓몬덕후테스트", "#덕후테스트", "#포켓몬스터", "#Pokemon", "#포켓몬마스터"],
    links: [
      { label: "포켓몬 나무위키", url: "https://namu.wiki/w/%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%8A%A4%ED%84%B0", desc: "포켓몬스터 세계관·시리즈 전반 나무위키" },
      { label: "포켓몬 공식 사이트", url: "https://pokemonkorea.co.kr", desc: "포켓몬 한국 공식 홈페이지" },
      { label: "Bulbapedia", url: "https://bulbapedia.bulbagarden.net", desc: "영어권 포켓몬 공식 위키 백과" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
      { id: "diablo2", name: "디아블로 2 덕후 테스트", emoji: "🔥", desc: "성역의 수호자를 검증합니다! D2 + 악마술사 DLC", color: "#9f1414" },
    ],
  },
  diablo2: {
    emoji: "🔥",
    color: "#9f1414",
    gradient: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    hashtags: ["#디아블로2덕후테스트", "#덕후테스트", "#디아블로2", "#Diablo2", "#D2R"],
    links: [
      { label: "디아블로 2 나무위키", url: "https://namu.wiki/w/%EB%94%94%EC%95%84%EB%B8%94%EB%A1%9C%202", desc: "디아블로 2 세계관·아이템·클래스 나무위키" },
      { label: "D2R 공식 사이트", url: "https://diablo2.blizzard.com", desc: "디아블로 2 레저렉션 공식 홈페이지" },
      { label: "Maxroll D2R", url: "https://maxroll.gg/d2", desc: "D2R 빌드·가이드·룬워드 데이터베이스" },
    ],
    otherThemes: [
      { id: "lol", name: "리그 오브 레전드 테스트", emoji: "⚔️", desc: "소환사의 협곡에서 펼쳐지는 지식 배틀!", color: "#c8aa6e" },
      { id: "pokemon", name: "포켓몬스터 덕후 테스트", emoji: "🎮", desc: "1~2세대 관동·성도 지방! 포켓몬 마스터를 가려냅니다.", color: "#16a34a" },
    ],
  },
  sololeveling: {
    emoji: "🗡️",
    color: "#4c1d95",
    gradient: "linear-gradient(135deg, #6d28d9, #312e81)",
    hashtags: ["#나혼렙덕후테스트", "#덕후테스트", "#나혼자만레벨업", "#SoloLeveling", "#성진우"],
    links: [
      { label: "나혼렙 나무위키", url: "https://namu.wiki/w/%EB%82%98%20%ED%98%BC%EC%9E%90%EB%A7%8C%20%EB%A0%88%EB%B2%A8%EC%97%85", desc: "나 혼자만 레벨업 웹소설/웹툰 나무위키" },
      { label: "나혼렙 애니 카카오페이지", url: "https://page.kakao.com/", desc: "나 혼자만 레벨업 카카오페이지 공식" },
      { label: "넷마블 나혼렙: 어라이즈", url: "https://sololeveling.netmarble.com", desc: "나 혼자만 레벨업: 어라이즈 게임 공식 사이트" },
    ],
    otherThemes: [
      { id: "diablo2", name: "디아블로 2 덕후 테스트", emoji: "🔥", desc: "성역의 수호자를 검증합니다! D2 + 악마술사 DLC", color: "#9f1414" },
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
    ],
  },
  bleach: {
    emoji: "⚔️",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #f97316, #9a3412)",
    hashtags: ["#블리치덕후테스트", "#덕후테스트", "#블리치", "#Bleach", "#만해"],
    links: [
      { label: "블리치 나무위키", url: "https://namu.wiki/w/%EB%B8%94%EB%A6%AC%EC%B9%98", desc: "블리치 세계관·등장인물 나무위키" },
      { label: "블리치 애니 공식 X", url: "https://twitter.com/BLEACHanimation", desc: "블리치 천년혈전 편 공식 트위터" },
      { label: "블리치 팬덤 위키", url: "https://bleach.fandom.com/wiki/Bleach_Wiki", desc: "블리치 공식 설정 영문 팬덤 위키" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
      { id: "sololeveling", name: "나 혼자만 레벨업 덕후 테스트", emoji: "🗡️", desc: "성진우와 그림자 군단의 이야기!", color: "#4c1d95" },
    ],
  },
  orv: {
    emoji: "📖",
    color: "#1e3a8a",
    gradient: "linear-gradient(135deg, #1e40af, #1e3a8a)",
    hashtags: ["#전독시테스트", "#덕후테스트", "#전지적독자시점", "#ORV", "#김독자컴퍼니"],
    links: [
      { label: "전독시 나무위키", url: "https://namu.wiki/w/%EC%A0%84%EC%A7%80%EC%A0%81%20%EB%8F%85%EC%9E%90%20%EC%8B%9C%EC%A0%90", desc: "전지적 독자 시점 세계관 상세" },
      { label: "네이버 웹툰 전독시", url: "https://comic.naver.com/webtoon/list?titleId=747269", desc: "웹툰 전지적 독자 시점 공식 홈페이지" },
    ],
    otherThemes: [
      { id: "sololeveling", name: "나 혼자만 레벨업 덕후 테스트", emoji: "🗡️", desc: "성진우와 그림자 군단의 이야기!", color: "#4c1d95" },
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
    ],
  },
  lotr: {
    emoji: "💍",
    color: "#ca8a04",
    gradient: "linear-gradient(135deg, #eab308, #854d0e)",
    hashtags: ["#반지의제왕덕후테스트", "#덕후테스트", "#반지의제왕", "#LOTR", "#절대반지"],
    links: [
      { label: "반지의 제왕 나무위키", url: "https://namu.wiki/w/%EB%B0%98%EC%A7%80%EC%9D%98%20%EC%A0%9C%EC%99%95", desc: "세계관 및 등장인물 상세" },
      { label: "톨킨 게이트웨이", url: "https://tolkiengateway.net", desc: "해외 최대 톨킨 영문 팬덤 위키" },
    ],
    otherThemes: [
      { id: "mcu", name: "마블 시네마틱 유니버스 테스트", emoji: "🦸", desc: "MCU 영화와 드라마 지식을 확인하세요.", color: "#d32f2f" },
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "해적왕의 꿈! 원피스 세계관 지식을 검증합니다.", color: "#4f46e5" },
    ],
  },
  mcu: {
    emoji: "🦸",
    color: "#d32f2f",
    gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    hashtags: ["#MCU덕후테스트", "#덕후테스트", "#마블", "#어벤져스", "#MarvelStudios"],
    links: [
      { label: "마블 스튜디오 공식", url: "https://www.marvel.com/movies", desc: "MCU 영화 및 드라마 공식 소개 페이지" },
      { label: "마블 코리아", url: "https://www.marvelkorea.com", desc: "마블 코리아 공식 사이트" },
      { label: "마블 위키", url: "https://marvelcinematicuniverse.fandom.com", desc: "MCU 설정과 작품 정보를 정리한 팬 위키" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "방대한 세계관과 설정 디테일을 함께 검증해보세요.", color: "#4f46e5" },
      { id: "sololeveling", name: "나 혼자만 레벨업 덕후 테스트", emoji: "🗡️", desc: "서사와 전투, 각성 설정까지 깊게 파고듭니다.", color: "#4c1d95" },
    ],
  },
  aot: {
    emoji: "🪽",
    color: "#6b7280",
    gradient: "linear-gradient(135deg, #6b7280, #111827)",
    hashtags: ["#진격의거인덕후테스트", "#덕후테스트", "#진격의거인", "#AttackOnTitan", "#조사병단"],
    links: [
      { label: "진격의 거인 나무위키", url: "https://namu.wiki/w/%EC%A7%84%EA%B2%A9%EC%9D%98%20%EA%B1%B0%EC%9D%B8", desc: "작품 세계관과 등장인물 정리" },
      { label: "애니 공식 사이트", url: "https://shingeki.net", desc: "진격의 거인 애니메이션 공식 사이트" },
      { label: "공식 X", url: "https://x.com/anime_shingeki", desc: "진격의 거인 애니 공식 계정" },
    ],
    otherThemes: [
      { id: "onepiece", name: "원피스 덕후 테스트", emoji: "⛵", desc: "장기 서사와 복선을 좋아하면 이쪽도 잘 맞습니다.", color: "#4f46e5" },
      { id: "mcu", name: "MCU 덕후 테스트", emoji: "🦸", desc: "인물과 세계관을 넓게 연결해 기억하는 재미가 비슷합니다.", color: "#d32f2f" },
    ],
  },
  slamdunk: {
    emoji: "🏀",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #ef4444, #991b1b)",
    hashtags: ["#슬램덩크덕후테스트", "#덕후테스트", "#슬램덩크", "#SlamDunk", "#북산"],
    links: [
      { label: "슬램덩크 나무위키", url: "https://namu.wiki/w/SLAM%20DUNK", desc: "작품과 경기, 등장인물 정리" },
      { label: "더 퍼스트 슬램덩크 공식", url: "https://slamdunk-movie.jp", desc: "극장판 공식 사이트" },
      { label: "토에이 애니메이션", url: "https://www.toei-anim.co.jp", desc: "관련 애니메이션 제작사 사이트" },
    ],
    otherThemes: [
      { id: "aot", name: "진격의 거인 덕후 테스트", emoji: "🪽", desc: "몰입감 있는 장기 서사와 명장면 기억력을 같이 시험해보세요.", color: "#6b7280" },
      { id: "pokemon", name: "포켓몬스터 덕후 테스트", emoji: "🎮", desc: "세대 추억형 테마를 좋아한다면 이쪽도 잘 맞습니다.", color: "#16a34a" },
    ],
  },
  hxh: {
    emoji: "🃏",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #22c55e, #166534)",
    hashtags: ["#헌터헌터덕후테스트", "#덕후테스트", "#헌터x헌터", "#HunterxHunter", "#넨"],
    links: [
      { label: "헌터x헌터 나무위키", url: "https://namu.wiki/w/%ED%97%8C%ED%84%B0%C3%97%ED%97%8C%ED%84%B0?from=%ED%97%8C%ED%84%B0%ED%97%8C%ED%84%B0", desc: "작품 세계관과 인물, 능력 정리" },
      { label: "점프 공식", url: "https://www.shonenjump.com", desc: "소년 점프 공식 사이트" },
      { label: "애니메이션 공식", url: "https://www.ntv.co.jp/hunterhunter/", desc: "애니메이션 공식 사이트" },
    ],
    otherThemes: [
      { id: "aot", name: "진격의 거인 덕후 테스트", emoji: "🪽", desc: "복선과 세계관 밀도가 높은 작품을 좋아하면 잘 맞습니다.", color: "#6b7280" },
      { id: "slamdunk", name: "슬램덩크 덕후 테스트", emoji: "🏀", desc: "장기 성장 서사와 명장면 기억력을 이어서 즐길 수 있습니다.", color: "#dc2626" },
    ],
  },
};

export default function ResultClient() {
  const [result, setResult] = useState<SavedResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const searchParams = useSearchParams();
  const themeId = searchParams.get("theme") ?? "onepiece";
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certScale, setCertScale] = useState(1);
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
        const normalizedPlayer = parsed.player?.trim() || DEFAULT_PLAYER_NAME;
        setResult({
          ...parsed,
          player: normalizedPlayer,
        });
        setNameDraft(normalizedPlayer);
      }
    } catch {
      setResult(null);
    }

    setLoaded(true);
  }, [themeId]);

  useEffect(() => {
    if (!loaded) return;
    const node = certificateRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0 && width < 450) {
          setCertScale(width / 450);
        } else {
          setCertScale(1);
        }
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [loaded]);

  const wrongAnswers = useMemo(() => {
    if (!result) return [];
    return result.review.filter((item) => item.selectedIndex !== item.answerIndex);
  }, [result]);

  const shareUrl = `${SITE_URL}/result?theme=${themeId}`;
  const shareText = result ? `[${result.themeName}] ${result.player} 님은 ${result.score}점 (${getRank(result.score, result.themeId)}) 달성!` : "";
  const shareTitle = "덕후테스트 결과";
  const shareDescription = result ? `${result.totalCount}문제 중 ${result.correct}개 정답! 나도 도전하기 →` : "";

  const updatePlayerName = (nextDraft: string) => {
    setNameDraft(nextDraft);
    setResult((prev) => {
      if (!prev) return prev;

      const normalizedPlayer = nextDraft.trim() || DEFAULT_PLAYER_NAME;
      const nextResult = {
        ...prev,
        player: normalizedPlayer,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResult));
      localStorage.setItem("duckoo-player-name", normalizedPlayer);

      return nextResult;
    });
  };

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

    let imageUrl = `${SITE_URL}/og.png?v=2`;

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

  let certBorderColor = "#4f46e5";
  let certBg = "radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)";
  let watermarkBg = "#4f46e5";
  let watermarkOpacity = 0.08;
  let accentColor = "#4f46e5";
  let textColor = "#0f172a";
  let subTextColor = "#64748b";
  let nameBoxBg = "#eef2ff";
  let nameBoxBorder = "#c7d2fe";
  let hasImageBg = false;

  let textShadow = "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1)";
  let smallTextShadow = "0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8)";

  if (result.themeId === "onepiece") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#78350f";
    textColor = "#45220a";
    subTextColor = "#78350f";
    nameBoxBg = "rgba(254, 243, 199, 0.7)";
    nameBoxBorder = "rgba(252, 211, 77, 0.8)";
    textShadow = "0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(251, 191, 36, 0.6)";
    smallTextShadow = "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(251, 191, 36, 0.5)";
  } else if (result.themeId === "lol") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#0284c7";
    textColor = "#0f172a";
    subTextColor = "#0369a1";
    nameBoxBg = "rgba(224, 242, 254, 0.7)";
    nameBoxBorder = "rgba(125, 211, 252, 0.8)";
    textShadow = "0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(14, 165, 233, 0.6)";
    smallTextShadow = "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(14, 165, 233, 0.5)";
  } else if (result.themeId === "fma") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#7f1d1d";
    textColor = "#450a0a";
    subTextColor = "#b91c1c";
    nameBoxBg = "rgba(254, 226, 226, 0.7)";
    nameBoxBorder = "rgba(248, 113, 113, 0.8)";
    textShadow = "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1)";
    smallTextShadow = "0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8)";
  } else if (result.themeId === "pokemon") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#15803d";
    textColor = "#1e293b";
    subTextColor = "#16a34a";
    nameBoxBg = "rgba(220, 252, 231, 0.7)";
    nameBoxBorder = "rgba(134, 239, 172, 0.8)";
    textShadow = "0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(34, 197, 94, 0.6)";
    smallTextShadow = "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(34, 197, 94, 0.5)";
  } else if (result.themeId === "diablo2") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#dc2626";
    textColor = "#ffffff";
    subTextColor = "#fca5a5";
    nameBoxBg = "rgba(0, 0, 0, 0.7)";
    nameBoxBorder = "rgba(185, 28, 28, 0.8)";
    textShadow = "2px 2px 4px rgba(0,0,0,1), 0 0 12px rgba(220, 38, 38, 0.8), 0 0 24px rgba(153, 27, 27, 0.6)";
    smallTextShadow = "1px 1px 2px rgba(0,0,0,1), 0 0 8px rgba(220, 38, 38, 0.7), 0 0 16px rgba(153, 27, 27, 0.5)";
  } else if (result.themeId === "sololeveling") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#a855f7";
    textColor = "#ffffff";
    subTextColor = "#c084fc";
    nameBoxBg = "rgba(46, 16, 101, 0.7)";
    nameBoxBorder = "rgba(168, 85, 247, 0.8)";
    textShadow = "0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(168, 85, 247, 0.8)";
    smallTextShadow = "0 0 5px rgba(59, 130, 246, 0.6), 0 0 10px rgba(168, 85, 247, 0.6)";
  } else if (result.themeId === "mcu") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#ef4444";
    textColor = "#ffffff";
    subTextColor = "#60a5fa";
    nameBoxBg = "rgba(15, 23, 42, 0.7)";
    nameBoxBorder = "rgba(59, 130, 246, 0.8)";
    textShadow = "0 0 12px rgba(96, 165, 250, 0.9), 0 0 24px rgba(239, 68, 68, 0.6)";
    smallTextShadow = "0 0 8px rgba(96, 165, 250, 0.8), 0 0 16px rgba(239, 68, 68, 0.5)";
  } else if (result.themeId === "aot") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#ef4444";
    textColor = "#ffffff";
    subTextColor = "#ef4444";
    nameBoxBg = "rgba(41, 37, 36, 0.7)";
    nameBoxBorder = "rgba(120, 113, 108, 0.8)";
    textShadow = "0 0 12px rgba(0,0,0,1), 0 0 24px rgba(220, 38, 38, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(220, 38, 38, 0.6)";
  } else if (result.themeId === "slamdunk") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#dc2626";
    textColor = "#ffffff";
    subTextColor = "#ef4444";
    nameBoxBg = "rgba(0, 0, 0, 0.7)";
    nameBoxBorder = "rgba(220, 38, 38, 0.8)";
    textShadow = "0 0 12px rgba(0,0,0,1), 0 0 24px rgba(220, 38, 38, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(220, 38, 38, 0.6)";
  } else if (result.themeId === "hxh") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#16a34a";
    textColor = "#ffffff";
    subTextColor = "#10b981";
    nameBoxBg = "rgba(6, 78, 59, 0.7)";
    nameBoxBorder = "rgba(16, 185, 129, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(16, 185, 129, 0.6)";
  } else if (result.themeId === "lotr") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#ca8a04";
    textColor = "#ffffff";
    subTextColor = "#eab308";
    nameBoxBg = "rgba(41, 37, 36, 0.7)";
    nameBoxBorder = "rgba(202, 138, 4, 0.8)";
    textShadow = "0 0 12px rgba(0,0,0,1), 0 0 24px rgba(202, 138, 4, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(202, 138, 4, 0.6)";
  } else if (result.themeId === "bleach") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#06b6d4";
    textColor = "#ffffff";
    subTextColor = "#22d3ee";
    nameBoxBg = "rgba(15, 23, 42, 0.7)";
    nameBoxBorder = "rgba(6, 182, 212, 0.8)";
    textShadow = "0 0 12px rgba(0,0,0,1), 0 0 24px rgba(6, 182, 212, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(6, 182, 212, 0.6)";
  } else if (result.themeId === "orv") {
    hasImageBg = true;
    certBorderColor = "transparent";
    certBg = "none";
    watermarkBg = "transparent";
    watermarkOpacity = 0;
    accentColor = "#93c5fd";
    textColor = "#ffffff";
    subTextColor = "#bfdbfe";
    nameBoxBg = "rgba(15, 23, 42, 0.7)";
    nameBoxBorder = "rgba(147, 197, 253, 0.8)";
    textShadow = "0 0 12px rgba(0,0,0,1), 0 0 24px rgba(147, 197, 253, 0.8)";
    smallTextShadow = "0 0 8px rgba(0,0,0,1), 0 0 16px rgba(147, 197, 253, 0.6)";
  }
  
  let certBgImageUrl = "";
  if (result.themeId === "onepiece") certBgImageUrl = "/images/onepiece_cert_bg_v2.png?v=4";
  else if (result.themeId === "lol") certBgImageUrl = "/images/lol_cert_bg.png?v=4";
  else if (result.themeId === "fma") certBgImageUrl = "/images/fma_cert_bg.png?v=3";
  else if (result.themeId === "pokemon") certBgImageUrl = "/images/pokemon_cert_bg.png?v=2";
  else if (result.themeId === "diablo2") certBgImageUrl = "/images/diablo2_cert_bg.png?v=1";
  else if (result.themeId === "sololeveling") certBgImageUrl = "/images/sololeveling_cert_bg.png?v=1";
  else if (result.themeId === "mcu") certBgImageUrl = "/images/mcu_cert_bg.png?v=2";
  else if (result.themeId === "aot") certBgImageUrl = "/images/aot_cert_bg.png?v=1";
  else if (result.themeId === "slamdunk") certBgImageUrl = "/images/slamdunk_cert_bg.png?v=1";
  else if (result.themeId === "hxh") certBgImageUrl = "/images/hxh_cert_bg.png?v=1";
  else if (result.themeId === "lotr") certBgImageUrl = "/images/lotr_cert_bg.png?v=1";
  else if (result.themeId === "bleach") certBgImageUrl = "/images/bleach_cert_bg.png?v=1";
  else if (result.themeId === "orv") certBgImageUrl = "/images/orv_cert_bg.png?v=1";

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
              style={{
                background: hasImageBg ? 'none' : 'white',
                boxShadow: hasImageBg ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
                  padding: `${24 * certScale}px`,
                  background: certBg,
                  border: hasImageBg ? 'none' : `${4 * certScale}px double ${certBorderColor}`,
                  borderRadius: hasImageBg ? `${16 * certScale}px` : `${8 * certScale}px`,
                  outline: 'none',
                  boxShadow: hasImageBg ? `0 ${10 * certScale}px ${30 * certScale}px rgba(0,0,0,0.5)` : 'none',
                  overflow: 'hidden'
                }}
              >
                {hasImageBg && (
                  <img 
                    src={certBgImageUrl} 
                    alt="Certificate Background" 
                    crossOrigin="anonymous"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: -2,
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                )}

                {!hasImageBg && (
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
                      opacity: watermarkOpacity,
                      zIndex: -1,
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{
                      backgroundColor: watermarkBg,
                      borderRadius: '50%',
                      width: `${350 * certScale}px`,
                      height: `${350 * certScale}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ClipboardCheck size={180 * certScale} color="white" strokeWidth={1.5} />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: `${24 * certScale}px`, textAlign: 'center', marginTop: `${16 * certScale}px` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: `${8 * certScale}px` }}>
                    <p style={{ 
                      fontSize: `${13 * certScale}px`, 
                      fontWeight: 800, 
                      color: accentColor, 
                      letterSpacing: '0.2em', 
                      margin: 0,
                      textShadow: smallTextShadow
                    }}>OFFICIAL CERTIFICATE</p>
                  </div>
                  <h2 style={{ 
                    fontSize: `${32 * certScale}px`, 
                    fontWeight: 900, 
                    color: textColor, 
                    letterSpacing: '0.15em', 
                    margin: 0, 
                    textShadow: textShadow 
                  }}>덕후 인증서</h2>
                  <p style={{ 
                    fontSize: `${16 * certScale}px`, 
                    fontWeight: 700, 
                    color: subTextColor, 
                    marginTop: `${10 * certScale}px`, 
                    marginBottom: 0,
                    textShadow: smallTextShadow
                  }}>
                    {meta.emoji} {result.themeName}
                  </p>
                </div>

                <div style={{
                  backgroundColor: nameBoxBg,
                  padding: `${12 * certScale}px ${32 * certScale}px`,
                  borderRadius: `${16 * certScale}px`,
                  display: 'inline-block',
                  marginBottom: `${24 * certScale}px`,
                  border: `${2 * certScale}px solid ${nameBoxBorder}`,
                  boxShadow: `0 ${4 * certScale}px ${12 * certScale}px ${hasImageBg ? 'rgba(183, 121, 47, 0.1)' : 'rgba(79, 70, 229, 0.1)'}`,
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: `${28 * certScale}px`, fontWeight: 900, color: accentColor, margin: 0, letterSpacing: '0.05em' }}>{result.player}</p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: `${16 * certScale}px` }}>
                  <p className="certScore" style={{ 
                    fontSize: `${64 * certScale}px`, 
                    margin: 0, 
                    color: textColor,
                    textShadow: textShadow
                  }}>
                    {result.score}
                    <span style={{ 
                      fontSize: `${24 * certScale}px`, 
                      color: subTextColor,
                      textShadow: smallTextShadow
                    }}>점</span>
                  </p>
                  
                  <div style={{ marginTop: `${8 * certScale}px` }}>
                    <p className="certRank" style={{ 
                      fontSize: `${24 * certScale}px`, 
                      margin: 0, 
                      color: accentColor,
                      display: 'block',
                      backgroundColor: 'transparent',
                      padding: '0',
                      borderRadius: '0',
                      boxShadow: 'none',
                      fontWeight: 900,
                      textShadow: textShadow
                    }}>
                      {rank}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            <button type="button" className="downloadButton" onClick={handleDownloadImage}>
              <Download size={20} className="icon-left" />
              인증서 저장하기
            </button>
          </div>

          <section className="name-edit-section glass">
            <div className="name-edit-copy">
              <h2 className="name-edit-title">수료증 닉네임 수정</h2>
              <p className="name-edit-desc">여기서 수정하면 인증서, 공유 문구, 이미지 저장 파일명에 바로 반영됩니다.</p>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <input
                id="result-player-name"
                className="nicknameInput"
                placeholder={DEFAULT_PLAYER_NAME}
                value={nameDraft}
                onChange={(event) => updatePlayerName(event.target.value)}
              />
            </div>
          </section>

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

          {/* 하단 재도전 / 다른 테스트 */}
          <div className="action-row" style={{ marginTop: '40px' }}>
            <Link href={`/test/${themeId}`} className="ghostButton action-btn">
              다시 도전
            </Link>
            <Link href="/" className="startButton action-btn">
              다른 테스트 하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
