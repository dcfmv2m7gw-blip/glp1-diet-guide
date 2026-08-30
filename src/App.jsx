import { useState, useMemo } from "react";
import { Sunrise, Sun, Moon, Apple, Info, RotateCcw } from "lucide-react";

/* ---------------------------------------------
   Design tokens
   bg: #F6F3ED (paper)  ink: #2A3328
   sage: #5F8767 (primary)  sage-pale: #DCE6D6
   apricot: #E1815C (cta)  dusty-blue: #6E8CA0 (info/allergy)
--------------------------------------------- */
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

const MEDS = [
  { id: "wegovy", label: "위고비" },
  { id: "mounjaro", label: "마운자로" },
  { id: "saxenda", label: "삭센다" },
  { id: "other", label: "기타" },
];

const SLOTS = [
  { id: "breakfast", label: "아침", Icon: Sunrise },
  { id: "lunch", label: "점심", Icon: Sun },
  { id: "dinner", label: "저녁", Icon: Moon },
  { id: "snack", label: "간식", Icon: Apple },
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
    breakfast: [
      { name: "계란 노른자 흰죽", allergens: ["계란"], focus: ["저자극", "에너지 보충"] },
      { name: "두유 바나나 스무디", allergens: ["대두"], focus: ["수분 보충", "부드러운 단백질"] },
    ],
    lunch: [
      { name: "닭가슴살 야채죽", allergens: [], focus: ["저자극", "고단백"] },
      { name: "두부 계란찜", allergens: ["대두", "계란"], focus: ["부드러운 단백질"] },
    ],
    dinner: [
      { name: "흰살생선 감자 스튜", allergens: ["생선"], focus: ["저자극", "소화 편안"] },
      { name: "소고기 다짐육 야채죽", allergens: [], focus: ["철분 보충", "저자극"] },
    ],
    snack: [
      { name: "플레인 그릭요거트", allergens: ["우유"], focus: ["단백질 보충"] },
      { name: "무가당 요거트 + 바나나 반개", allergens: ["우유"], focus: ["수분", "칼륨 보충"] },
    ],
  },
  B: {
    breakfast: [
      { name: "계란찜 + 흰쌀밥 소량", allergens: ["계란"], focus: ["고단백", "소량 구성"] },
      { name: "오트밀 우유죽 + 견과류 약간", allergens: ["우유", "견과류"], focus: ["식이섬유", "포만감"] },
    ],
    lunch: [
      { name: "닭가슴살 부드러운 샐러드", allergens: [], focus: ["고단백", "저지방"] },
      { name: "순두부찌개 (소량밥)", allergens: ["대두"], focus: ["부드러운 단백질"] },
    ],
    dinner: [
      { name: "연두부 소고기 볶음", allergens: ["대두"], focus: ["고단백", "소화 편안"] },
      { name: "흰살생선 구이 + 으깬 감자", allergens: ["생선"], focus: ["고단백", "저자극"] },
    ],
    snack: [
      { name: "삶은 계란 1개", allergens: ["계란"], focus: ["고단백 간편식"] },
      { name: "저지방 치즈스틱", allergens: ["우유"], focus: ["단백질 보충"] },
    ],
  },
  C: {
    breakfast: [
      { name: "현미밥 + 된장국 + 계란말이", allergens: ["계란", "대두"], focus: ["균형식", "식이섬유"] },
      { name: "통밀토스트 + 아보카도 + 삶은계란", allergens: ["밀", "계란"], focus: ["불포화지방", "고단백"] },
    ],
    lunch: [
      { name: "닭가슴살 곤약 비빔밥", allergens: [], focus: ["고단백", "저칼로리"] },
      { name: "연어 스테이크 + 구운 채소", allergens: ["생선"], focus: ["오메가3", "고단백"] },
    ],
    dinner: [
      { name: "소고기 야채볶음 + 현미밥", allergens: [], focus: ["철분", "균형식"] },
      { name: "두부 스테이크 + 샐러드", allergens: ["대두"], focus: ["식물성 단백질", "식이섬유"] },
    ],
    snack: [
      { name: "아몬드 한 줌", allergens: ["견과류"], focus: ["불포화지방"] },
      { name: "그릭요거트 + 블루베리", allergens: ["우유"], focus: ["항산화", "단백질"] },
    ],
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

function getCapacity(phase, severity) {
  let base = phase === "initial" ? 32 : phase === "adapting" ? 62 : 90;
  if (severity === "severe") base -= 22;
  else if (severity === "mild") base -= 10;
  return Math.max(8, Math.min(96, base));
}

function pickMeal(category, slot, allergies) {
  const options = MEAL_DB[category][slot];
  const safe = options.find((m) => m.allergens.every((a) => !allergies.includes(a)));
  return safe || null;
}

const phaseLabel = { initial: "초기 적응기", adapting: "용량 조절기", stable: "안정기" };

export default function App() {
  const [medication, setMedication] = useState("wegovy");
  const [startDate, setStartDate] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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
  const capacity = getCapacity(phase, severity);
  const capacityY = 190 - (capacity / 100) * 180;

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

  const toggleAllergy = (a) => {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100%" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans KR', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .wave-scroll { animation: waveMove 7s linear infinite; }
        .wave-scroll-b { animation: waveMove 10s linear infinite reverse; }
        @keyframes waveMove { from { transform: translateX(0); } to { transform: translateX(-200px); } }
        @media (prefers-reduced-motion: reduce) {
          .wave-scroll, .wave-scroll-b { animation: none; }
        }
        .chip { transition: all 0.15s ease; }
        input[type="date"] { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16 font-body">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span
            className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ background: C.sagePale, color: C.sageDeep }}
          >
            GLP-1 케어 다이어리
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight" style={{ color: C.ink }}>
            포만노트
          </h1>
          <p className="max-w-md text-base leading-relaxed" style={{ color: C.ink60 }}>
            투약 시기와 오늘의 몸 상태를 알려주시면, 지금 소화가 편한 식단을 알려드려요.
          </p>

          {/* Signature gauge */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 mt-2">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <clipPath id="gaugeClip">
                  <circle cx="100" cy="100" r="92" />
                </clipPath>
              </defs>
              <circle cx="100" cy="100" r="92" fill={C.card} />
              <g clipPath="url(#gaugeClip)">
                <g style={{ transform: `translateY(${capacityY}px)`, transition: "transform 0.6s ease" }}>
                  <g className="wave-scroll">
                    <path
                      d="M0,20 C25,5 75,35 100,20 C125,5 175,35 200,20 C225,5 275,35 300,20 C325,5 375,35 400,20 L400,300 L0,300 Z"
                      fill={C.sage}
                      opacity="0.92"
                    />
                  </g>
                  <g className="wave-scroll wave-scroll-b">
                    <path
                      d="M0,28 C25,42 75,14 100,28 C125,42 175,14 200,28 C225,42 275,14 300,28 C325,42 375,14 400,28 L400,300 L0,300 Z"
                      fill={C.sagePale}
                      opacity="0.7"
                    />
                  </g>
                </g>
              </g>
              <circle cx="100" cy="100" r="92" fill="none" stroke={C.ink} strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-medium" style={{ color: capacity < 40 ? C.card : C.ink }}>
                {capacity}
              </span>
              <span className="font-mono text-[10px] tracking-wide" style={{ color: capacity < 40 ? C.card : C.ink60 }}>
                오늘의 소화 여유
              </span>
            </div>
          </div>
          {!startDate && (
            <p className="text-xs" style={{ color: C.ink60 }}>
              투약 시작일을 입력하면 지수가 정확해져요.
            </p>
          )}
        </div>

        {/* Form */}
        {!submitted && (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl p-6 md:p-8 flex flex-col gap-7"
            style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
          >
            {/* Medication */}
            <div>
              <label className="block text-sm font-semibold mb-3">투약 중인 약물</label>
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

            {/* Start date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold mb-3">
                투약 시작일
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }}
              />
              {startDate && (
                <p className="font-mono text-xs mt-2" style={{ color: C.ink60 }}>
                  투약 {weeks}주차 · {phaseLabel[phase]}
                </p>
              )}
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold mb-3">오늘의 위장 상태</label>
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

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold mb-3">알레르기 식품 (해당 시 선택)</label>
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

            <button
              type="submit"
              disabled={!startDate}
              className="mt-2 py-3.5 rounded-full text-base font-semibold transition focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{ background: C.apricot, color: "#fff" }}
            >
              오늘의 식단 추천받기
            </button>
          </form>
        )}

        {/* Results */}
        {submitted && (
          <div className="flex flex-col gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SLOTS.map(({ id, label, Icon }) => {
                const meal = pickMeal(category, id, allergies);
                return (
                  <div
                    key={id}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} color={C.sageDeep} />
                      <span className="font-mono text-xs uppercase tracking-widest" style={{ color: C.ink60 }}>
                        {label}
                      </span>
                    </div>
                    {meal ? (
                      <>
                        <p className="font-display text-lg font-semibold">{meal.name}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {meal.focus.map((f) => (
                            <span
                              key={f}
                              className="text-xs px-2.5 py-1 rounded-full"
                              style={{ background: C.sagePale, color: C.sageDeep }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: C.ink60 }}>
                        선택하신 알레르기 정보로 인해 이 시간대엔 추천 가능한 메뉴가 없어요. 성분표를 직접 확인해주세요.
                      </p>
                    )}
                  </div>
                );
              })}
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