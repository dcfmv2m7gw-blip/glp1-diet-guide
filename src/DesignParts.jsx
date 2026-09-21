import { ChevronLeft, ChevronRight, Check, Info, AlertCircle } from "lucide-react";
import { C, TONE } from "./theme.js";
import brandLogo from "./dasi-chaum-logo.png";
import brandIcon from "./dasi-chaum-icon.png";

// 목업(홈 · 권고사항 · 체중 변화 · 식품 선택) 스타일을 모아 둔 파일.
// App.jsx의 C 팔레트와 같은 값을 쓰되, 순환 import를 피하려고 여기서 따로 정의한다.
const P = {
  ink: "#14162E",
  navyInk: "#262B66",
  navy: "#383E8C",
  ink60: "#5F6699",
  ink40: "#6E74A0",
  sage: "#6B72C4",
  peri: "#8F97E8",
  periLight: "#C9CDF5",
  pale: "#E4E7F6",
  tint: "#EDEFF9",
  line: "#E1E4F3",
  coral: "#FF7B63",
  apricot: "#FF8A5B",
  apricotDeep: "#BE4D26",
  apricotPale: "#FFF1EA",
  apricotLine: "#F0B39C",
  green: "#3E7A55",
  leaf: "#DCEBDF",
};

const cardShadow = "0 1px 2px rgba(20,22,46,0.04), 0 14px 30px -22px rgba(56,62,140,0.45)";
const S = { stroke: P.navy, strokeWidth: 2.8, strokeLinecap: "round", strokeLinejoin: "round" };

// ══════════════════════════════════════════════════════════════════
// 아이콘 (64×64). 배경 원은 IconCircle이 그린다.
// ══════════════════════════════════════════════════════════════════
export function IconGuide({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="11" y="12" width="31" height="41" rx="5" fill="#fff" {...S} />
      <rect x="19.5" y="7.5" width="14" height="9" rx="3" fill="#fff" {...S} />
      <path d="M18 25h17M18 32h17M18 39h10" {...S} />
      <circle cx="44" cy="46" r="11" fill={P.coral} />
      <path d="M44 40.5v11M38.5 46h11" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconFood({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M25 34c-6-1-9-6-7-10-3-4 0-9 5-9 1-5 8-6 10-1 5 0 8 5 5 9 2 4-1 10-6 11z" fill={P.leaf} {...S} />
      <path d="M26 33V19M26 26l-4-3M26 22l4-3" {...S} strokeWidth="2.2" />
      <circle cx="42.5" cy="27" r="8.5" fill={P.coral} />
      <path d="M42.5 18.5l-1-3.5M42.5 19c2-2.2 4.6-2.2 6 0" stroke={P.green} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 34h50c0 10.5-11 17-25 17S7 44.5 7 34z" fill="#fff" {...S} />
      <path d="M25 55.5h14" {...S} />
    </svg>
  );
}

export function IconWeight({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="11.5" y="42" width="7" height="12" rx="2.5" fill={P.periLight} />
      <rect x="23.5" y="35" width="7" height="19" rx="2.5" fill={P.periLight} />
      <rect x="35.5" y="35" width="7" height="19" rx="2.5" fill={P.peri} />
      <rect x="47.5" y="23" width="7" height="31" rx="2.5" fill={P.peri} />
      <path d="M15 35l12-7h12l12-13" {...S} />
      {[[15, 35], [27, 28], [39, 28], [51, 15]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.4" fill={P.coral} />)}
    </svg>
  );
}

export function IconDoc({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="13" y="9" width="29" height="41" rx="5" fill="#fff" {...S} />
      <path d="M20.5 20h14M20.5 27h14M20.5 34h8" {...S} />
      <circle cx="43" cy="44" r="10.5" fill={P.coral} />
    </svg>
  );
}

export function IconPill({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g transform="rotate(-45 28 38)">
        <path d="M28 28h12a10 10 0 0 1 0 20H28z" fill={P.peri} />
        <rect x="6" y="28" width="44" height="20" rx="10" {...S} />
        <path d="M28 28v20" {...S} />
      </g>
      <path d="M53 9l2.5-5M57.5 15l5-2.5" stroke={P.coral} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 8l18 6.5V29c0 12.5-7.8 21.5-18 26-10.2-4.5-18-13.5-18-26V14.5z" fill="#fff" {...S} />
      <rect x="28" y="21" width="8" height="21" rx="2" fill={P.coral} />
      <rect x="21.5" y="27.5" width="21" height="8" rx="2" fill={P.coral} />
    </svg>
  );
}

export function IconSprout({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 52V31" {...S} strokeWidth="3.4" />
      <path d="M32 35C30 25 22 20 11 21c0 10 8 15.5 21 14z" {...S} strokeWidth="3.4" />
      <path d="M32 31c1-9.5 8-14.5 19-13.5 0 9.5-7 14.5-19 13.5z" {...S} strokeWidth="3.4" />
    </svg>
  );
}

// 권고사항 첫 화면의 큰 그림
export function HeroClipboard({ size = 170 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="46" y="46" width="86" height="112" rx="13" fill="#fff" stroke={P.navy} strokeWidth="5.5" />
      <rect x="68" y="32" width="42" height="24" rx="8" fill="#fff" stroke={P.navy} strokeWidth="5.5" />
      {[82, 106, 130].map((y) => (
        <g key={y} stroke={P.navy} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M61 ${y}l6 6 10-11`} />
          <path d={`M88 ${y + 1}h28`} />
        </g>
      ))}
      <circle cx="136" cy="146" r="27" fill={P.coral} />
      <path d="M136 132v28M122 146h28" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
      <path d="M152 40l7-15M162 63l14-7" stroke={P.peri} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// 체중 변화 첫 화면의 큰 그림
export function HeroScale({ size = 170 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <g transform="rotate(-14 100 130)">
        <rect x="40" y="70" width="118" height="116" rx="24" fill={P.periLight} />
        <rect x="34" y="62" width="118" height="116" rx="24" fill="#DCDFFA" stroke="#fff" strokeWidth="4" />
        <path d="M63 112a30 30 0 0 1 60 0z" fill="#fff" />
        <path d="M73 99l4 3M93 86v5M113 99l-4 3" stroke={P.navy} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M93 110l5-20" stroke={P.coral} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="93" cy="110" r="4.5" fill={P.coral} />
      </g>
      <path d="M58 24l34 34 17-10 30 32" stroke={P.peri} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M121 82h20V62" stroke={P.peri} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M152 36l6-15M165 55l13-9" stroke={P.coral} strokeWidth="6" strokeLinecap="round" />
      <path d="M174 118c-9-6-14-11-14-17a7.5 7.5 0 0 1 14-3.5 7.5 7.5 0 0 1 14 3.5c0 6-5 11-14 17z" fill={P.periLight} />
    </svg>
  );
}

export function IconCircle({ size = 76, bg = P.tint, children }) {
  return (
    <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: size, height: size, background: bg }}>
      {children}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════
// 공통 헤더
// ══════════════════════════════════════════════════════════════════
export function SubHeader({ title, onBack, right }) {
  return (
    <header className="flex items-center gap-3">
      {onBack && (
        <button type="button" aria-label="뒤로" onClick={onBack} className="-ml-2 w-10 h-10 flex items-center justify-center rounded-full">
          <ChevronLeft size={28} strokeWidth={2.4} style={{ color: P.navy }} />
        </button>
      )}
      <img src={brandIcon} alt="" style={{ width: 38, height: "auto", display: "block" }} />
      <h1 className="font-display flex-1 text-[1.625rem] font-bold" style={{ color: P.navyInk }}>{title}</h1>
      {right}
    </header>
  );
}

// ══════════════════════════════════════════════════════════════════
// 홈
// ══════════════════════════════════════════════════════════════════
function EntryCard({ icon, title, desc, onClick, badge }) {
  return (
    <button type="button" onClick={onClick} className="lift w-full text-left rounded-[26px] px-5 py-5 sm:px-7 sm:py-6 flex flex-col gap-3" style={{ background: "#fff", boxShadow: cardShadow }}>
      {badge && <span className="self-start text-sm font-medium px-3.5 py-1.5 rounded-full" style={{ background: P.pale, color: P.navy }}>{badge}</span>}
      <span className="flex items-center gap-4 sm:gap-6">
        <IconCircle size={80}>{icon}</IconCircle>
        <span className="flex-1 min-w-0">
          <span className="block font-display text-[1.375rem] sm:text-2xl font-bold" style={{ color: P.navyInk }}>{title}</span>
          <span className="block mt-1 text-[0.95rem] sm:text-base leading-relaxed" style={{ color: P.ink60 }}>{desc}</span>
        </span>
        <ChevronRight size={28} strokeWidth={2.2} style={{ color: P.navy, flexShrink: 0 }} />
      </span>
    </button>
  );
}

export function HomeScreen({ onGuide, onFood, onWeight }) {
  return (
    <div className="flex flex-col gap-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');`}</style>
      <header className="flex items-center justify-between">
        <img src={brandLogo} alt="다시, 채움" style={{ width: 168, height: "auto", display: "block" }} />
      </header>

      <section className="flex items-center justify-between gap-1 py-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[1.75rem] sm:text-[2.375rem] font-bold leading-[1.3]" style={{ color: P.navyInk }}>
            오늘의 몸 상태는<br />어떤가요?
          </h1>
          <p className="mt-3 text-[0.95rem] sm:text-lg leading-relaxed" style={{ color: P.ink60 }}>
            나에게 맞는 식사와 생활로<br />건강한 변화를 시작해요.
          </p>
        </div>
        <div className="relative flex-shrink-0 w-[164px] h-[156px] sm:w-[240px] sm:h-[224px]" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: P.pale, opacity: 0.75, borderRadius: "58% 42% 52% 48% / 46% 56% 44% 54%" }} />
          <img src={brandIcon} alt="" className="absolute" style={{ width: "50%", left: "0%", top: "26%" }} />
          <p
            className="absolute text-[0.95rem] sm:text-[1.35rem]"
            style={{ right: "-2%", top: "46%", fontFamily: "'Nanum Pen Script', cursive", color: P.sage, lineHeight: 1.15, transform: "rotate(-10deg)", whiteSpace: "nowrap" }}
          >
            더 건강한<br />나를 위해,<br />다시, 채움
          </p>
        </div>
      </section>

      <EntryCard badge="처음이라면 여기부터" icon={<IconGuide />} title="권고사항" desc="내 상태에 맞는 식사 가이드" onClick={onGuide} />
      <EntryCard icon={<IconFood />} title="식품 선택" desc="오늘 먹고 싶은 재료로 메뉴 찾기" onClick={onFood} />
      <EntryCard icon={<IconWeight />} title="체중 변화" desc="나의 감량 경과 확인" onClick={onWeight} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 권고사항 홈
// ══════════════════════════════════════════════════════════════════
const GUIDE_CARDS = [
  { id: "general", title: "일반적 권고사항", desc: "일상생활에서 지켜야 할 기본 수칙을 확인해요.", Icon: IconDoc, strip: "#E4E7F6", face: "#FFFFFF" },
  { id: "stage", title: "투약 단계", desc: "지금의 투약 단계에 맞는 정보를 확인해요.", Icon: IconPill, strip: "#DDEAF7", face: "#FFFFFF" },
  { id: "sideEffects", title: "부작용", desc: "발생할 수 있는 부작용과 대처 방법을 알아봐요.", Icon: IconShield, strip: "#FBE3E6", face: "#FFFBFB" },
  { id: "appetite", title: "식욕", desc: "오늘의 식욕 상태에 맞는 식사 팁을 확인해요.", Icon: IconFood, strip: "#DFF1E6", face: "#FFFFFF" },
];

export function GuideHomeScreen({ onBack, onOpen, headerRight }) {
  return (
    <div className="flex flex-col gap-5">
      <SubHeader title="권고사항" onBack={onBack} right={headerRight} />

      <section className="flex items-center justify-between gap-1 py-2">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.625rem] sm:text-[2.25rem] font-bold leading-[1.3]" style={{ color: P.navyInk }}>
            오늘의 상태에 맞춰<br />살펴볼게요
          </h2>
          <p className="mt-3 text-[0.95rem] sm:text-lg leading-relaxed" style={{ color: P.ink60 }}>
            지금 내 몸에 필요한 정보만<br />간단하게 확인해요.
          </p>
        </div>
        <span className="flex-shrink-0 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] rounded-full flex items-center justify-center" style={{ background: P.pale }} aria-hidden="true">
          <HeroClipboard size="78%" />
        </span>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {GUIDE_CARDS.map((c) => (
          <button key={c.id} type="button" onClick={() => onOpen(c.id)} className="lift text-left rounded-[24px] pt-2.5 flex" style={{ background: c.strip }}>
            <span className="flex-1 flex flex-col rounded-[22px] px-4 pt-5 pb-5 sm:px-6" style={{ background: c.face, boxShadow: cardShadow }}>
              <span className="self-center"><IconCircle size={84}><c.Icon size={56} /></IconCircle></span>
              <span className="mt-4 flex items-center justify-between gap-1">
                <span className="font-display text-lg sm:text-xl font-bold leading-snug" style={{ color: P.navyInk }}>{c.title}</span>
                <ChevronRight size={22} strokeWidth={2.4} style={{ color: P.navy, flexShrink: 0 }} />
              </span>
              <span className="mt-1.5 text-sm sm:text-[0.95rem] leading-relaxed" style={{ color: P.ink60 }}>{c.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 체중 변화 입력
// ══════════════════════════════════════════════════════════════════
export function Field({ label, required = false, error, children }) {
  return (
    <div>
      <p className="text-base font-bold mb-2.5" style={{ color: P.navyInk }}>
        {label}{required && <span className="ml-1" style={{ color: P.apricotDeep }}>*</span>}
      </p>
      {children}
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium" style={{ color: P.apricotDeep }}>
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function UnitInput({ value, onChange, placeholder, unit, invalid = false }) {
  return (
    <label
      className="unit-input flex items-center rounded-2xl px-5"
      style={{
        background: invalid ? "#FFFCFA" : "#fff",
        border: `1.5px solid ${invalid ? P.apricot : P.line}`,
        boxShadow: invalid ? `0 0 0 3px ${P.apricotPale}` : "none",
        transition: "border-color .15s, box-shadow .15s",
      }}
    >
      <input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className="flex-1 min-w-0 bg-transparent py-4 text-xl font-semibold"
        style={{ color: P.navyInk, border: "none", outline: "none", boxShadow: "none" }}
      />
      {invalid && <AlertCircle size={20} style={{ color: P.apricotDeep, marginRight: 10 }} aria-hidden="true" />}
      <span className="text-lg" style={{ color: P.ink40 }}>{unit}</span>
    </label>
  );
}

export function Segmented({ options, value, onChange, invalid = false }) {
  return (
    <div
      role="radiogroup"
      className="grid rounded-2xl p-1"
      style={{
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        background: invalid ? "#FFFCFA" : P.tint,
        border: `1.5px solid ${invalid ? P.apricot : "transparent"}`,
        boxShadow: invalid ? `0 0 0 3px ${P.apricotPale}` : "none",
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-invalid={invalid || undefined}
            onClick={() => onChange(o.value)}
            className="chip py-3 rounded-xl text-base font-semibold"
            style={{ background: on ? "#6F7AE6" : "transparent", color: on ? "#fff" : P.navyInk, boxShadow: on ? "0 6px 14px -8px rgba(80,90,210,.7)" : "none" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ValidationBanner() {
  return (
    <div
      role="alert"
      className="rounded-2xl px-5 py-4 flex items-start gap-3"
      style={{ background: P.apricotPale, border: `1px solid ${P.apricotLine}` }}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "#F8D8CB", color: P.apricotDeep }}
      >
        <AlertCircle size={21} aria-hidden="true" />
      </span>
      <div>
        <p className="font-bold" style={{ color: P.apricotDeep }}>입력하지 않은 항목이 있어요</p>
        <p className="mt-0.5 text-sm leading-relaxed" style={{ color: P.ink60 }}>
          강조된 항목을 입력하거나 선택해 주세요.
        </p>
      </div>
    </div>
  );
}

export function WeightInputScreen({ onBack, headerRight, children, hasValidationErrors, onSubmit }) {
  return (
    <div className="flex flex-col gap-4">
      <style>{`.unit-input:focus-within { border-color: ${P.sage} !important; box-shadow: 0 0 0 3px ${P.pale}; }`}</style>
      <SubHeader title="체중 변화" onBack={onBack} right={headerRight} />

      <section className="rounded-[26px] px-6 py-6 sm:px-8 flex items-center justify-between gap-1" style={{ background: P.pale }}>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.625rem] sm:text-[2.125rem] font-bold leading-[1.3]" style={{ color: P.navyInk }}>
            투약 정보 입력
          </h2>
          <p className="mt-3 text-[0.95rem] sm:text-lg leading-relaxed" style={{ color: P.ink60 }}>
            입력한 내용을 바탕으로<br />감량 경과를 확인해요.
          </p>
        </div>
        <span className="flex-shrink-0 w-[124px] h-[124px] sm:w-[180px] sm:h-[180px] rounded-full flex items-center justify-center" style={{ background: "#D8DBF6" }} aria-hidden="true">
          <HeroScale size="92%" />
        </span>
      </section>

      {hasValidationErrors && <ValidationBanner />}

      <div className="rounded-[26px] p-5 sm:p-7 flex flex-col gap-6" style={{ background: "#fff", border: `1px solid ${P.line}` }}>
        {children}
        <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3 text-sm leading-relaxed" style={{ background: "#F4F5FA", color: P.ink60 }}>
          <Info size={20} style={{ color: P.ink40, flexShrink: 0, marginTop: 1 }} />
          <p>이 계산 결과는 참고용이며, 개인의 건강 상태에 따라 차이가 있을 수 있어요. 정확한 상담은 전문가와 상의하세요.</p>
        </div>
      </div>

      <button type="button" onClick={onSubmit} className="chip w-full py-4 rounded-full text-lg font-semibold text-white" style={{ background: "#4A52B0" }}>
        감량 경과 보기
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 식품 선택 단계
// ══════════════════════════════════════════════════════════════════
export function ChoiceRow({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="chip w-full text-left rounded-2xl px-5 sm:px-6 py-5 flex items-center gap-3"
      style={{ background: active ? P.tint : "#fff", border: `1.5px solid ${active ? P.sage : P.line}` }}
    >
      <span className="flex-1 text-base" style={{ color: active ? P.navy : P.ink, fontWeight: active ? 700 : 500 }}>{label}</span>
      <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: active ? P.coral : "#fff", border: active ? "none" : "1.5px solid #C9CCE3" }}>
        {active && <Check size={17} color="#fff" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function FoodStepShell({ onReset, total, current, eyebrow, title, desc, children, footer }) {
  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-3 pb-5" style={{ borderBottom: `1px solid ${P.line}` }}>
        <img src={brandIcon} alt="" style={{ width: 34, height: "auto", display: "block" }} />
        <span className="font-display flex-1 text-xl font-bold" style={{ color: P.navyInk }}>식품 선택</span>
        <button type="button" onClick={onReset} className="text-sm" style={{ color: P.ink40 }}>처음으로</button>
      </header>

      <div className="flex gap-2 mt-8" aria-label={`${total}단계 중 ${current}단계`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={{ width: 52, height: 5, borderRadius: 999, background: i < current ? P.sage : P.pale, transition: "background .2s" }} />
        ))}
      </div>

      <p className="text-sm font-semibold mt-6" style={{ color: P.sage }}>{eyebrow}</p>
      <h2 className="font-display text-[1.625rem] sm:text-[2rem] font-semibold leading-snug mt-3" style={{ color: P.ink }}>{title}</h2>
      {desc && <p className="text-base leading-relaxed mt-3" style={{ color: P.ink60 }}>{desc}</p>}

      <div className="mt-7">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}

// 권고·결과 화면에서 재사용하는 표시 전용 컴포넌트

export function PageHead({ eyebrow, title, desc, tone = "sage" }) {
  const fg = tone === "blue" ? C.blueDeep : C.sageDeep;
  return (
    <div className="pt-1">
      {eyebrow && (
        <p className="font-mono text-xs tracking-widest mb-3" style={{ color: fg }}>{eyebrow}</p>
      )}
      <h2 className="font-display text-[1.625rem] md:text-[2rem] font-semibold leading-[1.35]" style={{ color: C.ink }}>{title}</h2>
      {desc && <p className="text-base leading-relaxed mt-3" style={{ color: C.ink60 }}>{desc}</p>}
      <div style={{ height: 1, background: C.line, marginTop: 22 }} />
    </div>
  );
}

// 투명 배경 가로형 로고(796×248)를 그대로 사용한다.
export function BrandLogo({ compact = false }) {
  return <img src={brandLogo} alt="다시, 채움" style={{ width: compact ? 142 : 280, height: "auto", display: "block", flexShrink: 0 }} />;
}

export function RichText({ text, strongColor = C.ink }) {
  return <>{text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: strongColor }}>{part}</strong> : <span key={i}>{part}</span>))}</>;
}

function inferredTone(text = "") {
  if (/피하|줄이|금지|거르|과도|극단|늦은 시간|고지방/.test(text)) return "avoid";
  if (/주의|위험|의료진|상담|증상|확인|결핍|탈수/.test(text)) return "care";
  return "good";
}

export function GuidePoint({ point }) {
  const p = typeof point === "string" ? { text: point, tone: inferredTone(point) } : { ...point, tone: point.tone || inferredTone(point.body || point.text) };
  const tone = TONE[p.tone];
  return (
    <li className="flex gap-3 text-base leading-relaxed">
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 h-fit mt-0.5" style={{ background: tone.bg, color: tone.fg }}>
        <tone.Icon size={12} aria-hidden="true" />{tone.label}
      </span>
      <span>
        {p.head && <strong className="block mb-1.5" style={{ color: tone.fg }}>{p.head}</strong>}
        <span style={{ color: p.head ? C.ink60 : C.ink }}><RichText text={p.body ?? p.text} strongColor={tone.fg} /></span>
      </span>
    </li>
  );
}
