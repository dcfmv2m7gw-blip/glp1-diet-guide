import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Info, RotateCcw } from "lucide-react";

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

const CATEGORY_META = {
  A: {
    label: "저자극 유동식",
    desc: "위가 아직 예민한 시기예요. 소량씩, 부드럽고 자극 없는 음식으로 채워주세요.",
  },
  B: {
    label: "소량 고단백 연식",
    desc: "적응이 진행 중이에요. 양은 적게, 단백질 밀도는 높게 구성했어요.",
  },
  C: {
    label: "균형 잡힌 일반식",
    desc: "몸이 안정된 시기예요. 단백질과 식이섬유 균형을 챙긴 일반식이에요.",
  },
};

const MEAL_DB = {
  A: {
    side1: [{ name: "멸치볶음", allergens: ["생선"] }],
    side2: [{ name: "장조림", allergens: ["대두"] }],
    side3: [{ name: "계란찜", allergens: ["계란"] }],
    rice: [{ name: "흰쌀밥", allergens: [] }],
    soup: [{ name: "된장찌개", allergens: ["대두"] }],
  },
  B: {
    side1: [{ name: "멸치볶음", allergens: ["생선"] }],
    side2: [{ name: "장조림", allergens: ["대두"] }],
    side3: [{ name: "계란찜", allergens: ["계란"] }],
    rice: [{ name: "흰쌀밥", allergens: [] }],
    soup: [{ name: "된장찌개", allergens: ["대두"] }],
  },
  C: {
    side1: [{ name: "멸치볶음", allergens: ["생선"] }],
    side2: [{ name: "장조림", allergens: ["대두"] }],
    side3: [{ name: "계란찜", allergens: ["계란"] }],
    rice: [{ name: "흰쌀밥", allergens: [] }],
    soup: [{ name: "된장찌개", allergens: ["대두"] }],
  },
};

function getPhase(weeks) {
  if (weeks < 4) return "initial";
  if (weeks < 12) return "adapting";
  return "stable";
}

function getSeverity(symptoms) {
  if (symptoms.length === 0 || symptoms.includes("none")) return "none";
  const severe = symptoms.includes("nausea") || symptoms.includes("vomiting");
  if (severe || symptoms.length >= 3) return "severe";
  return "mild";
}

function getCategory(phase, severity) {
  if (phase === "initial" || severity === "severe") return "A";
  if (phase === "adapting" || severity === "mild") return "B";
  return "C";
}

const phaseLabel = { initial: "초기 적응기", adapting: "용량 조절기", stable: "안정기" };

// 진행도 식판 컴포넌트
function ProgressPlate({ step }) {
  const dishNames = ["멸치볶음", "장조림", "계란찜", "흰쌀밥", "된장찌개"];
  const dishColors = [C.apricot, C.apricot, C.apricot, C.sage, C.blue];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: "6px", justifyContent: "center" }}>
      {/* 반찬 1 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: `2px solid ${step >= 1 ? dishColors[0] : C.sagePale}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          padding: 3,
          background: step >= 1 ? "#FFF5F1" : "transparent",
          color: C.ink,
        }}
      >
        {step >= 1 ? "멸치\n볶음" : ""}
      </div>
      {/* 반찬 2 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: `2px solid ${step >= 2 ? dishColors[1] : C.sagePale}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          padding: 3,
          background: step >= 2 ? "#FFF5F1" : "transparent",
          color: C.ink,
        }}
      >
        {step >= 2 ? "장\n조림" : ""}
      </div>
      {/* 반찬 3 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: `2px solid ${step >= 3 ? dishColors[2] : C.sagePale}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          padding: 3,
          background: step >= 3 ? "#FFF5F1" : "transparent",
          color: C.ink,
        }}
      >
        {step >= 3 ? "계란\n찜" : ""}
      </div>
      {/* 밥 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: `2px solid ${step >= 4 ? dishColors[3] : C.sagePale}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          padding: 3,
          background: step >= 4 ? "#DCE6D6" : "transparent",
          color: C.ink,
          gridColumn: "1 / 2",
        }}
      >
        {step >= 4 ? "흰쌀\n밥" : ""}
      </div>
      {/* 국 */}
      <div
        style={{
          width: 60,
          height: 60,
          border: `2px solid ${step >= 5 ? dishColors[4] : C.sagePale}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          textAlign: "center",
          padding: 3,
          background: step >= 5 ? "#E8F1F8" : "transparent",
          color: C.ink,
          gridColumn: "2 / 4",
        }}
      >
        {step >= 5 ? "된장\n찌개" : ""}
      </div>
    </div>
  );
}

export default function App() {
  // 현재 단계 (0~5: 0=인트로, 1~5=폼 단계, 6=결과)
  const [currentStep, setCurrentStep] = useState(0);

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
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, diff);
  }, [startDate]);

  const phase = getPhase(weeks);
  const severity = getSeverity(symptoms);
  const category = getCategory(phase, severity);

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
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        // 모든 단계 완료 → 결과 페이지
        setCurrentStep(6);
      }
    } else {
      alert("필수 정보를 모두 입력해주세요.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
        {/* 인트로 화면 */}
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

        {/* 파트 1: 기본 신체정보 */}
        {currentStep === 1 && (
          <form
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: C.ink }}>
                1단계: 기본 신체정보
              </h2>
              <p className="text-sm" style={{ color: C.ink60 }}>
                키, 몸무게, 성별, 나이, 활동 수준을 입력해주세요.
              </p>
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
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: gender === g ? C.sage : C.sagePale,
                      color: gender === g ? "#fff" : C.sageDeep,
                    }}
                  >
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
                {["거의 운동 안 함", "가벼운 활동", "중간 활동", "높은 활동"].map((act) => (
                  <button
                    type="button"
                    key={act}
                    onClick={() => setActivity(act)}
                    className="chip px-3 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: activity === act ? C.sage : C.sagePale,
                      color: activity === act ? "#fff" : C.sageDeep,
                    }}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* 진행도 식판 */}
            <div className="flex justify-center pt-4">
              <ProgressPlate step={1} />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-full font-medium"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-full font-medium text-white"
                style={{ background: C.apricot }}
              >
                다음
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 파트 2: 목표 설정 */}
        {currentStep === 2 && (
          <form
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: C.ink }}>
                2단계: 목표 설정
              </h2>
              <p className="text-sm" style={{ color: C.ink60 }}>
                목표 체중과 달성 기간을 입력해주세요.
              </p>
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

            {/* 진행도 식판 */}
            <div className="flex justify-center pt-4">
              <ProgressPlate step={2} />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-full font-medium"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-full font-medium text-white"
                style={{ background: C.apricot }}
              >
                다음
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 파트 3: 투약 정보 */}
        {currentStep === 3 && (
          <form
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: C.ink }}>
                3단계: 투약 정보
              </h2>
              <p className="text-sm" style={{ color: C.ink60 }}>
                복용 중인 약물과 투약 정보를 입력해주세요.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                투약 중인 약물 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {MEDS.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMedication(m.id)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: medication === m.id ? C.sage : C.sagePale,
                      color: medication === m.id ? "#fff" : C.sageDeep,
                    }}
                  >
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
                  <button
                    type="button"
                    key={ans}
                    onClick={() => setRecentIncrease(ans)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: recentIncrease === ans ? C.sage : C.sagePale,
                      color: recentIncrease === ans ? "#fff" : C.sageDeep,
                    }}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            {/* 진행도 식판 */}
            <div className="flex justify-center pt-4">
              <ProgressPlate step={3} />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-full font-medium"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-full font-medium text-white"
                style={{ background: C.apricot }}
              >
                다음
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 파트 4: 건강 상태 */}
        {currentStep === 4 && (
          <form
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: C.ink }}>
                4단계: 건강 상태
              </h2>
              <p className="text-sm" style={{ color: C.ink60 }}>
                오늘의 위장 상태와 기저질환을 선택해주세요.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                오늘의 위장 상태 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: symptoms.includes(s.id) ? C.apricot : C.sagePale,
                      color: symptoms.includes(s.id) ? "#fff" : C.sageDeep,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">기저질환 체크 (필요시 선택)</label>
              <div className="flex flex-wrap gap-2">
                {DISEASE_OPTIONS.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => toggleDisease(d.id)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: diseases.includes(d.id) ? C.blue : C.sagePale,
                      color: diseases.includes(d.id) ? "#fff" : C.sageDeep,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 진행도 식판 */}
            <div className="flex justify-center pt-4">
              <ProgressPlate step={4} />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-full font-medium"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-full font-medium text-white"
                style={{ background: C.apricot }}
              >
                다음
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 파트 5: 식습관 선호도 */}
        {currentStep === 5 && (
          <form
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-6"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: C.ink }}>
                5단계: 식습관 선호도
              </h2>
              <p className="text-sm" style={{ color: C.ink60 }}>
                마지막으로 식습관 정보를 입력해주세요.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                하루 식사 횟수 <span style={{ color: C.apricot }}>*</span>
              </label>
              <div className="flex gap-2">
                {["2끼", "3끼", "4끼"].map((meals) => (
                  <button
                    type="button"
                    key={meals}
                    onClick={() => setMealsPerDay(meals)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: mealsPerDay === meals ? C.sage : C.sagePale,
                      color: mealsPerDay === meals ? "#fff" : C.sageDeep,
                    }}
                  >
                    {meals}
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
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAllergy(a)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: allergies.includes(a) ? C.blue : C.sagePale,
                      color: allergies.includes(a) ? "#fff" : C.sageDeep,
                    }}
                  >
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
                {["아니오", "채식", "비건"].map((veg) => (
                  <button
                    type="button"
                    key={veg}
                    onClick={() => setIsVegetarian(veg)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: isVegetarian === veg ? C.sage : C.sagePale,
                      color: isVegetarian === veg ? "#fff" : C.sageDeep,
                    }}
                  >
                    {veg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">원하는 식재료 포함 (필요시 선택)</label>
              <div className="flex flex-wrap gap-2">
                {INGREDIENT_OPTIONS.map((ing) => (
                  <button
                    type="button"
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className="chip px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      background: ingredients.includes(ing) ? C.apricot : C.sagePale,
                      color: ingredients.includes(ing) ? "#fff" : C.sageDeep,
                    }}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            {/* 진행도 식판 */}
            <div className="flex justify-center pt-4">
              <ProgressPlate step={5} />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 rounded-full font-medium"
                style={{ background: C.sagePale, color: C.sageDeep }}
              >
                <ChevronLeft size={16} className="inline mr-1" />
                이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-full font-medium text-white"
                style={{ background: C.apricot }}
              >
                완료
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </form>
        )}

        {/* 결과 페이지 */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-8">
            {/* 결과 요약 */}
            <div
              className="rounded-3xl p-6 md:p-8 flex flex-col gap-2"
              style={{ background: C.sagePale, color: C.sageDeep }}
            >
              <span className="font-mono text-xs uppercase tracking-widest">
                {phaseLabel[phase]} · 투약 {weeks}주차 · {MEDS.find((m) => m.id === medication)?.label}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
                {CATEGORY_META[category].label}
              </h2>
              <p className="text-sm leading-relaxed">{CATEGORY_META[category].desc}</p>
            </div>

            {/* 식사 정보 카드 */}
            <div
              className="rounded-3xl p-6 md:p-8"
              style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
            >
              <h3 className="font-display text-lg font-semibold mb-4">오늘의 식사 구성</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: C.ink60 }}>반찬 1</p>
                  <p className="font-semibold">멸치볶음</p>
                </div>
                <div>
                  <p style={{ color: C.ink60 }}>반찬 2</p>
                  <p className="font-semibold">장조림</p>
                </div>
                <div>
                  <p style={{ color: C.ink60 }}>반찬 3</p>
                  <p className="font-semibold">계란찜</p>
                </div>
                <div>
                  <p style={{ color: C.ink60 }}>밥</p>
                  <p className="font-semibold">흰쌀밥</p>
                </div>
                <div className="col-span-2">
                  <p style={{ color: C.ink60 }}>국</p>
                  <p className="font-semibold">된장찌개</p>
                </div>
              </div>
            </div>

            {/* 입력된 정보 요약 */}
            <div
              className="rounded-3xl p-6 md:p-8"
              style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
            >
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
                  <span className="font-medium">{MEDS.find((m) => m.id === medication)?.label} · {dosageLevel}mg · {recentIncrease}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: C.ink60 }}>식사</span>
                  <span className="font-medium">{mealsPerDay} · {mealBudget}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed"
              style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}
            >
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <p>
                이 추천은 일반적인 식생활 지침을 참고한 정보이며 의학적 조언을 대체하지 않습니다. 식단 변경 전
                담당 의료진 또는 영양사와 상의하세요.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="self-center flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full focus:outline-none focus:ring-2"
              style={{ background: C.sagePale, color: C.sageDeep }}
            >
              <RotateCcw size={14} />
              다시 입력하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}