import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Info, RotateCcw, AlertTriangle } from "lucide-react";

const C = {
  bg: "#F6F3ED",
  ink: "#2A3328",
  ink60: "#5C6459",
  sage: "#5F8767",
  sageDeep: "#3F6349",
  sagePale: "#DCE6D6",
  card: "#FBFAF7",
  apricot: "#E1815C",
  apricotDeep: "#C4663F",
  blue: "#6E8CA0",
  warn: "#C4663F",
};

const SYMPTOM_OPTIONS = [
  { id: "nausea", label: "메스꺼움" },
  { id: "vomiting", label: "구토" },
  { id: "constipation", label: "변비" },
  { id: "heartburn", label: "속쓰림/역류" },
  { id: "lowAppetite", label: "식욕 저하" },
  { id: "none", label: "특별한 증상 없음" },
];

const MEDS = [
  { id: "wegovy", label: "위고비" },
  { id: "mounjaro", label: "마운자로" },
  { id: "saxenda", label: "삭센다" },
  { id: "other", label: "기타" },
];

const DISEASE_OPTIONS = [
  { id: "diabetes", label: "당뇨병" },
  { id: "pregnancy", label: "임신" },
  { id: "kidney", label: "신장질환" },
  { id: "liver", label: "간질환" },
];

const ACTIVITY_FACTOR = {
  "거의 운동 안 함": 1.2,
  "가벼운 활동": 1.375,
  "중간 활동": 1.55,
  "높은 활동": 1.725,
};

// 식품 선호도 질문 옵션 (기존 폼과 완전히 동일한 문자열을 사용 — state 값과 그대로 매칭됨)
const MEAL_STYLE_OPTIONS = [
  "가볍게 즐기고 싶어요 (과일, 두유 등)",
  "간단하게 한 끼 챙기고 싶어요 (그릭 요거트, 샐러드, 닭가슴살, 연두부 등)",
  "꽉 찬 한 끼의 식사가 좋아요",
];
const MEAL_FORM_OPTIONS = [
  "마시는 것이 좋아요",
  "쉽게 떠먹는 것이 좋아요",
  "핑거푸드가 좋아요",
  "혼합형 한그릇 (덮밥, 비빔밥, 포케)",
  "일반식이 좋아요",
];
const NUTRITION_PRIORITY_OPTIONS = [
  "채소, 식이섬유가 포함됐으면 좋겠어요",
  "탄수화물을 보충하고 싶어요",
  "단백질에 집중할래요",
  "특별한 기준은 없어요",
];
const TEXTURE_OPTIONS = ["부드러운 느낌이 좋아요", "쫄깃한 느낌이 좋아요", "아삭한 느낌이 좋아요", "단단한 느낌이 좋아요", "바삭한 느낌이 좋아요"];
const TEMP_OPTIONS = ["따뜻하게 먹을래요", "차갑게 먹을래요", "실온 정도로 먹을래요"];
const SMELL_OPTIONS = [
  "수산물의 비린내는 피하고 싶어요",
  "고기의 누린내는 피하고 싶어요",
  "발효·숙성 향(쿰쿰함)은 피하고 싶어요",
  "마늘·양파 등 향신료 향은 피하고 싶어요",
  "콩 비린내는 피하고 싶어요",
  "오이·수박 향은 피하고 싶어요",
];
const TASTE_OPTIONS = ["단맛이 과하게 느껴져요", "짠맛이 과하게 느껴져요", "기름진 맛이 과하게 느껴져요"];
const SEASONING_OPTIONS = ["재료 본연의 맛을 즐길래요", "담백하고 삼삼하게 먹고싶어요", "양념이 필요해요"];
const COOKING_TIME_OPTIONS = ["바로 먹을래요", "데우기만 하고 먹을래요", "15분 이내로 조리해서 먹을래요", "충분히 조리할 수 있어요"];

// UI 문구 -> 내부 태그로 변환하는 매핑 테이블 (메뉴 DB의 태그와 매칭시키기 위함)
const TEXTURE_TAGS = {
  "부드러운 느낌이 좋아요": "부드러운",
  "쫄깃한 느낌이 좋아요": "쫄깃한",
  "아삭한 느낌이 좋아요": "아삭한",
  "단단한 느낌이 좋아요": "단단한",
  "바삭한 느낌이 좋아요": "바삭한",
};
const TEMP_TAGS = {
  "따뜻하게 먹을래요": "따뜻하게",
  "차갑게 먹을래요": "차갑게",
  "실온 정도로 먹을래요": "실온",
};
const SMELL_TAGS = {
  "수산물의 비린내는 피하고 싶어요": "비린내",
  "고기의 누린내는 피하고 싶어요": "누린내",
  "발효·숙성 향(쿰쿰함)은 피하고 싶어요": "발효",
  "마늘·양파 등 향신료 향은 피하고 싶어요": "향신료",
  "콩 비린내는 피하고 싶어요": "콩비린내",
  "오이·수박 향은 피하고 싶어요": "오이수박향",
};
const TASTE_TAGS = {
  "단맛이 과하게 느껴져요": "단맛",
  "짠맛이 과하게 느껴져요": "짠맛",
  "기름진 맛이 과하게 느껴져요": "기름진맛",
};
const SEASONING_TAGS = {
  "재료 본연의 맛을 즐길래요": "재료본연",
  "담백하고 삼삼하게 먹고싶어요": "담백",
  "양념이 필요해요": "양념",
};
const SEASONING_LEVEL = { 재료본연: 0, 담백: 1, 양념: 2 };
const COOK_LEVEL = { 바로: 0, 데우기: 1, "15분": 2, 충분: 3 };
const COOKING_TIME_TAGS = {
  "바로 먹을래요": "바로",
  "데우기만 하고 먹을래요": "데우기",
  "15분 이내로 조리해서 먹을래요": "15분",
  "충분히 조리할 수 있어요": "충분",
};
const MEAL_STYLE_COUNT = {
  "가볍게 즐기고 싶어요 (과일, 두유 등)": 1,
  "간단하게 한 끼 챙기고 싶어요 (그릭 요거트, 샐러드, 닭가슴살, 연두부 등)": 2,
  "꽉 찬 한 끼의 식사가 좋아요": 3,
};

// ── 1. 투약 진행도(phase) ──────────────────────────────────────
// 최근 증량 직후는 부작용이 심해지는 시기이므로 titrating으로 강제 편입
function getPhase(weeks, recentIncrease) {
  if (weeks < 4) return "initial";
  if (weeks < 12 || recentIncrease === "예") return "titrating";
  return "stable";
}

const phaseLabel = { initial: "초기 적응기", titrating: "용량 조절기", stable: "안정기" };

// ── 2. 오늘 증상의 심각도 + 구체적 주의 태그 ───────────────────
function getSymptomProfile(symptoms) {
  if (symptoms.length === 0 || symptoms.includes("none")) {
    return { severity: "none", tags: [] };
  }
  const severe = symptoms.includes("nausea") || symptoms.includes("vomiting");
  const tags = [];
  if (symptoms.includes("nausea") || symptoms.includes("vomiting")) tags.push("저지방·저섬유 유동식");
  if (symptoms.includes("constipation")) tags.push("고섬유·고수분");
  if (symptoms.includes("heartburn")) tags.push("저자극·역류주의");
  if (symptoms.includes("lowAppetite")) tags.push("소량·고밀도영양");
  return { severity: severe ? "severe" : "mild", tags };
}

// ── 3. 식사 텍스처 등급 (4단계, "권고사항" 흐름에서만 사용) ─────
const MEAL_TIER_META = {
  liquid_soft: {
    label: "저자극 유동식",
    desc: "위가 많이 예민한 시기예요. 죽, 스프처럼 삼키기 편한 음식 위주로 구성했어요.",
  },
  soft_lowfat: {
    label: "소량 저지방 연식",
    desc: "적응이 진행 중이에요. 기름기를 줄이고 소화 부담이 적은 재료로 채웠어요.",
  },
  regular_highprotein: {
    label: "고단백 소분식",
    desc: "용량이 늘었거나 식욕이 준 시기예요. 적은 양에서도 단백질 밀도를 높였어요.",
  },
  regular_balanced: {
    label: "균형 잡힌 일반식",
    desc: "몸이 안정된 시기예요. 단백질과 식이섬유 균형을 챙긴 일반식이에요.",
  },
};

function getMealTier(phase, symptomProfile) {
  if (symptomProfile.severity === "severe") return "liquid_soft";
  if (phase === "initial") return symptomProfile.severity === "none" ? "soft_lowfat" : "liquid_soft";
  if (phase === "titrating" || symptomProfile.severity === "mild") return "regular_highprotein";
  return "regular_balanced";
}

// ── 4. 칼로리 목표 (Mifflin-St Jeor + 활동계수 + 감량속도, 안전 하한 적용) ──
function getCalorieTarget({ height, weight, age, gender, activity, targetWeight, targetMonths }) {
  const h = Number(height), w = Number(weight), a = Number(age);
  const bmr = gender === "남성" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  const tdee = bmr * (ACTIVITY_FACTOR[activity] || 1.375);

  const kgToLose = Math.max(0, w - Number(targetWeight));
  const days = Math.max(1, Number(targetMonths) * 30);
  const dailyDeficit = Math.min(750, (kgToLose * 7700) / days); // 하루 최대 750kcal 결손으로 안전 상한

  const floor = gender === "남성" ? 1500 : 1200; // 성별 최소 안전 칼로리
  return Math.round(Math.max(floor, tdee - dailyDeficit));
}

// ── 5. 단백질 목표 (연구 기준 1.2~1.6g/kg, 감량 속도 빠른 시기엔 상위값) ──
function getProteinTarget(weight, phase) {
  const coef = phase === "stable" ? 1.2 : 1.6;
  return Math.round(Number(weight) * coef);
}

// ── "일반식" 메뉴 DB: 4개 텍스처 티어별 실제 메뉴 (알레르기/채식/식감/온도/향/맛/간/조리시간 태그 포함) ──
const MEAL_DB = {
  liquid_soft: {
    side1: [
      { name: "두부 계란찜", protein: 9, allergens: ["계란", "대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
      { name: "닭가슴살 스크램블", protein: 14, allergens: ["계란"], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
    ],
    side2: [
      { name: "부드러운 흰살생선찜", protein: 16, allergens: ["생선"], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["비린내"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
      { name: "으깬 두부조림", protein: 10, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
    ],
    rice: [
      { name: "야채죽", protein: 4, allergens: [], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: true, carb: true },
      { name: "닭죽", protein: 12, allergens: [], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: true },
    ],
    soup: [{ name: "맑은 콩나물국", protein: 3, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["콩비린내"], seasoning: "담백", cookTime: "15분", fiber: true, carb: false }],
  },
  soft_lowfat: {
    side1: [
      { name: "닭가슴살 완자", protein: 18, allergens: [], vegetarian: false, texture: ["부드러운", "쫄깃한"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
      { name: "두부구이", protein: 12, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
    ],
    side2: [
      { name: "계란찜", protein: 12, allergens: ["계란"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
      { name: "삶은 새우", protein: 15, allergens: ["갑각류"], vegetarian: false, texture: ["쫄깃한"], temp: ["실온", "따뜻하게"], seasoning: "재료본연", cookTime: "15분", fiber: false, carb: false },
    ],
    rice: [{ name: "잡곡밥 (소량)", protein: 5, allergens: [], vegetarian: true, texture: ["쫄깃한"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: true, carb: true }],
    soup: [{ name: "저염 미소국", protein: 6, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["발효"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false }],
  },
  regular_highprotein: {
    side1: [
      { name: "닭가슴살 스테이크", protein: 26, allergens: [], vegetarian: false, texture: ["쫄깃한", "단단한"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
      { name: "연두부 스테이크", protein: 14, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
    ],
    side2: [
      { name: "고등어구이", protein: 20, allergens: ["생선"], vegetarian: false, texture: ["부드러운", "쫄깃한"], temp: ["따뜻하게"], smell: ["비린내"], seasoning: "양념", cookTime: "15분", fiber: false, carb: false },
      { name: "렌틸콩 샐러드", protein: 16, allergens: [], vegetarian: true, texture: ["아삭한"], temp: ["차갑게", "실온"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: true },
    ],
    side3: [{ name: "그릭요거트", protein: 10, allergens: ["우유"], vegetarian: true, texture: ["부드러운"], temp: ["차갑게"], taste: ["단맛"], seasoning: "재료본연", cookTime: "바로", fiber: false, carb: false }],
    rice: [{ name: "현미밥 (소량)", protein: 5, allergens: [], vegetarian: true, texture: ["쫄깃한"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: true, carb: true }],
    soup: [{ name: "된장찌개", protein: 8, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["발효"], seasoning: "양념", cookTime: "15분", fiber: true, carb: false }],
  },
  regular_balanced: {
    side1: [
      { name: "제육볶음", protein: 22, allergens: ["돼지고기"], vegetarian: false, texture: ["쫄깃한"], temp: ["따뜻하게"], smell: ["누린내"], taste: ["기름진맛"], seasoning: "양념", cookTime: "충분", fiber: false, carb: false },
      { name: "두부조림", protein: 13, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "양념", cookTime: "15분", fiber: false, carb: false },
    ],
    side2: [{ name: "계란말이", protein: 12, allergens: ["계란"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게", "실온"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false }],
    side3: [
      { name: "멸치볶음", protein: 8, allergens: ["생선"], vegetarian: false, texture: ["바삭한", "단단한"], temp: ["실온"], smell: ["비린내"], taste: ["짠맛"], seasoning: "양념", cookTime: "충분", fiber: false, carb: false },
      { name: "견과류조림", protein: 6, allergens: ["견과류"], vegetarian: true, texture: ["바삭한", "단단한"], temp: ["실온"], taste: ["단맛"], seasoning: "양념", cookTime: "충분", fiber: true, carb: false },
    ],
    rice: [{ name: "잡곡밥", protein: 6, allergens: [], vegetarian: true, texture: ["쫄깃한"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: true, carb: true }],
    soup: [{ name: "된장찌개", protein: 8, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["발효"], seasoning: "양념", cookTime: "15분", fiber: true, carb: false }],
  },
};

const CATEGORY_LABEL = { side1: "반찬 1", side2: "반찬 2", side3: "반찬 3", rice: "밥", soup: "국" };

// ── "식품 선택" 흐름 전용 메뉴 풀 — 식사 형태(마시는 것/떠먹는 것/핑거푸드/한그릇/일반식)별로 구성 ──
const DRINK_MEALS = [
  { name: "그릭요거트 스무디", protein: 15, allergens: ["우유"], vegetarian: true, texture: ["부드러운"], temp: ["차갑게"], taste: ["단맛"], seasoning: "재료본연", cookTime: "바로", fiber: false, carb: false },
  { name: "두유 프로틴쉐이크", protein: 18, allergens: ["대두"], vegetarian: true, texture: ["부드러운"], temp: ["차갑게", "실온"], smell: ["콩비린내"], seasoning: "담백", cookTime: "바로", fiber: false, carb: false },
  { name: "단호박 스프", protein: 6, allergens: ["우유"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "데우기", fiber: true, carb: true },
  { name: "닭가슴살 야채수프", protein: 14, allergens: [], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "데우기", fiber: true, carb: false },
  { name: "바나나 오트밀 스무디", protein: 8, allergens: [], vegetarian: true, texture: ["부드러운"], temp: ["차갑게", "실온"], taste: ["단맛"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: true },
  { name: "토마토 야채주스", protein: 3, allergens: [], vegetarian: true, texture: ["부드러운"], temp: ["차갑게"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: false },
];

const SPOON_MEALS = [
  { name: "계란찜", protein: 12, allergens: ["계란"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
  { name: "두부 계란죽", protein: 10, allergens: ["계란", "대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: true },
  { name: "그릭요거트 볼", protein: 15, allergens: ["우유"], vegetarian: true, texture: ["부드러운"], temp: ["차갑게"], taste: ["단맛"], seasoning: "재료본연", cookTime: "바로", fiber: false, carb: false },
  { name: "닭죽", protein: 12, allergens: [], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: true },
  { name: "연두부 계란탕", protein: 11, allergens: ["계란", "대두"], vegetarian: true, texture: ["부드러운"], temp: ["따뜻하게"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
  { name: "흰살생선 스크램블", protein: 16, allergens: ["생선", "계란"], vegetarian: false, texture: ["부드러운"], temp: ["따뜻하게"], smell: ["비린내"], seasoning: "담백", cookTime: "15분", fiber: false, carb: false },
];

const FINGER_MEALS = [
  { name: "닭가슴살 큐브 스틱", protein: 22, allergens: [], vegetarian: false, texture: ["쫄깃한", "단단한"], temp: ["실온", "차갑게"], seasoning: "담백", cookTime: "데우기", fiber: false, carb: false },
  { name: "삶은 계란", protein: 12, allergens: ["계란"], vegetarian: true, texture: ["단단한"], temp: ["실온"], seasoning: "재료본연", cookTime: "바로", fiber: false, carb: false },
  { name: "견과류 소분팩", protein: 8, allergens: ["견과류"], vegetarian: true, texture: ["바삭한", "단단한"], temp: ["실온"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: false },
  { name: "방울토마토 & 치즈스틱", protein: 10, allergens: ["우유"], vegetarian: true, texture: ["아삭한", "쫄깃한"], temp: ["차갑게", "실온"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: false },
  { name: "새우꼬치구이", protein: 18, allergens: ["갑각류"], vegetarian: false, texture: ["쫄깃한"], temp: ["따뜻하게", "실온"], seasoning: "양념", cookTime: "15분", fiber: false, carb: false },
  { name: "두부면 스틱구이", protein: 12, allergens: ["대두"], vegetarian: true, texture: ["바삭한"], temp: ["따뜻하게"], seasoning: "양념", cookTime: "15분", fiber: false, carb: false },
];

const BOWL_MEALS = [
  { name: "닭가슴살 포케", protein: 28, allergens: [], vegetarian: false, texture: ["부드러운", "아삭한"], temp: ["실온", "차갑게"], seasoning: "양념", cookTime: "15분", fiber: true, carb: true },
  { name: "두부 비빔밥", protein: 16, allergens: ["대두"], vegetarian: true, texture: ["아삭한", "부드러운"], temp: ["따뜻하게"], seasoning: "양념", cookTime: "15분", fiber: true, carb: true },
  { name: "연어 덮밥", protein: 24, allergens: ["생선"], vegetarian: false, texture: ["부드러운"], temp: ["실온", "차갑게"], smell: ["비린내"], seasoning: "담백", cookTime: "15분", fiber: false, carb: true },
  { name: "그릭요거트 그래놀라볼", protein: 18, allergens: ["우유", "견과류"], vegetarian: true, texture: ["바삭한", "부드러운"], temp: ["차갑게"], taste: ["단맛"], seasoning: "재료본연", cookTime: "바로", fiber: true, carb: true },
  { name: "새우 볶음밥", protein: 20, allergens: ["갑각류"], vegetarian: false, texture: ["쫄깃한"], temp: ["따뜻하게"], smell: ["향신료"], seasoning: "양념", cookTime: "충분", fiber: false, carb: true },
  { name: "렌틸콩 채소볼", protein: 17, allergens: [], vegetarian: true, texture: ["아삭한", "부드러운"], temp: ["실온"], seasoning: "재료본연", cookTime: "15분", fiber: true, carb: true },
];

const FORM_POOLS = {
  "마시는 것이 좋아요": DRINK_MEALS,
  "쉽게 떠먹는 것이 좋아요": SPOON_MEALS,
  "핑거푸드가 좋아요": FINGER_MEALS,
  "혼합형 한그릇 (덮밥, 비빔밥, 포케)": BOWL_MEALS,
};

// ── 향·맛 민감도/조리시간 조건으로 메뉴를 걸러내는 하드 필터 ──
function isItemAllowed(item, ctx) {
  if (item.smell?.some((s) => ctx.smellAvoid.includes(s))) return false;
  if (item.taste?.some((t) => ctx.tasteAvoid.includes(t))) return false;
  if (ctx.cookTime && item.cookTime) {
    const itemLevel = COOK_LEVEL[item.cookTime] ?? 1;
    const userLevel = COOK_LEVEL[ctx.cookTime] ?? 3;
    if (itemLevel > userLevel) return false; // 사용자가 쓸 수 있는 시간보다 조리시간이 더 필요하면 제외
  }
  return true;
}

// 문자열을 짧은 정수 해시로 변환 — 점수가 동점일 때 항상 같은 메뉴만 뽑히는 걸 막는 타이브레이커용
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// ── 식감/온도/간/영양 우선순위 선호도를 반영한 점수 계산 ──
// maxProtein: 같은 후보군 안에서 가장 높은 단백질 값 — 단백질 우선순위를 "상대 비교"로 정규화해
// 절대 단백질량이 큰 메뉴가 다른 선호(식감/온도/간)를 항상 압도하지 않도록 함
function scoreItem(item, ctx, maxProtein) {
  let score = 0;
  if (item.texture) score += item.texture.filter((t) => ctx.textures.includes(t)).length * 3;
  if (ctx.temp && item.temp?.includes(ctx.temp)) score += 3;
  if (item.seasoning && ctx.seasoning) {
    const itemLevel = SEASONING_LEVEL[item.seasoning] ?? 1;
    const userLevel = SEASONING_LEVEL[ctx.seasoning] ?? 1;
    score += Math.max(0, 2 - Math.abs(itemLevel - userLevel));
  }
  if (ctx.nutritionPriority === "단백질에 집중할래요" && maxProtein > 0) {
    score += (item.protein / maxProtein) * 3;
  }
  if (ctx.nutritionPriority === "채소, 식이섬유가 포함됐으면 좋겠어요" && item.fiber) score += 3;
  if (ctx.nutritionPriority === "탄수화물을 보충하고 싶어요" && item.carb) score += 3;
  return score;
}

// 후보군 중 선호도 최고점 메뉴 하나를 고르되, 동점이면 이름 해시로 순서를 흩어 항상 같은 메뉴로 쏠리지 않게 함
function pickBest(candidates, ctx, seed) {
  const maxProtein = Math.max(...candidates.map((c) => c.protein));
  const scored = candidates.map((item) => ({ ...item, _score: scoreItem(item, ctx, maxProtein) }));
  scored.sort((a, b) => b._score - a._score || hashStr(a.name + seed) - hashStr(b.name + seed));
  return scored;
}

// ── "마시는 것 / 떠먹는 것 / 핑거푸드 / 한그릇" 풀에서 상위 N개 선택 ──
function selectFromPool(pool, ctx, count, seed) {
  const allowed = pool.filter((item) => isItemAllowed(item, ctx));
  const insufficient = allowed.length === 0;
  const source = insufficient ? pool : allowed;
  const picked = pickBest(source, ctx, seed).slice(0, Math.max(1, Math.min(count, source.length)));
  return picked.map((item, idx) => ({ ...item, category: `pick${idx}`, insufficient }));
}

// ── "일반식" 선택 시: 반찬/밥/국 카테고리별로 선호도 최고 점수 메뉴를 선택 ──
function selectRegularPlan(tierKey, ctx, seed) {
  const tierData = MEAL_DB[tierKey];
  return Object.keys(tierData).map((cat) => {
    const options = tierData[cat];
    const allowed = options.filter((item) => isItemAllowed(item, ctx));
    const insufficient = allowed.length === 0;
    const source = insufficient ? options : allowed;
    const [best] = pickBest(source, ctx, seed);
    return { ...best, category: cat, insufficient };
  });
}

// ── 식품 선택 흐름의 메인 함수: 답변 9개를 모두 반영해 최종 식단 결정 ──
function buildFoodPreferencePlan({
  mealStyle,
  mealForm,
  nutritionPriority,
  texturePreference,
  tempPreference,
  smellSensitivity,
  tasteSensitivity,
  seasoningPreference,
  cookingTime,
}) {
  const ctx = {
    textures: texturePreference.map((t) => TEXTURE_TAGS[t]).filter(Boolean),
    temp: TEMP_TAGS[tempPreference],
    smellAvoid: smellSensitivity.map((s) => SMELL_TAGS[s]).filter(Boolean),
    tasteAvoid: tasteSensitivity.map((t) => TASTE_TAGS[t]).filter(Boolean),
    seasoning: SEASONING_TAGS[seasoningPreference],
    cookTime: COOKING_TIME_TAGS[cookingTime],
    nutritionPriority,
  };
  // 같은 답변 조합이면 항상 같은 결과가 나오도록(=일관성) 답변 전체를 시드로 사용
  const seed = [mealStyle, mealForm, nutritionPriority, ...texturePreference, tempPreference, ...smellSensitivity, ...tasteSensitivity, seasoningPreference, cookingTime].join("|");

  const isRegular = mealForm === "일반식이 좋아요" || !mealForm;
  let meals;

  if (isRegular) {
    const tierKey = nutritionPriority === "단백질에 집중할래요" ? "regular_highprotein" : "regular_balanced";
    meals = selectRegularPlan(tierKey, ctx, seed);
  } else {
    const pool = FORM_POOLS[mealForm] || BOWL_MEALS;
    const count = MEAL_STYLE_COUNT[mealStyle] || 2;
    meals = selectFromPool(pool, ctx, count, seed);
  }

  const totalProtein = meals.reduce((sum, m) => sum + (m?.protein || 0), 0);
  const hasInsufficient = meals.some((m) => m?.insufficient);
  return { meals, totalProtein, hasInsufficient, isRegular };
}

// ── 진행도 식판 컴포넌트 (SVG 기반, 최대 5칸까지 자동 배치) ──
function ProgressPlate({ step, meals }) {
  const slots = [
    { cx: 95, cy: 78, rx: 58, ry: 58, tint: "#FFF5F1", stroke: C.apricot },
    { cx: 200, cy: 72, rx: 68, ry: 60, tint: "#FFF9E8", stroke: "#D9A441" },
    { cx: 285, cy: 92, rx: 48, ry: 48, tint: "#FDF0EE", stroke: "#C4523F" },
    { cx: 112, cy: 188, rx: 98, ry: 58, tint: "#F2F6EE", stroke: C.sage },
    { cx: 262, cy: 192, rx: 68, ry: 66, tint: "#EAF1F6", stroke: C.blue },
  ];

  return (
    <svg viewBox="0 0 340 260" width="100%" height="auto" style={{ maxWidth: 320, margin: "0 auto", display: "block" }}>
      <rect x="12" y="12" width="316" height="236" rx="26" fill="#F5F4F0" stroke="#C9C7BE" strokeWidth="2" />
      <rect x="18" y="18" width="304" height="224" rx="22" fill="none" stroke="#DFDDD5" strokeWidth="1" />
      {slots.map((s, i) => {
        const filled = step >= i + 1;
        const meal = meals[i];
        return (
          <g key={i}>
            <ellipse
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={filled ? s.tint : "#FFFFFF"}
              stroke={filled ? s.stroke : "#E3E1D8"}
              strokeWidth={filled ? 2.5 : 1.5}
              style={{ transition: "all 0.35s ease" }}
            />
            {filled && meal && (
              <text
                x={s.cx}
                y={s.cy}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontFamily: "'IBM Plex Sans KR', sans-serif", fontSize: 12, fontWeight: 600, fill: C.ink }}
              >
                {meal.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function App() {
  const [flowType, setFlowType] = useState(null); // "recommendations" 또는 "food"
  const [currentStep, setCurrentStep] = useState(0); // 0=인트로, 1~N=폼, final=결과

  // 파트 1: 기본 신체정보
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");

  // 파트 2: 목표 설정
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDays, setTargetDays] = useState("");

  // 파트 3: 투약 정보
  const [medication, setMedication] = useState("wegovy");
  const [startDate, setStartDate] = useState("");
  const [dosageLevel, setDosageLevel] = useState("");
  const [recentIncrease, setRecentIncrease] = useState("");

  // 파트 4: 건강 상태
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);

  // 식품 선택 질문들 (식품 선택 경로용)
  const [mealStyle, setMealStyle] = useState("");
  const [mealForm, setMealForm] = useState("");
  const [nutritionPriority, setNutritionPriority] = useState("");
  const [texturePreference, setTexturePreference] = useState([]);
  const [tempPreference, setTempPreference] = useState("");
  const [smellSensitivity, setSmellSensitivity] = useState([]);
  const [tasteSensitivity, setTasteSensitivity] = useState([]);
  const [seasoningPreference, setSeasoningPreference] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const weeks = useMemo(() => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7)));
  }, [startDate]);

  const phase = startDate ? getPhase(weeks, recentIncrease) : "stable";
  const symptomProfile = getSymptomProfile(symptoms);
  const mealTier = getMealTier(phase, symptomProfile);
  const tierMeta = MEAL_TIER_META[mealTier];

  // 식품 선택 흐름: 9개 질문 답변을 모두 반영한 최종 식단
  const { meals, totalProtein, hasInsufficient, isRegular } = useMemo(
    () =>
      buildFoodPreferencePlan({
        mealStyle,
        mealForm,
        nutritionPriority,
        texturePreference,
        tempPreference,
        smellSensitivity,
        tasteSensitivity,
        seasoningPreference,
        cookingTime,
      }),
    [mealStyle, mealForm, nutritionPriority, texturePreference, tempPreference, smellSensitivity, tasteSensitivity, seasoningPreference, cookingTime]
  );

  const calorieTarget =
    height && weight && age && gender && activity && targetWeight && targetDays
      ? getCalorieTarget({ height, weight, age, gender, activity, targetWeight, targetMonths: targetDays })
      : null;
  const proteinTarget = weight ? getProteinTarget(weight, phase) : null;

  const toggleSymptom = (id) => {
    if (id === "none") {
      setSymptoms(["none"]);
      return;
    }
    setSymptoms((prev) => {
      const withoutNone = prev.filter((s) => s !== "none");
      return withoutNone.includes(id) ? withoutNone.filter((s) => s !== id) : [...withoutNone, id];
    });
  };

  const toggleDisease = (id) => {
    setDiseases((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleTexture = (texture) => {
    setTexturePreference((prev) => (prev.includes(texture) ? prev.filter((x) => x !== texture) : [...prev, texture]));
  };

  const toggleSmellSensitivity = (smell) => {
    setSmellSensitivity((prev) => (prev.includes(smell) ? prev.filter((x) => x !== smell) : [...prev, smell]));
  };

  const toggleTasteSensitivity = (taste) => {
    setTasteSensitivity((prev) => (prev.includes(taste) ? prev.filter((x) => x !== taste) : [...prev, taste]));
  };

  const canProceedStep = () => {
    // 권고사항 선택 흐름 (step: 1=투약정보, 2=건강상태, 3=결과)
    if (flowType === "recommendations") {
      if (currentStep === 1) return medication && startDate && dosageLevel && recentIncrease;
      if (currentStep === 2) return symptoms.length > 0;
      return true;
    }
    // 식품 선택 흐름 (step: 1=신체정보, 2=목표, 3~11=식품선호도, 12=결과)
    if (flowType === "food") {
      if (currentStep === 1) return height && weight && gender && age && activity;
      if (currentStep === 2) return targetWeight && targetDays;
      if (currentStep === 3) return mealStyle;
      if (currentStep === 4) return mealForm;
      if (currentStep === 5) return nutritionPriority;
      if (currentStep === 6) return texturePreference.length > 0;
      if (currentStep === 7) return tempPreference;
      if (currentStep === 8) return true; // 냄새 민감도는 선택사항
      if (currentStep === 9) return true; // 맛 민감도는 선택사항
      if (currentStep === 10) return seasoningPreference;
      if (currentStep === 11) return cookingTime;
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 || canProceedStep()) {
      if (flowType === "recommendations") {
        setCurrentStep(currentStep < 2 ? currentStep + 1 : 100); // 100 = 최종 결과 (권고사항 경로)
      } else if (flowType === "food") {
        setCurrentStep(currentStep < 11 ? currentStep + 1 : 101); // 101 = 최종 결과 (식품 경로)
      } else {
        // flowType이 아직 정해지지 않음 - 인트로 상태
        setCurrentStep(currentStep < 5 ? currentStep + 1 : 6);
      }
    } else {
      alert("필수 정보를 모두 입력해주세요.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setFlowType(null);
    setCurrentStep(0);
    setHeight("");
    setWeight("");
    setGender("");
    setAge("");
    setActivity("");
    setTargetWeight("");
    setTargetDays("");
    setMedication("wegovy");
    setStartDate("");
    setDosageLevel("");
    setRecentIncrease("");
    setSymptoms([]);
    setDiseases([]);
    setMealStyle("");
    setMealForm("");
    setNutritionPriority("");
    setTexturePreference([]);
    setTempPreference("");
    setSmellSensitivity([]);
    setTasteSensitivity([]);
    setSeasoningPreference("");
    setCookingTime("");
  };

  const chipStyle = (active, activeBg = C.sage) => ({
    background: active ? activeBg : C.sagePale,
    color: active ? "#fff" : C.sageDeep,
  });

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans KR', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .chip { transition: all 0.15s ease; }
        input[type="date"] { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16 font-body">
        {/* 인트로 */}
        {currentStep === 0 && !flowType && (
          <div className="flex flex-col items-center text-center gap-8">
            <div>
              <span
                className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                GLP-1 케어 다이어리
              </span>
              <p className="mt-6 max-w-md text-base leading-relaxed mx-auto" style={{ color: C.ink60 }}>
                오늘을 위해 가장 알맞은 방법을 선택해주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* 권고사항 선택 */}
              <button
                onClick={() => {
                  setFlowType("recommendations");
                  setCurrentStep(1);
                }}
                className="rounded-3xl p-8 flex flex-col items-start justify-between h-48 hover:shadow-lg transition-all"
                style={{ background: C.card, border: `2px solid ${C.sage}` }}
              >
                <div>
                  <p className="font-display text-lg font-semibold mb-2" style={{ color: C.sageDeep }}>
                    권고사항 선택
                  </p>
                  <p className="text-sm text-left" style={{ color: C.ink60 }}>
                    투약 상태와 증상을 알려주고 맞춤 권고를 받아보세요.
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: C.sage }} />
              </button>

              {/* 식품 선택 */}
              <button
                onClick={() => {
                  setFlowType("food");
                  setCurrentStep(1);
                }}
                className="rounded-3xl p-8 flex flex-col items-start justify-between h-48 hover:shadow-lg transition-all"
                style={{ background: C.card, border: `2px solid ${C.apricot}` }}
              >
                <div>
                  <p className="font-display text-lg font-semibold mb-2" style={{ color: C.apricotDeep }}>
                    식품 선택
                  </p>
                  <p className="text-sm text-left" style={{ color: C.ink60 }}>
                    오늘의 식사 선호도를 알려주고 추천 식품을 받아보세요.
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: C.apricot }} />
              </button>
            </div>
          </div>
        )}

        {/* ===== 권고사항 선택 흐름 ===== */}

        {/* 권고사항 흐름 - 1단계: 투약 정보 */}
        {flowType === "recommendations" && currentStep === 1 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">1단계: 투약 정보</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>복용 중인 약물과 투약 정보를 입력해주세요.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                투약 중인 약물 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {MEDS.map((m) => (
                  <button type="button" key={m.id} onClick={() => setMedication(m.id)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(medication === m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold mb-3">
                투약 시작일 <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
              {startDate && (
                <p className="font-mono text-xs mt-2" style={{ color: C.ink60 }}>
                  투약 {weeks}주차 · {phaseLabel[phase]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dosageLevel" className="block text-sm font-medium mb-2">
                현재 용량 단계 <span style={{ color: C.apricot }}>*</span>
              </label>
              <select
                id="dosageLevel"
                value={dosageLevel}
                onChange={(e) => setDosageLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              >
                <option value="">선택하세요</option>
                <option value="0.25">0.25mg (초기)</option>
                <option value="0.5">0.5mg</option>
                <option value="1">1mg</option>
                <option value="1.5">1.5mg</option>
                <option value="2">2mg (최대)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                최근 증량 여부 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex gap-2">
                {["예", "아니오"].map((ans) => (
                  <button type="button" key={ans} onClick={() => setRecentIncrease(ans)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(recentIncrease === ans)}>
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 권고사항 흐름 - 2단계: 건강 상태 */}
        {flowType === "recommendations" && currentStep === 2 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">2단계: 건강 상태</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘의 위장 상태와 기저질환을 선택해주세요.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                오늘의 위장 상태 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((s) => (
                  <button type="button" key={s.id} onClick={() => toggleSymptom(s.id)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(symptoms.includes(s.id), C.apricot)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">기저질환 체크 (필요시 선택)</label>
              <div className="flex flex-wrap gap-2">
                {DISEASE_OPTIONS.map((d) => (
                  <button type="button" key={d.id} onClick={() => toggleDisease(d.id)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(diseases.includes(d.id), C.blue)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                완료<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* ===== 식품 선택 흐름 ===== */}

        {/* 식품 흐름 - 1단계: 기본 신체정보 */}
        {flowType === "food" && currentStep === 1 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">1단계: 기본 신체정보</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>키, 몸무게, 성별, 나이, 활동 수준을 입력해주세요.</p>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-2">
                키 (cm) <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="height"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-2">
                몸무게 (kg) <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                성별 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex gap-2">
                {["남성", "여성"].map((g) => (
                  <button type="button" key={g} onClick={() => setGender(g)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(gender === g)}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2">
                나이 (만) <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="age"
                type="number"
                placeholder="35"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                활동 수준 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(ACTIVITY_FACTOR).map((act) => (
                  <button type="button" key={act} onClick={() => setActivity(act)} className="chip px-3 py-2 rounded-full text-sm font-medium" style={chipStyle(activity === act)}>
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 2단계: 목표 설정 */}
        {flowType === "food" && currentStep === 2 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">2단계: 목표 설정</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>목표 체중과 달성 기간을 입력해주세요.</p>
            </div>

            <div>
              <label htmlFor="targetWeight" className="block text-sm font-medium mb-2">
                목표 체중 (kg) <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="targetWeight"
                type="number"
                placeholder="60"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
            </div>

            <div>
              <label htmlFor="targetDays" className="block text-sm font-medium mb-2">
                목표 기간 (개월) <span style={{ color: C.apricot }}>*</span>
              </label>
              <input
                id="targetDays"
                type="number"
                placeholder="6"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 3단계: 식사 스타일 */}
        {flowType === "food" && currentStep === 3 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">3단계: 식사 스타일</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘은 어떤 스타일의 식사를 원하시나요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {MEAL_STYLE_OPTIONS.map((style, idx) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setMealStyle(style)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: mealStyle === style ? C.apricot : "#fff",
                    color: mealStyle === style ? "#fff" : C.ink,
                    border: `1px solid ${mealStyle === style ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {style}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 4단계: 식사 형태 */}
        {flowType === "food" && currentStep === 4 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">4단계: 식사 형태</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘은 어떤 형태의 식사를 원하시나요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {MEAL_FORM_OPTIONS.map((form, idx) => (
                <button
                  key={form}
                  type="button"
                  onClick={() => setMealForm(form)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: mealForm === form ? C.apricot : "#fff",
                    color: mealForm === form ? "#fff" : C.ink,
                    border: `1px solid ${mealForm === form ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {form}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 5단계: 영양 우선순위 */}
        {flowType === "food" && currentStep === 5 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">5단계: 영양 우선순위</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘의 식사에서 우선 보장받고 싶은 것은 무엇인가요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {NUTRITION_PRIORITY_OPTIONS.map((priority, idx) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setNutritionPriority(priority)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: nutritionPriority === priority ? C.apricot : "#fff",
                    color: nutritionPriority === priority ? "#fff" : C.ink,
                    border: `1px solid ${nutritionPriority === priority ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {priority}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 6단계: 식감 선호도 */}
        {flowType === "food" && currentStep === 6 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">6단계: 식감 선호도</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘은 어떤 씹는 느낌이 좋을까요?</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TEXTURE_OPTIONS.map((texture) => (
                <button
                  key={texture}
                  type="button"
                  onClick={() => toggleTexture(texture)}
                  className="chip px-4 py-2 rounded-full text-sm font-medium"
                  style={chipStyle(texturePreference.includes(texture), C.apricot)}
                >
                  {texture}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 7단계: 온도 선호도 */}
        {flowType === "food" && currentStep === 7 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">7단계: 온도 선호도</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘은 어떤 온도의 식사가 좋을까요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {TEMP_OPTIONS.map((temp, idx) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setTempPreference(temp)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: tempPreference === temp ? C.apricot : "#fff",
                    color: tempPreference === temp ? "#fff" : C.ink,
                    border: `1px solid ${tempPreference === temp ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {temp}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 8단계: 냄새 민감도 */}
        {flowType === "food" && currentStep === 8 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">8단계: 냄새 민감도</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘 특히 민감하게 느껴지는 향이 있나요? (선택사항)</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SMELL_OPTIONS.map((smell) => (
                <button
                  key={smell}
                  type="button"
                  onClick={() => toggleSmellSensitivity(smell)}
                  className="chip px-3 py-2 rounded-full text-xs font-medium"
                  style={chipStyle(smellSensitivity.includes(smell), C.blue)}
                >
                  {smell}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 9단계: 맛 민감도 */}
        {flowType === "food" && currentStep === 9 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">9단계: 맛 민감도</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘 특히 민감하게 느껴지는 맛이 있나요? (선택사항)</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TASTE_OPTIONS.map((taste) => (
                <button
                  key={taste}
                  type="button"
                  onClick={() => toggleTasteSensitivity(taste)}
                  className="chip px-4 py-2 rounded-full text-sm font-medium"
                  style={chipStyle(tasteSensitivity.includes(taste), C.blue)}
                >
                  {taste}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 10단계: 간과 풍미 */}
        {flowType === "food" && currentStep === 10 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">10단계: 간과 풍미</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>오늘 식사의 간과 풍미는 어느 정도가 좋을까요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {SEASONING_OPTIONS.map((season, idx) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => setSeasoningPreference(season)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: seasoningPreference === season ? C.apricot : "#fff",
                    color: seasoningPreference === season ? "#fff" : C.ink,
                    border: `1px solid ${seasoningPreference === season ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {season}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                다음<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 식품 흐름 - 11단계: 조리 시간 */}
        {flowType === "food" && currentStep === 11 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">11단계: 조리 시간</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>조리에 어느 정도 시간을 쓰실 수 있나요?</p>
            </div>

            <div className="flex flex-col gap-3">
              {COOKING_TIME_OPTIONS.map((time, idx) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setCookingTime(time)}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all"
                  style={{
                    background: cookingTime === time ? C.apricot : "#fff",
                    color: cookingTime === time ? "#fff" : C.ink,
                    border: `1px solid ${cookingTime === time ? C.apricot : C.sagePale}`,
                  }}
                >
                  {idx + 1}. {time}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={16} className="inline mr-1" />이전
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
                완료<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 결과 화면 - 권고사항 흐름 */}
        {flowType === "recommendations" && currentStep === 100 && (
          <div className="flex flex-col gap-8">
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-2" style={{ background: C.sagePale, color: C.sageDeep }}>
              <span className="font-mono text-xs uppercase tracking-widest">
                {phaseLabel[phase]} · 투약 {weeks}주차 · {MEDS.find((m) => m.id === medication)?.label}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
                {tierMeta.label}
              </h2>
              <p className="text-sm leading-relaxed">{tierMeta.desc}</p>
              {symptomProfile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {symptomProfile.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: "#fff", color: C.sageDeep }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <p>이 추천은 일반적인 식생활 지침을 참고한 정보이며 의학적 조언을 대체하지 않습니다. 식단 변경 전 담당 의료진 또는 영양사와 상의하세요.</p>
            </div>

            <button onClick={handleReset} className="self-center flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
              <RotateCcw size={14} />다시 입력하기
            </button>
          </div>
        )}

        {/* 결과 화면 - 식품 선택 흐름 */}
        {flowType === "food" && currentStep === 101 && (
          <div className="flex flex-col gap-8">
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-2" style={{ background: C.sagePale, color: C.sageDeep }}>
              <span className="font-mono text-xs uppercase tracking-widest">
                {mealForm || "일반식이 좋아요"} · {mealStyle ? mealStyle.split(" (")[0] : ""}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
                당신을 위한 추천 식사
              </h2>
              <p className="text-sm leading-relaxed mt-2">선택하신 식사 스타일, 식감, 온도, 향·맛 민감도, 조리 시간을 모두 반영해 오늘의 식단을 구성했어요.</p>
            </div>

            {hasInsufficient && (
              <div className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#FDF0EE", border: `1px solid ${C.warn}33`, color: C.apricotDeep }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <p>일부 항목은 선택하신 조건(알레르기·향/맛 민감도·조리 시간)에 완벽히 맞는 메뉴가 부족해, 가장 가까운 대안으로 채웠어요. 표시된 메뉴를 다시 확인해주세요.</p>
              </div>
            )}

            {/* 오늘의 목표 */}
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <h3 className="font-display text-lg font-semibold mb-4">오늘의 목표</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: C.ink60 }}>칼로리</p>
                  <p className="font-semibold">{calorieTarget ? `${calorieTarget} kcal` : "-"}</p>
                </div>
                <div>
                  <p style={{ color: C.ink60 }}>단백질</p>
                  <p className="font-semibold">
                    {proteinTarget ? `${proteinTarget} g` : "-"} <span className="font-normal text-xs" style={{ color: C.ink60 }}>(이 식단 {totalProtein}g)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 식사 구성 */}
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <h3 className="font-display text-lg font-semibold mb-4">추천 식사 구성</h3>

              {isRegular ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {meals.map((m) => (
                    <div key={m.category} className={m.category === "soup" ? "col-span-2" : ""}>
                      <p style={{ color: C.ink60 }}>{CATEGORY_LABEL[m.category]}</p>
                      <p className="font-semibold">
                        {m.name}
                        {m.insufficient && <span className="ml-1 text-xs font-normal" style={{ color: C.warn }}>(조건 확인 필요)</span>}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {meals.map((m, idx) => (
                    <div
                      key={m.category}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          {m.name}
                          {m.insufficient && <span className="ml-1 text-xs font-normal" style={{ color: C.warn }}>(조건 확인 필요)</span>}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: C.ink60 }}>메뉴 {idx + 1} · 단백질 {m.protein}g</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <p>이 추천은 당신의 선호도를 기반으로 하며, 개인의 건강 상태에 따라 조정이 필요할 수 있습니다. 특별한 건강 관련 우려사항이 있으시면 전문가와 상담하세요.</p>
            </div>

            <button onClick={handleReset} className="self-center flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
              <RotateCcw size={14} />다시 입력하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}