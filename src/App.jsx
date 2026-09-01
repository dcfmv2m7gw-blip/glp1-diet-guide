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

const ALLERGY_OPTIONS = ["계란", "우유", "밀", "대두", "견과류", "갑각류", "생선", "돼지고기"];

const INGREDIENT_OPTIONS = ["계란", "우유", "생선", "돼지고기"];

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

// ── 3. 식사 텍스처 등급 (4단계) ─────────────────────────────────
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

// ── 메뉴 DB: 4개 텍스처 티어별 실제 메뉴, 알레르기/채식 태그 포함 ──
const MEAL_DB = {
  liquid_soft: {
    side1: [
      { name: "두부 계란찜", protein: 9, allergens: ["계란", "대두"], vegetarian: true },
      { name: "닭가슴살 스크램블", protein: 14, allergens: ["계란"], vegetarian: false },
    ],
    side2: [
      { name: "부드러운 흰살생선찜", protein: 16, allergens: ["생선"], vegetarian: false },
      { name: "으깬 두부조림", protein: 10, allergens: ["대두"], vegetarian: true },
    ],
    rice: [
      { name: "야채죽", protein: 4, allergens: [], vegetarian: true },
      { name: "닭죽", protein: 12, allergens: [], vegetarian: false },
    ],
    soup: [{ name: "맑은 콩나물국", protein: 3, allergens: ["대두"], vegetarian: true }],
  },
  soft_lowfat: {
    side1: [
      { name: "닭가슴살 완자", protein: 18, allergens: [], vegetarian: false },
      { name: "두부구이", protein: 12, allergens: ["대두"], vegetarian: true },
    ],
    side2: [
      { name: "계란찜", protein: 12, allergens: ["계란"], vegetarian: true },
      { name: "삶은 새우", protein: 15, allergens: ["갑각류"], vegetarian: false },
    ],
    rice: [{ name: "잡곡밥 (소량)", protein: 5, allergens: [], vegetarian: true }],
    soup: [{ name: "저염 미소국", protein: 6, allergens: ["대두"], vegetarian: true }],
  },
  regular_highprotein: {
    side1: [
      { name: "닭가슴살 스테이크", protein: 26, allergens: [], vegetarian: false },
      { name: "연두부 스테이크", protein: 14, allergens: ["대두"], vegetarian: true },
    ],
    side2: [
      { name: "고등어구이", protein: 20, allergens: ["생선"], vegetarian: false },
      { name: "렌틸콩 샐러드", protein: 16, allergens: [], vegetarian: true },
    ],
    side3: [{ name: "그릭요거트", protein: 10, allergens: ["우유"], vegetarian: true }],
    rice: [{ name: "현미밥 (소량)", protein: 5, allergens: [], vegetarian: true }],
    soup: [{ name: "된장찌개", protein: 8, allergens: ["대두"], vegetarian: true }],
  },
  regular_balanced: {
    side1: [
      { name: "제육볶음", protein: 22, allergens: ["돼지고기"], vegetarian: false },
      { name: "두부조림", protein: 13, allergens: ["대두"], vegetarian: true },
    ],
    side2: [{ name: "계란말이", protein: 12, allergens: ["계란"], vegetarian: true }],
    side3: [
      { name: "멸치볶음", protein: 8, allergens: ["생선"], vegetarian: false },
      { name: "견과류조림", protein: 6, allergens: ["견과류"], vegetarian: true },
    ],
    rice: [{ name: "잡곡밥", protein: 6, allergens: [], vegetarian: true }],
    soup: [{ name: "된장찌개", protein: 8, allergens: ["대두"], vegetarian: true }],
  },
};

const CATEGORY_LABEL = { side1: "반찬 1", side2: "반찬 2", side3: "반찬 3", rice: "밥", soup: "국" };

// ── 알레르기 + 채식 여부로 안전한 메뉴만 필터링 ──
function filterSafeOptions(options, allergies, isVegetarian) {
  return options.filter((opt) => {
    const hasAllergen = opt.allergens.some((a) => allergies.includes(a));
    if (hasAllergen) return false;
    if ((isVegetarian === "채식" || isVegetarian === "비건") && !opt.vegetarian) return false;
    return true;
  });
}

// ── 최종 메뉴 선택: 필터 통과한 것 중 단백질 함량 높은 순, 없으면 fallback + 경고 표시 ──
function pickMeal(tierData, category, allergies, isVegetarian) {
  const options = tierData[category];
  if (!options) return null;
  const safe = filterSafeOptions(options, allergies, isVegetarian);
  const insufficient = safe.length === 0;
  const pool = insufficient ? options : safe;
  const chosen = [...pool].sort((a, b) => b.protein - a.protein)[0];
  return { ...chosen, category, insufficient };
}

function buildMealPlan(mealTier, allergies, isVegetarian) {
  const tierData = MEAL_DB[mealTier];
  const categories = Object.keys(tierData);
  const meals = categories.map((cat) => pickMeal(tierData, cat, allergies, isVegetarian));
  const totalProtein = meals.reduce((sum, m) => sum + (m?.protein || 0), 0);
  const hasInsufficient = meals.some((m) => m?.insufficient);
  return { meals, totalProtein, hasInsufficient };
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
  const [currentStep, setCurrentStep] = useState(0); // 0=인트로, 1~5=폼, 6=결과

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

  // 파트 5: 식습관 선호도
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [mealBudget, setMealBudget] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [isVegetarian, setIsVegetarian] = useState("");
  const [ingredients, setIngredients] = useState([]);

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

  const { meals, totalProtein, hasInsufficient } = useMemo(
    () => buildMealPlan(mealTier, allergies, isVegetarian),
    [mealTier, allergies, isVegetarian]
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

  const toggleAllergy = (a) => {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleIngredient = (ing) => {
    setIngredients((prev) => (prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]));
  };

  const canProceedStep = () => {
    switch (currentStep) {
      case 1:
        return height && weight && gender && age && activity;
      case 2:
        return targetWeight && targetDays;
      case 3:
        return medication && startDate && dosageLevel && recentIncrease;
      case 4:
        return symptoms.length > 0;
      case 5:
        return mealsPerDay && mealBudget && isVegetarian;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 0 || canProceedStep()) {
      setCurrentStep(currentStep < 5 ? currentStep + 1 : 6);
    } else {
      alert("필수 정보를 모두 입력해주세요.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
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
    setMealsPerDay("");
    setMealBudget("");
    setAllergies([]);
    setIsVegetarian("");
    setIngredients([]);
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
        {currentStep === 0 && (
          <div className="flex flex-col items-center text-center gap-6">
            <span
              className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: C.sagePale, color: C.sageDeep }}
            >
              GLP-1 케어 다이어리
            </span>
            <p className="max-w-md text-base leading-relaxed" style={{ color: C.ink60 }}>
              투약 시기와 오늘의 몸 상태를 알려주시면, 지금 소화가 편한 식단을 알려드려요.
            </p>
            <button
              onClick={handleNext}
              className="mt-6 py-3 px-8 rounded-full text-base font-semibold"
              style={{ background: C.apricot, color: "#fff" }}
            >
              시작하기
            </button>
          </div>
        )}

        {/* 1단계: 기본 신체정보 */}
        {currentStep === 1 && (
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

            <div className="flex justify-center pt-4">
              <ProgressPlate step={1} meals={meals} />
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

        {/* 2단계: 목표 설정 */}
        {currentStep === 2 && (
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

            <div className="flex justify-center pt-4">
              <ProgressPlate step={2} meals={meals} />
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

        {/* 3단계: 투약 정보 */}
        {currentStep === 3 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">3단계: 투약 정보</h2>
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

            <div className="flex justify-center pt-4">
              <ProgressPlate step={3} meals={meals} />
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

        {/* 4단계: 건강 상태 */}
        {currentStep === 4 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">4단계: 건강 상태</h2>
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

            <div className="flex justify-center pt-4">
              <ProgressPlate step={4} meals={meals} />
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

        {/* 5단계: 식습관 선호도 */}
        {currentStep === 5 && (
          <form className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">5단계: 식습관 선호도</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>마지막으로 식습관 정보를 입력해주세요.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                하루 식사 횟수 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex gap-2">
                {["2끼", "3끼", "4끼"].map((m) => (
                  <button type="button" key={m} onClick={() => setMealsPerDay(m)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(mealsPerDay === m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium mb-2">
                하루 식재료 예산 <span style={{ color: C.apricot }}>*</span>
              </label>
              <select
                id="budget"
                value={mealBudget}
                onChange={(e) => setMealBudget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              >
                <option value="">선택하세요</option>
                <option value="budget1">2만원 이하</option>
                <option value="budget2">2~4만원</option>
                <option value="budget3">4~6만원</option>
                <option value="budget4">6만원 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">알레르기 식품 (필요시 선택)</label>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((a) => (
                  <button type="button" key={a} onClick={() => toggleAllergy(a)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(allergies.includes(a), C.blue)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                채식 여부 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex gap-2">
                {["아니오", "채식", "비건"].map((v) => (
                  <button type="button" key={v} onClick={() => setIsVegetarian(v)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(isVegetarian === v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">원하는 식재료 포함 (필요시 선택)</label>
              <div className="flex flex-wrap gap-2">
                {INGREDIENT_OPTIONS.map((ing) => (
                  <button type="button" key={ing} onClick={() => toggleIngredient(ing)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(ingredients.includes(ing), C.apricot)}>
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            {/* 알레르기/채식 조건에 맞는 메뉴가 부족할 때 경고 */}
            {hasInsufficient && (allergies.length > 0 || isVegetarian === "채식" || isVegetarian === "비건") && (
              <div className="rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: "#FBEFEA", border: `1px solid ${C.warn}`, color: C.apricotDeep }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <p>선택하신 알레르기 조건에 맞는 메뉴가 부족해요. 일부 메뉴는 조건과 맞지 않을 수 있어요.</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <ProgressPlate step={5} meals={meals} />
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

        {/* 결과 화면 */}
        {currentStep === 6 && (
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

            {/* 알레르기/채식 조건 부족 경고 */}
            {hasInsufficient && (allergies.length > 0 || isVegetarian === "채식" || isVegetarian === "비건") && (
              <div className="rounded-2xl p-4 flex items-start gap-2.5 text-sm leading-relaxed" style={{ background: "#FBEFEA", border: `1px solid ${C.warn}`, color: C.apricotDeep }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <p>선택하신 알레르기 조건에 맞는 메뉴가 부족해요. 아래 메뉴 중 일부는 알레르기·채식 조건과 완전히 맞지 않을 수 있으니 확인 후 드세요.</p>
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
                    {proteinTarget ? `${proteinTarget} g` : "-"}
                    {proteinTarget && <span className="text-xs font-normal ml-1" style={{ color: C.ink60 }}>(이 식사 {totalProtein}g)</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* 식사 구성 */}
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <h3 className="font-display text-lg font-semibold mb-4">오늘의 식사 구성</h3>
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
            </div>

            {/* 입력 정보 요약 */}
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <h3 className="font-display text-lg font-semibold mb-4">입력하신 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: C.ink60 }}>신체정보</span>
                  <span className="font-medium">{height}cm · {weight}kg · {gender} · {age}세 · {activity}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: C.ink60 }}>목표</span>
                  <span className="font-medium">{targetWeight}kg · {targetDays}개월</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: C.ink60 }}>투약</span>
                  <span className="font-medium">{MEDS.find((m) => m.id === medication)?.label} · {dosageLevel}mg · 최근 증량 {recentIncrease}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: C.ink60 }}>식사</span>
                  <span className="font-medium">{mealsPerDay} · {mealBudget}</span>
                </div>
              </div>
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
      </div>
    </div>
  );
}