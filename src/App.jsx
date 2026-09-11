import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ChevronLeft, Info, RotateCcw, ChevronDown, ChevronUp, Shuffle, Sparkles, AlertCircle } from "lucide-react";
import { MENUS as RAW_MENUS, SUBS as RAW_SUBS, RICE as RAW_RICE, SAUCES as RAW_SAUCES, FOODS as RAW_FOODS } from "./menuData";

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
  blueDeep: "#4E6A7D",
};

// ══════════════════════════════════════════════════════════════════
// 권고사항 (변경 없음)
// ══════════════════════════════════════════════════════════════════
const GUIDE_DATA = {
  general: {
    title: "일반적 권고사항",
    menuNote: "선택 없이 전체 내용 보기",
  },
  stage: {
    title: "Stage",
    question: "다음 중 자신에게 해당하는 투여 Stage를 선택해주세요",
    options: [
      { id: "stage1", label: "Stage 1: 약물 증량기", description: "현재 GLP-1 비만치료제를 투여 중이며, 시작 용량 또는 증량 과정에 있음" },
      { id: "stage2", label: "Stage 2: 약물 용량 유지기", description: "현재 GLP-1 비만치료제를 투여 중이며, 의료진이 권장하는 목표 유지 용량에 도달함" },
      { id: "stage3", label: "Stage 3: 투여 중단 및 완료기", description: "GLP-1 비만치료제 사용 중 부작용·불편감으로 잠시 투여를 중단했거나, 목표 체중을 달성하여 투여를 완전히 마침" },
    ],
    recommendations: {
      stage1: {
        title: "Stage 1: 약물 증량기",
        goal: "위장관 장애 완화와 탈수 및 영양 부족 예방",
        points: [
          "처음 투여를 시작하거나 용량을 늘릴 때는 메스꺼움, 구토, 설사, 변비, 복통 등의 위장관 장애가 흔하게 나타날 수 있으나, 대개 시간이 지나며 증상이 완화돼요.",
          "한 끼에 무리해서 많이 먹기보다는 소량을 규칙적으로 드세요.",
          "전체 식사량이 줄어드는 만큼 근육 손실을 막기 위해 달걀, 두부, 살코기 등 단백질 식품을 우선적으로 드세요.",
          "구토나 설사를 할 때는 탈수를 예방하기 위해 수분을 충분히 보충하세요.",
          "섬유질이 많은 채소나 과일을 한 번에 많이 먹을 경우 복부 팽만감이나 더부룩함이 심해질 수 있으니 주의하세요.",
          "위장관 장애가 심하다면 기름진 튀김류 음식과 자극적인 음식을 피하세요.",
        ],
      },
      stage2: {
        title: "Stage 2: 약물 용량 유지기",
        goal: "충분한 영양소 섭취와 근육·골량 유지, 지속 가능한 식사 습관 형성",
        points: [
          "약물 용량 유지기에 들어서면 위장관 장애는 평균적으로 점차 감소하지만, 식욕 저하와 적은 식사량은 지속될 수 있어요.",
          "식사량이 줄어든 상태가 지속되면 철, 칼슘, 마그네슘, 아연, 비타민 A·D·E·K·B1·B12·C 결핍 위험이 커질 수 있어요.",
          "근육량 유지를 위해 끼니마다 단백질 식품을 지속적으로 챙겨 드세요. 다만, 단백질 섭취만으로 근육량을 유지하기는 어려우므로 근력 운동도 병행하세요.",
        ],
      },
      stage3: {
        title: "Stage 3: 투여 중단 및 완료기",
        goal: "식욕과 식사량의 반등에 대비하고, 체중 재증가(요요 현상)를 막을 수 있는 식사 습관 유지",
        points: [
          "약물 증량기(Stage 1)의 낮은 식사량을 유지하는 것이 아닌, 현재 체중·활동량·체중 변화에 따라 식사량을 재설정하세요.",
          "식욕이 돌아왔을 때 무조건 참거나 굶기보다는 규칙적인 식사 시간, 아침 식사 챙겨 먹기, 가공식품 섭취 줄이기 등의 건강한 식습관을 유지하세요.",
          "지나친 통제로 인한 폭식을 막기 위해 정제 탄수화물, 가당 음료, 초가공식품을 완전히 금지하기보다는 소량으로 드세요.",
        ],
      },
    },
  },
  sideEffects: {
    title: "부작용",
    question: "다음 중 자신에게 해당하는 부작용을 선택해주세요",
    note: "심혈관계 이상(빈맥·저혈압), 전신 장애 및 투여 부위 병태(피로·근육통·주사 부위 반응), 면역계 장애(과민반응), 눈 장애(제2형 당뇨병 환자에서의 당뇨병성 망막병증) 등은 식이요법과 무관하므로 이 항목에서 다루지 않아요. 관련 증상이 있다면 즉시 의료진과 상담하세요.",
    options: [
      { id: "nausea", label: "오심", description: "속이 울렁거리거나 토할 것 같은 느낌이 있나요? 음식 냄새만으로 메스꺼운 경우도 포함돼요." },
      { id: "vomiting", label: "구토", description: "음식물이나 물을 실제로 토했나요?" },
      { id: "diarrhea", label: "설사", description: "대변이 진흙처럼 묽거나 물 형태로 자주 나오나요? 하루 3회 이상이거나 평소보다 횟수가 뚜렷이 증가한 경우도 포함돼요." },
      { id: "constipation", label: "변비", description: "대변이 토끼똥처럼 딱딱하게 굳어 있어 배변 시 힘을 많이 주어야 하나요? 주 3회 미만이거나 배변 후 잔변감이 남는 경우도 포함돼요." },
      { id: "pancreatitis", label: "급성 췌장염", description: "상복부에서 서서히 또는 갑자기 복부 통증이 시작되어 등까지 통증이 퍼지거나 길게 지속되나요? 지속적인 메스꺼움과 구토, 식은땀이나 음식을 먹기 어려울 정도의 복통이 나타나나요?" },
      { id: "gallstone", label: "급성 담낭 질환(담석증)", description: "수 시간 동안 윗배 통증이 나타나고 통증이 등까지 퍼지나요? 피부나 눈 흰자위가 노랗게 변하는 황달이나 진한 소변, 발열 또는 오한이 나타나나요?" },
      { id: "abdominal", label: "복통·소화불량·복부 팽창·트림·가스 참 등", description: "식후 더부룩함, 잦은 트림, 복부 팽만감 또는 지나치게 가스가 차는 등 불편함이 있나요?" },
      { id: "headache", label: "두통 및 어지럼증", description: "지속적인 두통이 있나요?" },
      { id: "hypoglycemia", label: "저혈당증", description: "식은땀, 떨림, 두근거림, 갑작스러운 허기, 어지럼증, 혼란, 시야 흐림 등이 있나요?" },
      { id: "hairLoss", label: "탈모·모발 소실", description: "머리를 감거나 빗을 때 평소보다 머리카락이 많이 빠지나요?" },
      { id: "other", label: "기타", description: "위 문항에 해당하지 않는 다른 증상이 있어요." },
    ],
    recommendations: {
      nausea: [
        "식사를 완전히 거르기보다는 한 번에 먹는 양을 줄여보세요. 아침에 소량으로 시작하고 조금씩 규칙적으로 나누어 식사하는 방법이 도움이 될 수 있어요.",
        "수분은 한 번에 많이 마시기보다 조금씩 자주 보충하세요.",
        "증상이 심한 며칠 동안은 튀김 같은 기름진 고지방 음식과 과일이나 채소 같은 고식이섬유 식품은 적게 섭취하고, 담백하고 부드러운 식사를 선택하세요.",
      ],
      vomiting: [
        "탈수의 위험이 있으므로 수분 섭취가 중요해요. 미온수를 소량씩 자주 마셔주세요.",
        "소량의 담백하고 저지방인 식사부터 여러 번에 나누어 섭취하세요. 많은 양의 식사는 구토를 유발할 수 있으므로 '배가 부르기 전 멈추기'를 실천하세요.",
      ],
      diarrhea: [
        "설사로 인한 탈수의 위험이 있으므로 수분과 전해질 보충을 우선하세요. 물, 맑은 국물 등 본인에게 잘 맞는 음료를 조금씩 자주 드세요.",
        "기름진 식사나 한 번에 많은 양을 먹는 것은 피하고, 증상이 가라앉을 때까지 소량의 저지방 식사를 하세요.",
      ],
      constipation: [
        "변비가 있다면 수분 섭취를 충분히 하고 있는지 먼저 확인하세요.",
        "채소, 통곡물, 콩류 등 식이섬유가 많은 식품을 갑자기 많이 먹기보다, 본인에게 맞는 양부터 천천히 늘려보세요.",
        "단백질은 체중 감량 중 중요한 영양소이지만, 고단백·고지방 식품을 과하게 먹었을 때 변비가 더 심해지는 경우도 있어요. 이 경우에는 단백질 식품을 완전히 빼기보다는 저지방·수분 있는 조리법으로 바꾸어 섬유소와 수분을 함께 보충하세요.",
      ],
      pancreatitis: [
        "체중이 급격하게 감소하면 담즙으로 배출되는 콜레스테롤이 증가해 담석이 발생해 췌장염으로 이어질 수 있으므로 과도한 장시간 금식이나 극단적인 저열량 식단은 피해야 해요.",
        "오른쪽 윗배 통증이 장시간 지속되면 즉시 의료진을 찾아 진료를 받으세요.",
      ],
      gallstone: [
        "체중이 급격하게 감소하면 담즙으로 배출되는 콜레스테롤이 증가해 담석이 발생하므로 과도한 장시간 금식이나 극단적인 저열량 식단은 피해야 해요.",
        "통증이 장시간 지속되면 즉시 의료진을 찾아 진료를 받으세요.",
      ],
      abdominal: [
        "기름진 음식과 많은 양의 식사를 피해주세요.",
        "늦은 시간의 과식과 음주는 속 불편함을 악화시킬 수 있으므로 피하는 것이 좋습니다. 증상이 있는 동안에는 저지방 식품을 소량씩 부드럽게 먹도록 하세요.",
      ],
      headache: [
        "증상이 계속되거나 심해지면 단순한 일시적 현상으로 넘기지 않고, 전반적인 영양 섭취 상태와 다른 건강상 원인을 함께 확인하세요.",
        "탈수를 막기 위해 미온수를 조금씩 자주 나누어 마시고, 긴 공복으로 인한 저혈당을 방지하도록 소량씩 규칙적인 식사를 유지하세요.",
        "부족한 영양 섭취가 원인일 수 있으니 어육류·과일·채소·유제품 또는 영양 보충 음료 등 영양밀도가 높은 식품을 드세요.",
      ],
      hypoglycemia: [
        "저혈당 증상이 나타나면 빠르게 흡수되는 단순 당질(탄수화물) 15g을 즉시 섭취하세요. 주스, 일반 탄산음료, 사탕, 설탕 1큰술 등이 적합해요.",
        "초콜릿이나 땅콩버터처럼 지방이나 단백질이 많은 식품은 당의 흡수를 늦추므로 응급 처치용으로 피해주세요.",
        "인슐린이나 설포닐우레아 계열 당뇨약을 함께 사용하는 경우 저혈당 발생 위험이 특히 높아요. GLP-1 비만치료제 투여 시작 시 기존 약물의 감량이 필요할 수 있으므로, 반드시 담당 의료진과 상의하세요.",
      ],
      hairLoss: [
        "약물 투여 중 식사량이 줄어 체중이 20% 이상 급격히 줄어들면 철분, 아연, 필수 비타민군(A·D·E·K, B, C) 등의 결핍 위험이 커지며, 탈모는 이러한 영양 부족을 알리는 신호일 수 있어요.",
        "탈모 증상이 나타난다면 조급한 마음에 식사량을 더 줄이지 마시고, 최소한의 적정 열량과 단백질 섭취를 최우선으로 확보하세요.",
        "먹는 양이 적더라도 달걀, 두부, 육류 등 양질의 단백질과 채소, 과일, 유제품 또는 영양 보충 음료처럼 영양 밀도가 높은 식품을 골고루 챙겨 드시는 것이 중요해요.",
        "탈모 개선만을 목적으로 비오틴, 철분, 아연 등의 영양제를 무작정 복용하기보다는 혈액검사를 통해 결핍 여부를 확인하고 의료진과 상담 후 복용을 결정하세요.",
      ],
      other: ["목록에 없는 증상이라면 스스로 판단하기보다 담당 의료진 또는 약사와 상의해 주세요."],
    },
  },
  appetite: {
    title: "식욕",
    question: "오늘 식욕과 식사 컨디션은 어떤가요?",
    options: [
      { id: "none", label: "입맛이 거의 없고 음식을 먹는 것이 부담스러워요" },
      { id: "moderate", label: "식욕이 적당하고 소식으로도 만족스럽게 식사할 수 있어요" },
      { id: "high", label: "배고픔이 심하게 몰려오거나 단 음식·야식·간식 생각이 계속 맴돌아요" },
    ],
    recommendations: {
      none: {
        title: "입맛이 거의 없고 음식을 먹는 것이 부담스러울 때",
        points: [
          { head: "적은 양을 3~4시간 간격으로 나누어 드세요", body: "한 번에 평균 식사량을 섭취하려 하지 말고, 3~4시간 간격으로 소량 분할 섭취하며 냄새가 강하거나 기름진 조리법은 피하세요." },
          { head: "미온수의 물을 조금씩 자주 마셔 체액을 보충하세요", body: "식사량이 급감할 때 수분 섭취가 줄면 탈수로 인한 급성 신손상 위험이 커지므로, 하루 종일 물을 나누어 마셔 탈수를 우선 예방해야 해요." },
          { head: "고형식 대신 부드러운 단백질 연식, 유동식을 활용하세요", body: "씹어 삼키기 힘든 고형식 대신 고단백 쉐이크, 스무디, 맑은 단백질 수프, 계란찜 등을 활용하여 근육 손실과 영양 결핍을 방지하세요." },
        ],
      },
      moderate: {
        title: "식욕이 적당하고 소식으로도 만족스럽게 식사할 수 있을 때",
        points: [
          { head: "식사할 때 단백질을 먼저 챙기세요", body: "조기 포만감이 느껴질 수 있으므로 생선, 달걀, 콩류, 유제품, 살코기 등 단백질 식품을 먼저 선택하세요." },
          { head: "영양 밀도 높은 식품을 골고루 선택하세요", body: "과일, 채소, 통곡물, 콩류, 견과류 등 덜 가공된 식품을 중심으로 식사해 보세요. 단 음료, 정제 탄수화물, 패스트푸드, 가공 간식은 먹는 횟수를 줄여 보세요." },
          { head: "천천히 드시고, 포만감을 확인하세요", body: "한 번에 많은 식사보다 천천히 소량으로 드세요. 포만감이 느껴지면 더 먹기보다 다음 식사로 넘겨 보세요." },
        ],
      },
      high: {
        title: "배고픔이 심하게 몰려오거나 단 음식·야식·간식 생각이 계속 맴돌 때",
        points: [
          { head: "물 한 컵을 천천히 마시고 15분간 기다려보세요", body: "갈증이나 감정적 스트레스로 인한 가짜 배고픔(Food Noise)일 수 있으므로, 물을 천천히 마시며 진짜 허기인지 먼저 점검하세요." },
          { head: "초가공식품 대신 고단백·고식이섬유 간식을 선택하세요", body: "배달음식이나 과자 대신 삶은 달걀, 그릭 요거트, 풋콩, 견과류 한 줌, 방울토마토·오이 등을 먼저 섭취해 음식 갈망을 잠재우세요." },
          { head: "장시간 공복으로 인한 보상성 폭식을 주의하세요", body: "오랜 시간 식사를 거르면 강한 폭식이 발생하기 쉬우므로, 끼니를 거르지 말고 규칙적으로 적정량의 식사를 유지하세요." },
        ],
      },
    },
  },
};

const GUIDE_MENU = ["general", "stage", "sideEffects", "appetite"];

const GENERAL_GUIDE = [
  {
    id: "assessment",
    icon: "🩺",
    title: "치료 전 영양 및 건강 상태 평가",
    summary: "시작 전에 확인할 것",
    blocks: [{ type: "point", text: "치료 시작 전에는 식사 패턴, 동반질환, 복용 약물 및 영양 상태를 의료진과 함께 확인하세요. 필요 시 개인의 건강 상태에 맞는 영양 평가를 시행하세요." }],
  },
  {
    id: "food",
    icon: "🥗",
    title: "식품 선택, 식습관",
    summary: "무엇을, 어떻게 먹을까",
    blocks: [
      { type: "point", text: "GLP-1 치료 중에는 영양 밀도가 높은 식품을 중심으로 식사하고, 정제 탄수화물·당류 첨가 음료·초가공식품의 섭취는 줄이는 것이 좋아요. 자세한 식품 선택은 아래 표를 참고하세요." },
      {
        type: "table",
        good: [
          "과일(예: 베리류, 사과, 감귤류, 바나나, 포도, 아보카도)",
          "채소(예: 브로콜리, 잎채소, 토마토, 당근, 완두콩, 호박류)",
          "통곡물(예: 귀리, 퀴노아, 현미, 통곡물 빵·시리얼·파스타)",
          "유제품(예: 요거트, 우유, 치즈)",
          "저지방 단백질 식품(예: 가금류, 생선·해산물), 달걀",
          "견과류·씨앗류(예: 아몬드, 땅콩, 치아시드, 참깨, 햄프시드)",
          "식물성 지방·오일(예: 올리브유, 카놀라유, 아보카도유)",
          "생강차 또는 페퍼민트차",
        ],
        avoid: ["정제 탄수화물(정제 곡물, 밀가루, 첨가당)", "당류 첨가 음료", "붉은 고기 및 가공육", "대부분의 패스트푸드", "단 음식 및 짭짤한 스낵류"],
      },
      { type: "point", text: "GLP-1 치료 중에는 식사량 감소로 단백질 섭취가 부족해질 수 있으므로, 매 끼니 단백질 식품을 우선적으로 포함하는 것이 중요해요." },
      { type: "point", text: "규칙적인 식사와 충분한 수분 섭취를 유지하고, 장시간 식사를 거르거나 한 번에 많은 양을 섭취하는 습관은 피하세요. 자세한 식습관은 아래 표를 참고하세요." },
      {
        type: "table",
        good: ["일정한 시간에 소량씩 규칙적으로 식사하기", "식품 선택지를 지나치게 제한하지 않기", "간식이나 디저트는 적정량으로 즐기기", "충분한 수분 섭취", "음주는 최소화하기"],
        avoid: ["감정적 식사, 무의식적 식사 또는 야식", "장시간 식사를 거르기(지나치게 배고픈 상태가 되기)", "한 번에 많은 양을 먹는 식사"],
      },
      { type: "point", text: "체중감량만을 목표로 식사를 지나치게 제한하지 마세요. 치료 중에도 영양소를 충분히 섭취할 수 있는 균형 잡힌 식사와 지속 가능한 생활습관을 함께 유지하는 것이 중요해요." },
    ],
  },
  {
    id: "protein",
    icon: "🍗",
    title: "단백질 권장량",
    summary: "하루에 얼마나 필요할까",
    blocks: [
      { type: "point", text: "단백질 권장량은 연령, 신체활동 수준, 체중감량 속도 및 동반질환에 따라 달라져요." },
      { type: "point", text: "일반 성인의 단백질 권장섭취량은 0.8 g/kg/일이나, GLP-1 기반 체중감량 중에는 근육량 보존을 위해 1.2 g/kg/일 이상을 권장해요." },
    ],
  },
  {
    id: "leanmass",
    icon: "💪",
    title: "제지방량 보존",
    summary: "식사만으로는 부족해요",
    blocks: [
      { type: "point", text: "단백질 섭취량을 늘리더라도 근력운동이 동반되지 않으면 체중감량 중 제지방량을 충분히 보존하기 어려울 수 있어요." },
      { type: "point", text: "유산소 운동은 심폐·대사 건강에 도움이 되지만, 단독으로는 제지방량 보존 효과가 제한적이에요." },
      { type: "point", text: "주 3회 이상의 근력운동과 주 150분 이상의 중강도 유산소 운동을 목표로 하되, 개인의 체력과 건강 상태에 맞추어 조정해야 해요." },
    ],
  },
  {
    id: "micronutrients",
    icon: "🧬",
    title: "주요 미량영양소",
    summary: "부족해지기 쉬운 영양소",
    blocks: [{ type: "point", text: "식욕과 식사량이 줄어들면 비타민과 무기질 섭취가 부족해질 수 있어요. 특히 비타민 D, 엽산, 칼슘, 비타민 A·C·E, 칼륨, 티아민(B1), 철, 비타민 B12, 아연의 결핍에 유의하고, 해당 영양소가 풍부한 식품을 의식적으로 섭취하는 것이 중요해요." }],
  },
];

// ══════════════════════════════════════════════════════════════════
// 체중 변화 (변경 없음)
// ══════════════════════════════════════════════════════════════════
const WEIGHT_TABLES = {
  wegovy: {
    label: "위고비(세마글루타이드 2.4mg)",
    noDiabetes: {
      studyLabel: "STEP 1 (당뇨병 없음)",
      weeks: [0, 4, 8, 12, 16, 20, 28, 36, 44, 52, 60, 68],
      series: { "관찰 구간": [0, [2, 3], [4, 4.5], [6, 6.5], [7.5, 8.5], [9.5, 10.5], [12, 12.5], [13.5, 14.5], [14.5, 15.5], [16, 16.5], [16, 17], 16.9] },
    },
    diabetes: {
      studyLabel: "STEP 2 (당뇨병 있음)",
      weeks: [0, 4, 8, 12, 16, 20, 28, 36, 44, 52, 60, 68],
      series: { "관찰 구간": [0, [1.5, 2], [3, 4], [4.5, 5.5], [6, 6.5], [7.5, 8], [8.5, 9.5], [9.5, 10], [10, 10.5], [10, 11], [10, 11], 10.7] },
    },
  },
  mounjaro: {
    label: "마운자로(티르제파타이드)",
    noDiabetes: {
      studyLabel: "SURMOUNT-1 (당뇨병 없음)",
      weeks: [0, 4, 8, 12, 16, 20, 24, 36, 48, 60, 72],
      series: {
        "5mg": [0, [3, 4], [5.5, 6.5], [7.5, 8.5], [8.5, 9.5], [10, 11], [11.5, 12], [13, 14], [14.5, 15.5], [15.5, 16], 16.0],
        "10mg": [0, [3, 4], [5.5, 6.5], [8, 9], [10.5, 11.5], [12.5, 13.5], [14, 15], [17, 18], [19, 20], [20.5, 21.5], 21.4],
        "15mg": [0, [3, 4], [5.5, 6.5], [8, 9], [10, 11], [12, 13], [14.5, 15.5], [18, 19], [20, 21], [21.5, 22.5], 22.5],
      },
    },
    diabetes: {
      studyLabel: "SURMOUNT-2 (당뇨병 있음)",
      weeks: [0, 4, 8, 12, 16, 20, 24, 36, 48, 60, 72],
      series: {
        "10mg": [0, [1.5, 2.5], [3.5, 4.5], [5.5, 6.5], [7.5, 8.5], [9, 10], [10, 10.5], [11.5, 12.5], [12, 13], [12.5, 13.5], 13.4],
        "15mg": [0, [2, 3], [4, 5], [6, 7], [8, 9], [9.5, 10.5], [11, 12], [13, 14], [14, 15], [15, 16], 15.7],
      },
    },
  },
};

const DRUG_SHORT = { wegovy: "위고비", mounjaro: "마운자로" };

const WEIGHT_STUDY_NOTES = {
  wegovy: {
    noDiabetes: "위 수치는 **당뇨병이 없는 성인**을 대상으로 한 세마글루타이드 2.4 mg(**위고비**)의 STEP 1 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
    diabetes: "위 수치는 **당뇨병이 있는 성인**을 대상으로 한 세마글루타이드 2.4 mg(**위고비**)의 STEP 2 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
  },
  mounjaro: {
    noDiabetes: "위 수치는 **당뇨병이 없는 성인**을 대상으로 한 티르제파타이드(**마운자로**)의 SURMOUNT-1 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
    diabetes: "위 수치는 **당뇨병이 있는 성인**을 대상으로 한 티르제파타이드(**마운자로**)의 SURMOUNT-2 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
  },
};

const WEIGHT_COMMON_NOTE = "제시된 수치는 개인별 목표치나 안전 상한선이 아닙니다. 각 임상시험에서 시험약을 지속적으로 사용한 조건에서 관찰·추정된 평균적 누적 체중감량 경과를 참고하기 위한 값으로 해석해야 합니다.";

const WEIGHT_FIGURE_META = {
  wegovy: {
    noDiabetes: { figureNo: "Figure 1", tableNo: "Table 1", panel: "STEP 1 연구 B 패널", drug: "Semaglutide 2.4 mg", who: "제2형 당뇨병이 없는 성인", source: "Wilding et al. (2021)의 체중변화 그래프를 바탕으로 추정·재구성함." },
    diabetes: { figureNo: "Figure 2", tableNo: "Table 2", panel: "STEP 2 연구 B 패널", drug: "Semaglutide 2.4 mg", who: "제2형 당뇨병이 있는 성인", source: "Davies et al. (2021)의 체중변화 그래프를 바탕으로 추정·재구성함." },
  },
  mounjaro: {
    noDiabetes: { figureNo: "Figure 3", tableNo: "Table 3", panel: "SURMOUNT-1 연구 B 패널", drug: "Tirzepatide", who: "제2형 당뇨병이 없는 성인", source: "Jastreboff et al. (2022)의 체중변화 그래프를 바탕으로 추정·재구성함." },
    diabetes: { figureNo: "Figure 4", tableNo: "Table 4", panel: "SURMOUNT-2 연구 B 패널", drug: "Tirzepatide", who: "제2형 당뇨병이 있는 성인", source: "Garvey et al. (2023)의 체중변화 그래프를 바탕으로 추정·재구성함." },
  },
};

// ══════════════════════════════════════════════════════════════════
// 1인 1회 분량 참고표 (변경 없음)
// ══════════════════════════════════════════════════════════════════
const PORTION_IMAGE_KEYS = ["grain_rice", "grain_noodle", "grain_bread", "protein_beef", "protein_pork", "protein_mackerel", "veg_sprout", "veg_spinach", "veg_kimchi", "fruit_apple", "fruit_tangerine", "fruit_grape", "milk_milk", "milk_yogurt", "fat_oil", "fat_butter", "fat_mayo"];

const PORTION_IMAGES = Object.fromEntries(PORTION_IMAGE_KEYS.map((key) => [key, `${import.meta.env.BASE_URL}images/portion/${key}.jpg`]));

const PORTION_REFERENCE = {
  footnote: "*표시는 0.3회, †표시는 0.5회",
  source: "출처: 당뇨병 식품교환표 활용지침, 대한당뇨병학회, 2023",
  groups: [
    { name: "곡류군", icon: "🍚", items: [{ name: "쌀밥", amount: "70g", img: "grain_rice" }, { name: "국수(말린 것)", amount: "30g", img: "grain_noodle" }, { name: "식빵 1쪽*", amount: "35g", img: "grain_bread" }] },
    { name: "어육류군", icon: "🍗", items: [{ name: "쇠고기", amount: "생 40g", img: "protein_beef" }, { name: "돼지고기", amount: "생 40g", img: "protein_pork" }, { name: "고등어", amount: "생 50g", img: "protein_mackerel" }] },
    { name: "채소군", icon: "🥬", items: [{ name: "콩나물", amount: "생 70g", img: "veg_sprout" }, { name: "익힌 시금치", amount: "70g", img: "veg_spinach" }, { name: "배추김치", amount: "생 50g", img: "veg_kimchi" }] },
    { name: "과일군", icon: "🍎", items: [{ name: "사과", amount: "100g", img: "fruit_apple" }, { name: "귤", amount: "100g", img: "fruit_tangerine" }, { name: "포도", amount: "80g", img: "fruit_grape" }] },
    { name: "우유군", icon: "🥛", items: [{ name: "우유", amount: "200ml", img: "milk_milk" }, { name: "호상요구르트", amount: "100g", img: "milk_yogurt" }] },
    { name: "지방군", icon: "🫒", items: [{ name: "콩기름 1작은술", amount: "5g", img: "fat_oil" }, { name: "버터 1작은술", amount: "5g", img: "fat_butter" }, { name: "마요네즈", amount: "8g", img: "fat_mayo" }] },
  ],
};

const CALORIE_PATTERN = {
  title: "권장식사패턴(섭취횟수)",
  columns: ["곡류군", "어육류군", "채소군", "과일군", "우유군", "지방군"],
  rows: [
    { kcal: "1,200", values: ["5", "3", "6", "1", "1", "3"] },
    { kcal: "1,500", values: ["7", "3", "7", "1", "1", "4"] },
    { kcal: "1,800", values: ["8", "3", "7", "2", "2", "4"] },
  ],
  source: "출처: 당뇨병 식품교환표 활용지침, 대한당뇨병학회, 2023",
};

// ══════════════════════════════════════════════════════════════════
// 새 5문항 (2026-09 개정)
// 배열 인덱스 0 = 선택지 1번. DB의 비트문자열과 자리수가 1:1로 대응한다.
// ══════════════════════════════════════════════════════════════════
const Q1_TEXTURE = ["치아로 씹어 먹고 싶어요", "혀와 입천장으로 쉽게 으깰 수 있는 느낌이 좋아요", "1,2번 다 별로예요"];
const Q2_FORM = ["마시는 것이 좋아요", "쉽게 떠먹는 것이 좋아요", "핑거푸드가 좋아요", "혼합형 한그릇(덮밥, 비빔밥, 포케)이 좋아요", "반찬을 포함한 일반식이 좋아요"];
const Q3_SMELL = ["수산물의 비린내는 피하고 싶어요", "고기의 누린내는 피하고 싶어요", "발효·숙성 향(쿰쿰함)은 피하고 싶어요", "마늘·양파 등 향신료 향은 피하고 싶어요", "오이·수박 향은 피하고 싶어요"];
const Q4_SEASONING = ["재료 본연의 맛을 즐길래요", "담백하고 삼삼하게 먹고 싶어요", "양념이 필요해요"];
const Q5_COOKTIME = ["바로 먹을래요", "데우기만 하고 먹을래요", "15분 이내로 조리해서 먹을래요", "조리할 시간이 충분해요"];

// [정민 파트] 엑셀에 담기지 않아 코드로 처리하는 부분 ①
// Q3-5(오이·수박 향)를 고른 사용자에게는, 메뉴명에 오이가 없더라도(예: 비빔밥)
// 재료 목록에 오이가 들어간 메뉴가 있으므로 식품 목록에서 해당 식품을 숨긴다.
// 다른 회피 항목은 메뉴 단위 Q3 코딩으로 이미 걸러지므로 비워 둔다.
const Q3_HIDE_FOODS = { 1: [], 2: [], 3: [], 4: [], 5: ["오이", "수박"] };

// [채민 파트] "이렇게도 먹어볼 수 있어요" 존에 추가로 띄울 식품
//  · Q1=2(혀·입천장으로 으깨기) → "식품군별 플랫폼 추천 식재료" 표의 빨간 글씨 식품
//  · Q1=3(둘 다 별로)          → 달걀, 두부 + 필수영양소 보유 식품(ESSENTIAL_FOODS)
const EXTRA_FOODS_BY_Q1 = {
  1: [],
  2: ["백미", "고구마", "달걀", "두부", "굴", "게", "단호박", "무"],
  3: ["달걀", "두부"],
};

// 화면에서만 감출 선택지. DB는 건드리지 않으므로, 여기서 막은 조합의 메뉴도
// 다른 경로로 들어오면 결과에는 정상적으로 나온다.
//  · Q1=2에서 Q2=1(마시는 형태)  — 계란 수프 1개만 걸려 있어 선택지로 띄우지 않는다
//  · Q1=3 & Q2=2에서 Q4=3(양념 필요) — 메뉴 1개만 걸려 있어 선택지로 띄우지 않는다
const OPTION_HIDE = [
  { when: { q1Idx: 2 }, hide: { q2: [1] } },
  { when: { q1Idx: 3, q2Idx: 2 }, hide: { q4: [3] } },
];

function hiddenOptions(a, key) {
  const out = new Set();
  OPTION_HIDE.forEach((rule) => {
    if (!Object.entries(rule.when).every(([k, v]) => a[k] === v)) return;
    (rule.hide[key] || []).forEach((v) => out.add(v));
  });
  return out;
}

const COOK_LABEL = ["바로 먹기", "데우기만", "15분 이내", "충분히 조리"];

// ══════════════════════════════════════════════════════════════════
// DB 원본 배열 → 객체
// ══════════════════════════════════════════════════════════════════
const bit = (bits, n) => bits[n - 1] === "1";
const uniq = (arr) => [...new Set(arr)];

const ROLE_LABEL = { 1: "주재료 1", 2: "주재료 2", C: "탄수화물", V: "채소", D: "유제품", F: "과일", N: "지방·견과" };
const ROLE_ORDER = ["1", "2", "C", "V", "D", "F", "N"];

const MENUS = RAW_MENUS.map(([id, name, formId, formName, q1, q2, q3, q4, q5, ing, sauceIds]) => ({
  id, name, formId, formName, q1, q2, q3, q4, q5, ing, sauceIds,
}));

// q3ing = 수산물비린내 / 고기누린내 / 오이향 3자리. 발효향·마늘향은 양념으로 판정한다.
const SUBS = RAW_SUBS.map(([id, formId, formName, name, q3ing, ing, sauceIds]) => ({
  id, formId, formName, name, q3ing, ing, sauceIds,
}));

const RICE_BASES = RAW_RICE.map(([id, name, primary, keys]) => ({ id, name, primary, keys: uniq([...primary, ...keys]) }));

const SAUCES = Object.fromEntries(
  RAW_SAUCES.map(([id, name, parts, c3, c4, q4]) => [id, { id, name, parts, c3, c4, q4 }])
);

const FOOD_GROUP = Object.fromEntries(RAW_FOODS.map(([name, group]) => [name, group]));
const FOOD_GROUP_ORDER = ["곡류", "고기·생선·달걀·콩류", "채소류", "과일류", "우유·유제품류", "유지·당류"];

// 상차림(typeB) 구성 규칙. typeB_DB 98,455행은 이 규칙으로 그대로 재생성된다.
const TABLE_SETTINGS = [
  { id: "F07", label: "국·탕 한상", mainRoleLabel: "국·탕", mainForms: ["G01", "G02", "G03"], sideForms: ["B01", "B02", "B03"] },
  { id: "F08", label: "찌개·전골 한상", mainRoleLabel: "찌개·전골", mainForms: ["J01", "J02"], sideForms: ["B01", "B02", "B03"] },
  { id: "F09", label: "일반식(밥+주찬+부찬)", mainRoleLabel: "주찬", mainForms: ["M01", "M02", "M03", "M04"], sideForms: ["B01", "B02", "B03"] },
];

// ══════════════════════════════════════════════════════════════════
// 영양 표시 / 주의 문구
// ══════════════════════════════════════════════════════════════════
const VITAMIN_META = {
  D: { label: "비타민 D", color: "#C4863F", shape: "●" },
  B1: { label: "비타민 B1", color: "#5E7FA6", shape: "◆" },
  B12: { label: "비타민 B12", color: "#8B6BA8", shape: "▲" },
  folate: { label: "엽산", color: "#4C8A5E", shape: "■" },
  iron: { label: "철", color: "#B24A3A", shape: "★" },
  zinc: { label: "아연", color: "#2E8C86", shape: "⬢" },
};

const FOOD_NUTRIENTS = {
  연어: ["D", "B12"], 고등어: ["D", "B12"], 등푸른생선: ["D", "B12"], 꽁치: ["D", "B12"], 달걀: ["D"], 건표고버섯: ["D"],
  현미: ["B1"], 귀리: ["B1"], 검정콩: ["B1"], 해바라기씨: ["B1"],
  바지락: ["B12", "iron"], 굴: ["B12", "zinc"], 조기: ["B12"],
  렌틸콩: ["folate", "iron"], 시금치: ["folate", "iron"], 브로콜리: ["folate"], 콩나물: ["folate"], 콜리플라워: ["folate"],
  두부: ["iron"], 멸치: ["iron"], 병아리콩: ["zinc"], 게: ["zinc"], 새우: ["zinc"], 호박씨: ["zinc"],
};

const ESSENTIAL_FOODS = ["현미", "귀리", "두부", "달걀", "건표고버섯", "시금치", "딸기", "블루베리", "저지방 우유", "무가당 플레인 요거트", "해바라기씨", "호박씨"];

const FOOD_CAUTIONS = [
  { foods: ["백미"], text: "통곡물보다 식이섬유·미량영양소가 적어 평상시 우선 선택으로 권장하지는 않지만, 투여 초기·증량기이거나 오심·복부팽만·설사가 있는 시기에는 자극이 적어 활용할 수 있어요." },
  { foods: ["렌틸콩", "검정콩", "병아리콩"], text: "영양밀도가 높지만 대장에서 가스를 만들어 복부팽만을 유발할 수 있어요. 투여 초기나 팽만감이 있을 때는 소량부터 드세요." },
  { foods: ["연어", "고등어", "등푸른생선", "꽁치"], text: "흰살생선보다 지방이 많아 오심·설사·역류가 심할 때는 부담이 될 수 있어요. 그럴 땐 대구 등 흰살생선으로 잠시 바꿔보세요." },
  { foods: ["브로콜리", "양배추", "케일", "콜리플라워", "배추"], text: "영양적으로 우수하지만 일부에서는 장내 발효로 가스와 복부팽만을 일으킬 수 있어요." },
  { foods: ["토마토"], text: "속쓰림·역류 증상을 악화시킬 수 있어요. 속쓰림이 심하면 피하는 편이 좋아요." },
  { foods: ["귤", "오렌지"], text: "산미가 속쓰림이나 역류를 유발할 수 있어요." },
  { foods: ["사과", "배", "키위"], text: "설사가 지속되는 동안에는 권하지 않아요." },
  { foods: ["아마씨", "치아씨"], text: "변비가 있을 때 도움이 될 수 있어요." },
  { foods: ["저지방 우유", "무가당 플레인 요거트", "코티지치즈"], text: "유당불내증이 있거나 설사 중이라면 락토프리 제품으로 대체하세요." },
  { foods: ["오트밀", "통밀빵", "통밀파스타"], text: "가당 제품·첨가당이 많은 제품은 피하고 무가당·저나트륨 제품으로 고르세요." },
];

// ══════════════════════════════════════════════════════════════════
// 추천 엔진
// ══════════════════════════════════════════════════════════════════

// [정민 파트 ②] Q3-3(발효·숙성 향) → S010·S011 제외
//               Q3-4(마늘·양파 향) → S005·S011·S013 제외
// 02_양념DB의 충돌 열이 위 목록과 정확히 일치하므로 그 열을 그대로 쓴다.
function sauceAllowedBySmell(s, smellIdx) {
  if (smellIdx.includes(3) && s.c3 === 1) return false;
  if (smellIdx.includes(4) && s.c4 === 1) return false;
  return true;
}

function usableSauces(sauceIds, smellIdx) {
  return (sauceIds || []).map((id) => SAUCES[id]).filter(Boolean).filter((s) => sauceAllowedBySmell(s, smellIdx));
}

// 결과 화면에 띄울 양념. 간·풍미(Q4)에 맞는 것을 우선 보여주되,
// 하나도 없으면 향 조건만 통과한 양념을 그대로 보여준다.
// (typeA의 Q4 코딩은 양념에서 기계적으로 유도된 값이 아니라 메뉴 단위 수작업 값이라,
//  양념 Q4로 한 번 더 거르면 표시할 양념이 사라지는 메뉴가 생긴다)
function displaySauces(sauceIds, smellIdx, seasonIdx) {
  const base = usableSauces(sauceIds, smellIdx);
  if (seasonIdx.length === 0) return base;
  const narrowed = base.filter((s) => seasonIdx.some((i) => bit(s.q4, i)));
  return narrowed.length > 0 ? narrowed : base;
}

// typeA 메뉴 통과 판정.
//  Q1·Q2·Q5 = 단일선택이라 해당 비트가 1이어야 한다
//  Q3 = 복수선택 AND (고른 회피 조건을 모두 만족해야 함)
//  Q4 = 복수선택 OR  (고른 간·풍미 중 하나라도 되면 통과)
function passesMenu(m, a) {
  if (a.q1Idx && !bit(m.q1, a.q1Idx)) return false;
  if (a.q2Idx && !bit(m.q2, a.q2Idx)) return false;
  if (!a.smellIdx.every((i) => bit(m.q3, i))) return false;
  if (a.seasonIdx.length > 0 && !a.seasonIdx.some((i) => bit(m.q4, i))) return false;
  if (a.q5Idx && !bit(m.q5, a.q5Idx)) return false;
  // 향 조건을 모두 만족하는 양념이 실제로 한 개는 남아야 한다.
  // (Q3_3은 A양념으로, Q3_4는 B양념으로 각각 통과하지만 둘을 동시에 만족하는
  //  양념은 없는 메뉴가 있어서, 메뉴 비트만으로는 걸러지지 않는다)
  return usableSauces(m.sauceIds, a.smellIdx).length > 0;
}

// ── 상차림(typeB) 판정 ────────────────────────────────────────────
// Q3_1·Q3_2·Q3_5 : 구성요소의 식재료 플래그 AND
// Q3_3·Q3_4      : 사용 양념 전체가 비충돌 (AND)
// Q4_1 재료본연  : 모든 양념이 무양념(S001)
// Q4_2 담백삼삼  : S001을 뺀 나머지가 1개 이상이고 전부 담백
// Q4_3 양념필요  : 양념 중 하나라도 '양념필요'
// → 98,455행 전수 대조에서 100% 일치함을 확인
const Q3ING_SLOT = { 1: 1, 2: 2, 5: 3 };

function subPassesSmell(sub, smellIdx) {
  for (const i of smellIdx) {
    const slot = Q3ING_SLOT[i];
    if (slot && !bit(sub.q3ing, slot)) return false;
  }
  return usableSauces(sub.sauceIds, smellIdx).length > 0;
}

// 구성요소별로 쓸 수 있는 양념 목록이 주어졌을 때, 고른 간·풍미를 만족하는
// 양념 조합이 존재하는지 확인한다.
function seasoningFeasible(sauceSets, seasonIdx) {
  if (seasonIdx.length === 0) return sauceSets.every((L) => L.length > 0);
  return seasonIdx.some((opt) => {
    if (opt === 1) return sauceSets.every((L) => L.some((s) => s.id === "S001"));
    if (opt === 2) {
      const ok = sauceSets.every((L) => L.some((s) => s.id === "S001" || bit(s.q4, 2)));
      return ok && sauceSets.some((L) => L.some((s) => s.id !== "S001" && bit(s.q4, 2)));
    }
    return sauceSets.every((L) => L.length > 0) && sauceSets.some((L) => L.some((s) => bit(s.q4, 3)));
  });
}

// ── 주재료 규칙 (기존 유지) ──────────────────────────────────────
// 메뉴가 실제로 가진 주재료 칸만 대상으로, 각 칸에서 최소 1개가 선택돼야 한다.
function mainRoleSlots(item) {
  return ["1", "2"].filter((r) => item.ing.some((i) => i[1] === r));
}
function meetsMainRoles(item, selected) {
  return mainRoleSlots(item).every((role) => item.ing.some((i) => i[1] === role && selected.includes(i[0])));
}
function missingMainRoles(item, selected) {
  return mainRoleSlots(item).filter((role) => !item.ing.some((i) => i[1] === role && selected.includes(i[0])));
}
function mainFoodsOf(item) {
  return uniq(item.ing.filter((i) => i[1] === "1" || i[1] === "2").map((i) => i[0]));
}

function scoreMenu(item, selected) {
  const pick = (test) => uniq(item.ing.filter((i) => selected.includes(i[0]) && test(i[1])).map((i) => i[0]));
  const m1 = pick((r) => r === "1");
  const m2 = pick((r) => r === "2");
  return { matched: pick(() => true), m1Matched: m1, m2Matched: m2, mainMatched: uniq([...m1, ...m2]), vegMatched: pick((r) => r === "V"), etcMatched: pick((r) => !["1", "2", "V"].includes(r)) };
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

function rankItems(pool, selected, answers, passFn) {
  const seedKey = selected.join("|");
  const scored = pool
    .filter((m) => passFn(m, answers))
    .filter((m) => meetsMainRoles(m, selected))
    .map((m) => ({ ...m, s: scoreMenu(m, selected) }))
    .filter((m) => m.s.matched.length > 0);
  scored.sort(
    (a, b) =>
      b.s.mainMatched.length - a.s.mainMatched.length ||
      b.s.matched.length - a.s.matched.length ||
      b.s.vegMatched.length - a.s.vegMatched.length ||
      b.s.etcMatched.length - a.s.etcMatched.length ||
      hashStr(a.id + seedKey) - hashStr(b.id + seedKey)
  );
  return scored;
}

function pickTop(pool, selected, answers, count, passFn, usedFoods) {
  const ranked = rankItems(pool, selected, answers, passFn);
  const used = new Set(usedFoods || []);
  const seen = new Set();
  const out = [];
  const take = (allowRepeat, limit) => {
    for (const m of ranked) {
      if (out.length >= limit) return;
      if (seen.has(m.name)) continue;
      const mains = mainFoodsOf(m);
      if (!allowRepeat && mains.length > 0 && mains.every((f) => used.has(f))) continue;
      seen.add(m.name);
      mains.forEach((f) => used.add(f));
      out.push(m);
    }
  };
  take(false, count);
  if (out.length === 0) take(true, 1);
  return out;
}

function pickRice(selected) {
  let best = null;
  let bestScore = 0;
  RICE_BASES.forEach((r) => {
    const s = r.primary.filter((k) => selected.includes(k)).length * 10 + r.keys.filter((k) => selected.includes(k)).length;
    if (s > bestScore) { bestScore = s; best = r; }
  });
  const fallback = best === null;
  const base = best || RICE_BASES[0];
  const used = base.keys.filter((k) => selected.includes(k));
  const grains = used.length > 0 ? used : base.primary;
  return {
    id: base.id, name: base.name, formId: "F09", kind: "rice", sauceIds: [], fallback,
    ing: grains.map((k) => [k, "1"]),
    s: { matched: used, m1Matched: used, m2Matched: [], mainMatched: used, vegMatched: [], etcMatched: [] },
  };
}

// 상차림 한 벌을 만든다. 밥이 주재료 1(곡류)을, 국·찌개·주찬·부찬이 주재료 2를 맡는다.
function buildTable(answers, selected) {
  const rice = pickRice(selected);
  const subPass = (m, a) => subPassesSmell(m, a.smellIdx);
  const built = TABLE_SETTINGS.map((t) => {
    const mainPool = SUBS.filter((m) => t.mainForms.includes(m.formId));
    const sidePool = SUBS.filter((m) => t.sideForms.includes(m.formId));
    const main = pickTop(mainPool, selected, answers, 1, subPass)[0];
    if (!main) return null;
    const sides = pickTop(sidePool, selected, answers, 2, subPass, mainFoodsOf(main));
    if (sides.length === 0) return null;
    const parts = [main, ...sides];
    const sauceSets = parts.map((p) => usableSauces(p.sauceIds, answers.smellIdx));
    if (!seasoningFeasible(sauceSets, answers.seasonIdx)) return null;
    const items = [
      { ...rice, label: "밥" },
      { ...main, kind: "table_main", label: t.mainRoleLabel },
      ...sides.map((s, i) => ({ ...s, kind: "side", label: sides.length > 1 ? `부찬 ${i + 1}` : "부찬" })),
    ];
    const score = main.s.matched.length + sides.reduce((a, s) => a + s.s.matched.length, 0);
    return { setting: t, items, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
  return { built, rice };
}

// ── 메인 함수 ──────────────────────────────────────────────
// answers = { q1Idx, q2Idx, smellIdx[], seasonIdx[], q5Idx }
function buildFoodPlan(answers, selected) {
  const { q1Idx, q2Idx } = answers;
  if (!q1Idx || !q2Idx || selected.length === 0) return { items: [], kind: "none", reason: null };

  // Q2=5(반찬을 포함한 일반식) → typeB(상차림). Q5는 묻지 않는다.
  if (q2Idx === 5) {
    const { built, rice } = buildTable(answers, selected);
    if (built.length === 0) return { items: [], kind: "table", reason: "empty" };
    return { items: built[0].items, kind: "table", setting: built[0].setting, riceFallback: rice.fallback, reason: null };
  }

  // 그 외 → typeA 단독 완성 메뉴
  const pool = MENUS.filter((m) => bit(m.q1, q1Idx) && bit(m.q2, q2Idx));
  if (pool.length === 0) return { items: [], kind: "single", reason: "combo" };
  const picked = pickTop(pool, selected, answers, 3, passesMenu);
  if (picked.length === 0) {
    // ① 주재료 조건은 만족하는데 향·간·조리시간에 걸려 전부 빠진 경우
    const blocked = pool.filter((m) => meetsMainRoles(m, selected) && !passesMenu(m, answers));
    if (blocked.length > 0) return { items: [], kind: "single", reason: "filtered", blockedCount: blocked.length };
    // ② 다른 조건은 통과했지만 주재료 칸을 못 채운 경우
    const nearMiss = pool.filter((m) => passesMenu(m, answers) && !meetsMainRoles(m, selected));
    if (nearMiss.length > 0) {
      const needs = ["1", "2"].filter((role) => nearMiss.every((m) => missingMainRoles(m, selected).includes(role)));
      if (needs.length > 0) {
        const options = {};
        needs.forEach((role) => { options[role] = uniq(nearMiss.flatMap((m) => m.ing.filter((i) => i[1] === role).map((i) => i[0]))); });
        return { items: [], kind: "single", reason: "mainRole", needs, options };
      }
    }
    return { items: [], kind: "single", reason: "empty" };
  }
  return { items: picked.map((m, i) => ({ ...m, kind: "main", label: `추천 ${i + 1}` })), kind: "single", reason: null };
}

// ── 선지 노출 판정 ──────────────────────────────────────────
// 화면구성 메모의 "선지만 보여주기"는 결국 "그 선택지로 남는 메뉴가 하나라도 있는가"이다.
// 분기표를 손으로 박아두면 DB가 바뀔 때마다 어긋나므로, 매번 DB에서 계산한다.
function hasAnyCandidate(a) {
  if (a.q2Idx === 5) {
    // 상차림은 Q1=1에서만 성립한다(typeA에 Q2_5=1인 메뉴가 없고 typeB가 이를 대신한다)
    if (a.q1Idx && a.q1Idx !== 1) return false;
    return TABLE_SETTINGS.some((t) => {
      const mains = SUBS.filter((m) => t.mainForms.includes(m.formId) && subPassesSmell(m, a.smellIdx));
      const sides = SUBS.filter((m) => t.sideForms.includes(m.formId) && subPassesSmell(m, a.smellIdx));
      if (mains.length === 0 || sides.length === 0) return false;
      return mains.some((m) => sides.some((s) => seasoningFeasible([usableSauces(m.sauceIds, a.smellIdx), usableSauces(s.sauceIds, a.smellIdx)], a.seasonIdx)));
    });
  }
  return MENUS.some((m) => (!a.q1Idx || bit(m.q1, a.q1Idx)) && (!a.q2Idx || bit(m.q2, a.q2Idx)) && passesMenu(m, a));
}

// 복수선택 문항에서 그 선택지를 지금 고를 수 있는지.
// ① 혼자 골랐을 때도 결과가 있어야 하고 ② 지금까지 고른 것에 더해도 결과가 있어야 한다.
function multiOptionEnabled(a, key, v) {
  if (a[key].includes(v)) return true;
  return hasAnyCandidate({ ...a, [key]: [v] }) && hasAnyCandidate({ ...a, [key]: [...a[key], v] });
}

function optionAvailability(a) {
  const single = (key, tag, values) => {
    const hidden = hiddenOptions(a, tag);
    return new Set(values.filter((v) => !hidden.has(v) && hasAnyCandidate({ ...a, [key]: v })));
  };
  const multi = (key, tag, values) => {
    const hidden = hiddenOptions(a, tag);
    return new Set(values.filter((v) => !hidden.has(v) && multiOptionEnabled(a, key, v)));
  };
  return {
    q1: single("q1Idx", "q1", [1, 2, 3]),
    q2: single("q2Idx", "q2", [1, 2, 3, 4, 5]),
    // Q3(향)은 화면구성 메모대로 이전 선택과 무관하게 5개를 전부 띄운다
    q4: multi("seasonIdx", "q4", [1, 2, 3]),
    q5: single("q5Idx", "q5", [1, 2, 3, 4]),
  };
}

// ── 식품 후보 ────────────────────────────────────────────────
// 지금까지의 답변으로 살아남은 메뉴들의 식재료를 그대로 보여준다.
// (예전의 식품선별 표 기반 배치는 문항이 바뀌면서 폐기)
function buildFoodCandidates(a) {
  const names = new Set();
  if (a.q2Idx === 5) {
    TABLE_SETTINGS.forEach((t) => {
      SUBS.forEach((m) => {
        if (![...t.mainForms, ...t.sideForms].includes(m.formId)) return;
        if (!subPassesSmell(m, a.smellIdx)) return;
        m.ing.forEach((i) => names.add(i[0]));
      });
    });
    RICE_BASES.forEach((r) => r.keys.forEach((k) => names.add(k)));
  } else {
    MENUS.forEach((m) => {
      if (a.q1Idx && !bit(m.q1, a.q1Idx)) return;
      if (a.q2Idx && !bit(m.q2, a.q2Idx)) return;
      if (!passesMenu(m, a)) return;
      m.ing.forEach((i) => names.add(i[0]));
    });
  }
  // Q3-5를 고른 사용자에게는 메뉴명에 드러나지 않는 오이·수박을 감춘다
  a.smellIdx.forEach((i) => (Q3_HIDE_FOODS[i] || []).forEach((f) => names.delete(f)));

  const grouped = {};
  FOOD_GROUP_ORDER.forEach((g) => (grouped[g] = []));
  [...names].forEach((n) => {
    const g = FOOD_GROUP[n];
    if (!g) return;
    grouped[g].push({ name: n, essential: ESSENTIAL_FOODS.includes(n) });
  });
  FOOD_GROUP_ORDER.forEach((g) => grouped[g].sort((x, y) => x.name.localeCompare(y.name, "ko")));
  return grouped;
}

// "이렇게도 먹어볼 수 있어요" 존에 띄울 추가 식품
function buildExtraFoods(a, mainNames) {
  if (!a.q1Idx) return [];
  const base = [...(EXTRA_FOODS_BY_Q1[a.q1Idx] || [])];
  if (a.q1Idx === 3) base.push(...ESSENTIAL_FOODS);
  const hidden = new Set(a.smellIdx.flatMap((i) => Q3_HIDE_FOODS[i] || []));
  return uniq(base).filter((n) => FOOD_GROUP[n] && !mainNames.has(n) && !hidden.has(n));
}

// 추가로 고른 식품이 실제로 들어간 메뉴를 찾아준다.
// 1순위는 오늘 고른 식감(Q1)에 맞는 단독 메뉴, 그래도 없으면 식감 조건을 풀고
// 상차림 구성요소(국·찌개·주찬·부찬)까지 넓혀서 찾는다.
function buildExtraSuggestions(a, extraPicked) {
  if (extraPicked.length === 0) return [];
  const hitOf = (m) => uniq(m.ing.filter((i) => extraPicked.includes(i[0])).map((i) => i[0]));
  const isMainRole = (m, f) => m.ing.some((i) => i[0] === f && (i[1] === "1" || i[1] === "2"));
  const menuSmellOk = (m) => a.smellIdx.every((i) => bit(m.q3, i)) && usableSauces(m.sauceIds, a.smellIdx).length > 0;

  let pool = MENUS.filter((m) => (!a.q1Idx || bit(m.q1, a.q1Idx)) && menuSmellOk(m) && hitOf(m).length > 0);
  if (pool.length === 0) {
    pool = [
      ...MENUS.filter((m) => menuSmellOk(m) && hitOf(m).length > 0),
      ...SUBS.filter((m) => subPassesSmell(m, a.smellIdx) && hitOf(m).length > 0),
    ];
  }
  const scored = pool.map((m) => {
    const hit = hitOf(m);
    return { ...m, hit, mainHits: hit.filter((f) => isMainRole(m, f)).length };
  });
  // 그 재료가 주재료로 쓰인 메뉴를 먼저, 그다음 겹치는 재료가 많은 순
  scored.sort((x, y) => y.mainHits - x.mainHits || y.hit.length - x.hit.length || hashStr(x.id) - hashStr(y.id));
  const seen = new Set();
  return scored.filter((m) => (seen.has(m.name) ? false : (seen.add(m.name), true)));
}

const MORE_PAGE_SIZE = 5;

function drawMenus(pool, seen, count, justShown) {
  let rest = pool.filter((m) => !seen.has(m.name));
  let cycle = new Set(seen);
  if (rest.length === 0) {
    cycle = new Set();
    const fresh = pool.filter((m) => !(justShown && justShown.has(m.name)));
    rest = fresh.length >= count ? fresh : pool;
  }
  const arr = [...rest];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const picked = [];
  const batchNames = new Set();
  for (const m of arr) {
    if (picked.length >= count) break;
    if (batchNames.has(m.name)) continue;
    batchNames.add(m.name);
    cycle.add(m.name);
    picked.push(m);
  }
  return { picked, seen: cycle };
}

const SUB_ROLE_BY_FORM = { G: "국·탕", J: "찌개·전골", M: "주찬", B: "부찬" };
const subRoleLabel = (item) => (item.q2 ? null : SUB_ROLE_BY_FORM[item.formId[0]] || null);

function cautionsFor(selected) {
  return FOOD_CAUTIONS.map((c) => ({ ...c, hit: c.foods.filter((f) => selected.includes(f)) })).filter((c) => c.hit.length > 0);
}

function itemVitamins(item, selected) {
  const set = new Set();
  item.ing.forEach((i) => {
    if (!selected.includes(i[0])) return;
    (FOOD_NUTRIENTS[i[0]] || []).forEach((v) => set.add(v));
  });
  return [...set];
}

const GROUP_ICON = { rice: "🍚", table_main: "🍲", side: "🥗", main: "🍽️" };

// 결과 화면의 "다시 고르기" 버튼이 쓰는 단계 번호
const STEP_LINKS = {
  texture: { key: "texture", label: "식감 다시 고르기", step: 1 },
  form: { key: "form", label: "식사 형태 다시 고르기", step: 2 },
  smell: { key: "smell", label: "향 회피 완화하기", step: 3 },
  season: { key: "season", label: "간과 풍미 완화하기", step: 4 },
  cook: { key: "cook", label: "조리 시간 늘리기", step: 5 },
  food: { key: "food", label: "식품 다시 고르기", step: 6 },
};

const loOf = (v) => (Array.isArray(v) ? v[0] : v);
const hiOf = (v) => (Array.isArray(v) ? v[1] : v);
const midOf = (v) => (Array.isArray(v) ? (v[0] + v[1]) / 2 : v);
const SERIES_COLORS = [C.sageDeep, C.apricot, C.blue];
const seriesLabel = (label) => (label === "관찰 구간" ? "평균 누적 체중감량률" : label);

function findClosestWeekIndex(weeksArr, target) {
  let bestIdx = 0, bestDiff = Infinity;
  weeksArr.forEach((w, i) => {
    const diff = Math.abs(w - target);
    if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
  });
  return bestIdx;
}
const rangeLabel = (v) => (Array.isArray(v) ? `${v[0]}~${v[1]}%` : `${v}%`);

// ══════════════════════════════════════════════════════════════════
// 표시용 컴포넌트
// ══════════════════════════════════════════════════════════════════

function FoodLabel({ name, size = "text-sm" }) {
  const tags = FOOD_NUTRIENTS[name] || [];
  return (
    <span className={`${size} font-medium`}>
      {name}
      {tags.map((t) => (
        <span key={t} className="ml-1" style={{ color: VITAMIN_META[t].color, fontWeight: 700 }} title={VITAMIN_META[t].label}>
          {VITAMIN_META[t].shape}
        </span>
      ))}
    </span>
  );
}

function RichText({ text }) {
  return <>{text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: C.ink }}>{part}</strong> : <span key={i}>{part}</span>))}</>;
}

function GuidePoint({ point }) {
  const head = typeof point === "string" ? null : point.head;
  const body = typeof point === "string" ? point : point.body;
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span style={{ color: C.apricot }}>#</span>
      <span>
        {head && <strong className="block mb-1" style={{ color: C.sageDeep }}>{head}</strong>}
        {body}
      </span>
    </li>
  );
}

function WeightTrendChart({ table, userWeek, userRate }) {
  const W = 480, H = 300, P = { l: 40, r: 14, t: 26, b: 42 };
  const weeks = table.weeks;
  const maxWeek = weeks[weeks.length - 1];
  const entries = Object.entries(table.series);
  const dataMax = Math.max(...entries.flatMap(([, vs]) => vs.map(hiOf)));
  const yMax = Math.max(5, Math.ceil((dataMax + 2) / 5) * 5);
  const x = (w) => P.l + (w / maxWeek) * (W - P.l - P.r);
  const y = (v) => P.t + (v / yMax) * (H - P.t - P.b);
  const yTicks = [];
  for (let v = 0; v <= yMax; v += 5) yTicks.push(v);

  const bandPath = (vs) => [
    ...weeks.map((w, i) => `${i === 0 ? "M" : "L"}${x(w)},${y(hiOf(vs[i]))}`),
    ...weeks.map((_, i) => { const j = weeks.length - 1 - i; return `L${x(weeks[j])},${y(loOf(vs[j]))}`; }),
    "Z",
  ].join(" ");
  const linePath = (vs) => weeks.map((w, i) => `${i === 0 ? "M" : "L"}${x(w)},${y(midOf(vs[i]))}`).join(" ");

  const userVisible = Number.isFinite(userWeek) && Number.isFinite(userRate) && userWeek > 0 && userWeek <= maxWeek && userRate >= 0 && userRate <= yMax;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} role="img" aria-label="주차별 평균 누적 체중감량률 그래프">
        <text x={6} y={12} fontSize={10} fill={C.ink60}>체중 변화(%)</text>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? C.ink60 : C.sagePale} strokeWidth={1} strokeDasharray={v === 0 ? "4 3" : undefined} opacity={v === 0 ? 0.5 : 1} />
            <text x={P.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#9A988E" fontFamily="IBM Plex Mono, monospace">{v === 0 ? "0" : `-${v}`}</text>
          </g>
        ))}
        {entries.map(([label, vs], si) => {
          const color = SERIES_COLORS[si % SERIES_COLORS.length];
          return (
            <g key={label}>
              <path d={bandPath(vs)} fill={color} opacity={0.14} />
              <path d={linePath(vs)} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {weeks.map((w, i) => <circle key={w} cx={x(w)} cy={y(midOf(vs[i]))} r={2.4} fill={color} />)}
            </g>
          );
        })}
        {userVisible && (
          <g>
            <circle cx={x(userWeek)} cy={y(userRate)} r={6} fill="#fff" stroke={C.apricotDeep} strokeWidth={2.5} />
            <text x={x(userWeek)} y={y(userRate) - 11} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.apricotDeep}>나</text>
          </g>
        )}
        {weeks.map((w) => <text key={w} x={x(w)} y={H - P.b + 16} textAnchor="middle" fontSize={11} fill="#9A988E" fontFamily="IBM Plex Mono, monospace">{w}</text>)}
        <text x={(P.l + W - P.r) / 2} y={H - 8} textAnchor="middle" fontSize={11} fill={C.ink60}>투여 주차</text>
      </svg>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
        {entries.map(([label], i) => (
          <span key={label} className="flex items-center gap-1.5 text-xs" style={{ color: C.ink60 }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: SERIES_COLORS[i % SERIES_COLORS.length], display: "inline-block" }} />
            {seriesLabel(label)}
          </span>
        ))}
        {userVisible && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: C.apricotDeep }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#fff", border: `2.5px solid ${C.apricotDeep}`, display: "inline-block" }} />
            내 위치
          </span>
        )}
      </div>
      {!userVisible && <p className="text-xs mt-2" style={{ color: C.ink60 }}>입력하신 주차·체중은 이 연구의 관찰 범위를 벗어나서 그래프에 표시하지 않았어요.</p>}
    </div>
  );
}

function WeightTableView({ table, closestWeek }) {
  const entries = Object.entries(table.series);
  const cell = { padding: "7px 10px", borderBottom: `1px solid ${C.sagePale}` };
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.sagePale}`, background: "#fff" }}>
      <table className="w-full text-xs" style={{ borderCollapse: "collapse", minWidth: entries.length > 1 ? 320 : 220 }}>
        <thead>
          <tr style={{ background: C.sagePale, color: C.sageDeep }}>
            <th style={{ ...cell, textAlign: "left", fontWeight: 600 }}>주차</th>
            {entries.map(([label]) => <th key={label} style={{ ...cell, textAlign: "right", fontWeight: 600 }}>{entries.length > 1 ? label : "누적 체중감량률"}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.weeks.map((w, i) => {
            const on = w === closestWeek;
            return (
              <tr key={w} style={{ background: on ? "#FFF3EC" : "transparent" }}>
                <td className="font-mono" style={{ ...cell, color: on ? C.apricotDeep : C.ink60, fontWeight: on ? 700 : 400 }}>{w}</td>
                {entries.map(([label, vs]) => (
                  <td key={label} className="font-mono" style={{ ...cell, textAlign: "right", color: on ? C.apricotDeep : C.ink, fontWeight: on ? 700 : 400 }}>{rangeLabel(vs[i])}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VitaminLegend() {
  const keys = Object.keys(VITAMIN_META);
  return (
    <p className="text-xs leading-relaxed" style={{ color: "#9A988E" }}>
      {keys.map((k, i) => (
        <span key={k}>
          <span style={{ color: VITAMIN_META[k].color, fontWeight: 700 }}>{VITAMIN_META[k].shape}</span> {VITAMIN_META[k].label}
          {i < keys.length - 1 ? "  ·  " : ""}
        </span>
      ))}
      {"  — 이 영양소가 든 식품에는 색과 모양으로 표시했어요."}
    </p>
  );
}

function GoodBadTable({ good, avoid }) {
  const col = (label, items, mark, color) => (
    <div className="rounded-2xl p-4" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
      <p className="text-xs font-semibold mb-3" style={{ color }}>{label}</p>
      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-sm leading-relaxed">
            <span style={{ color, flexShrink: 0 }}>{mark}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {col("권장할 요소", good, "+", C.sageDeep)}
      {col("줄이거나 피할 요소", avoid, "−", C.apricotDeep)}
    </div>
  );
}

function GeneralGuideSection({ section, open, onToggle }) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-6 py-5 md:px-8 md:py-6 text-left">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>{section.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-semibold">{section.title}</p>
          <p className="text-xs mt-1" style={{ color: C.ink60 }}>{section.summary}</p>
        </div>
        {open ? <ChevronUp size={18} style={{ color: C.ink60 }} /> : <ChevronDown size={18} style={{ color: C.ink60 }} />}
      </button>
      {open && (
        <div className="px-6 pt-6 pb-6 md:px-8 md:pb-8 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.sagePale}` }}>
          {section.blocks.map((b, i) =>
            b.type === "table" ? <GoodBadTable key={i} good={b.good} avoid={b.avoid} />
              : <ul key={i} className="flex flex-col gap-4 m-0 p-0 list-none"><GuidePoint point={b.text} /></ul>
          )}
        </div>
      )}
    </div>
  );
}

function GeneralGuideView() {
  const [openIds, setOpenIds] = useState(() => GENERAL_GUIDE.map((s) => s.id));
  const allOpen = openIds.length === GENERAL_GUIDE.length;
  const toggle = (id) => setOpenIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <>
      <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: C.sageDeep }}>GENERAL</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">일반적 권고사항</h2>
        <p className="text-sm mt-2" style={{ color: C.ink60 }}>투여 단계와 관계없이 공통으로 지켜야 할 내용이에요. 제목을 눌러 접거나 펼칠 수 있어요.</p>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => setOpenIds(allOpen ? [] : GENERAL_GUIDE.map((s) => s.id))} className="chip px-4 py-2 rounded-full text-xs font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
          {allOpen ? "전체 접기" : "전체 펼치기"}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {GENERAL_GUIDE.map((s) => <GeneralGuideSection key={s.id} section={s} open={openIds.includes(s.id)} onToggle={() => toggle(s.id)} />)}
      </div>
    </>
  );
}

function PortionThumb({ imgKey, alt }) {
  const [failed, setFailed] = useState(false);
  const src = PORTION_IMAGES[imgKey];
  const box = { width: "100%", aspectRatio: "1 / 1", borderRadius: 14, background: "#fff", border: `1px solid ${C.sagePale}` };
  if (!src || failed) {
    return <div className="text-xs" style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink60 }}>사진 없음</div>;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} style={{ ...box, objectFit: "contain", display: "block" }} />;
}

function PortionReferenceCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-6 py-5 md:px-8 md:py-6 text-left">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>🍽️</div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-semibold">얼마나 먹으면 될까요?</p>
          <p className="text-xs mt-1" style={{ color: C.ink60 }}>식품군별 1인 1회 분량과 권장 식사 패턴을 확인해보세요 (참고용)</p>
        </div>
        {open ? <ChevronUp size={18} style={{ color: C.ink60 }} /> : <ChevronDown size={18} style={{ color: C.ink60 }} />}
      </button>
      {open && (
        <div className="px-6 pb-6 md:px-8 md:pb-8 flex flex-col gap-6" style={{ borderTop: `1px solid ${C.sagePale}` }}>
          <div className="rounded-2xl p-4 mt-6 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <p>정해진 섭취량이 아니라, 식품군별로 "1회 분량"이 대략 어느 정도인지 눈으로 감을 잡기 위한 참고 자료예요.</p>
          </div>
          <div>
            <p className="font-display text-base font-semibold mb-3">1인 1회 분량</p>
            <div className="flex flex-col gap-4">
              {PORTION_REFERENCE.groups.map((g) => (
                <div key={g.name} className="rounded-2xl p-4" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
                  <p className="text-xs font-semibold flex items-center gap-1.5 mb-3" style={{ color: C.sageDeep }}><span>{g.icon}</span>{g.name}</p>
                  <ul className="grid grid-cols-3 gap-3 m-0 p-0 list-none">
                    {g.items.map((it) => (
                      <li key={it.name} className="flex flex-col gap-1.5">
                        <PortionThumb imgKey={it.img} alt={`${it.name} ${it.amount}`} />
                        <span className="text-xs leading-tight text-center">{it.name}</span>
                        <span className="font-mono text-[11px] text-center" style={{ color: C.ink60 }}>{it.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.ink60 }}>{PORTION_REFERENCE.footnote}<br />{PORTION_REFERENCE.source}</p>
          <div>
            <p className="font-display text-base font-semibold mb-3">{CALORIE_PATTERN.title}</p>
            <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.sagePale}`, background: "#fff" }}>
              <table className="w-full text-xs" style={{ borderCollapse: "collapse", minWidth: 460 }}>
                <thead>
                  <tr style={{ background: C.sagePale, color: C.sageDeep }}>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600 }}>열량(kcal)</th>
                    {CALORIE_PATTERN.columns.map((c) => <th key={c} style={{ padding: "8px 10px", textAlign: "right", fontWeight: 600 }}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CALORIE_PATTERN.rows.map((r) => (
                    <tr key={r.kcal}>
                      <td className="font-mono" style={{ padding: "7px 10px", fontWeight: 600, borderTop: `1px solid ${C.sagePale}` }}>{r.kcal}</td>
                      {r.values.map((v, i) => <td key={i} className="font-mono" style={{ padding: "7px 10px", textAlign: "right", borderTop: `1px solid ${C.sagePale}` }}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs leading-relaxed mt-2" style={{ color: C.ink60 }}>{CALORIE_PATTERN.source}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SauceChips({ sauces }) {
  const [openId, setOpenId] = useState(null);
  const open = sauces.find((s) => s.id === openId);
  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: C.ink60 }}>
        오늘 조건에 맞는 양념<span className="font-normal"> — 눌러서 무엇으로 만드는지 확인해보세요</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sauces.map((s) => {
          const on = s.id === openId;
          return (
            <button key={s.id} type="button" onClick={() => setOpenId(on ? null : s.id)} className="chip text-xs px-2.5 py-1 rounded-full" style={{ background: on ? C.apricot : "#FFF3EC", color: on ? "#fff" : C.apricotDeep }}>
              {s.name}
            </button>
          );
        })}
      </div>
      {open && (
        <p className="text-xs leading-relaxed mt-2 rounded-xl px-3 py-2" style={{ background: "#FFF3EC", color: C.apricotDeep }}>
          <strong>{open.name}</strong>{" — "}
          {open.parts && open.parts !== "없음" ? `${open.parts} 으로 만들어요.` : "따로 양념하지 않고 재료 본연의 맛으로 드세요."}
        </p>
      )}
    </div>
  );
}

function MenuToggleCard({ item, selected, sauces, expanded, onToggle }) {
  const byRole = ROLE_ORDER.map((role) => ({
    role,
    foods: uniq(item.ing.filter((i) => i[1] === role && selected.includes(i[0])).map((i) => i[0])),
  })).filter((g) => g.foods.length > 0);
  const vitamins = itemVitamins(item, selected);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>{GROUP_ICON[item.kind] || "🍽️"}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {item.label ? <span className="font-mono text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>{item.label}</span> : null}
            {item.name}
          </p>
          {item.formName && <p className="text-xs mt-1" style={{ color: C.ink60 }}>{item.formName}</p>}
        </div>
        {expanded ? <ChevronUp size={18} style={{ color: C.ink60 }} /> : <ChevronDown size={18} style={{ color: C.ink60 }} />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${C.sagePale}` }}>
          <div className="pt-3">
            <p className="text-xs font-semibold mb-2" style={{ color: C.ink60 }}>고르신 식품 중 이 메뉴에 쓰이는 재료</p>
            {byRole.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {byRole.map((g) => (
                  <div key={g.role} className="flex items-start gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: g.role === "1" || g.role === "2" ? C.sage : C.sagePale, color: g.role === "1" || g.role === "2" ? "#fff" : C.sageDeep }}>
                      {ROLE_LABEL[g.role]}
                    </span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1">{g.foods.map((n) => <FoodLabel key={n} name={n} />)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: C.ink60 }}>메뉴 형태를 성립시키는 기본 베이스예요.</p>
            )}
          </div>
          {sauces && sauces.length > 0 && <SauceChips sauces={sauces} />}
          {vitamins.length > 0 && (
            <p className="text-xs leading-relaxed rounded-xl px-3 py-2" style={{ background: C.sagePale, color: C.sageDeep }}>
              이 메뉴로 {vitamins.map((v) => VITAMIN_META[v].label).join(", ")}를 채워볼까요?
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [flowType, setFlowType] = useState(null); // "food" | "guide" | null
  const [currentStep, setCurrentStep] = useState(0);
  const [guideCategory, setGuideCategory] = useState(null);
  const [guideAnswer, setGuideAnswer] = useState(null);

  const [guideInitialWeight, setGuideInitialWeight] = useState("");
  const [guideCurrentWeight, setGuideCurrentWeight] = useState("");
  const [guideDrug, setGuideDrug] = useState("wegovy");
  const [guideWeeks, setGuideWeeks] = useState("");
  const [guideDiabetes, setGuideDiabetes] = useState("");

  // 식품 선택 흐름 — 값은 선택지 번호(1부터). 0 또는 빈 배열 = 미선택
  const [q1Idx, setQ1Idx] = useState(0);        // 1단계 식감
  const [q2Idx, setQ2Idx] = useState(0);        // 2단계 식사 형태
  const [smellIdx, setSmellIdx] = useState([]); // 3단계 향 회피
  const [smellAllOk, setSmellAllOk] = useState(false);
  const [seasonIdx, setSeasonIdx] = useState([]); // 4단계 간과 풍미
  const [q5Idx, setQ5Idx] = useState(0);          // 5단계 조리 시간

  const [foodSelection, setFoodSelection] = useState([]);
  const [extraSelection, setExtraSelection] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [returnToResult, setReturnToResult] = useState(false);
  const [moreMenus, setMoreMenus] = useState([]);
  const [moreSeen, setMoreSeen] = useState(() => new Set());

  const answers = useMemo(
    () => ({ q1Idx, q2Idx, smellIdx, seasonIdx, q5Idx }),
    [q1Idx, q2Idx, smellIdx, seasonIdx, q5Idx]
  );

  // Q1=1 & Q2=5(일반식) → 5단계(조리 시간) 문항 자체를 띄우지 않는다.
  // typeB(상차림) DB에 Q5 열이 없어 판정 근거가 없기 때문.
  const skipCookStep = q2Idx === 5;

  const weightResult = useMemo(() => {
    const init = Number(guideInitialWeight);
    const cur = Number(guideCurrentWeight);
    const wk = Number(guideWeeks);
    if (!init || !cur || !guideDiabetes) return null;
    const key = guideDiabetes === "예" ? "diabetes" : "noDiabetes";
    const lossRate = ((init - cur) / init) * 100;
    const table = WEIGHT_TABLES[guideDrug][key];
    const idx = findClosestWeekIndex(table.weeks, wk || 0);
    const closestWeek = table.weeks[idx];
    const averages = Object.entries(table.series).map(([label, values]) => ({
      dose: label === "관찰 구간" ? "" : ` ${label}`,
      value: rangeLabel(values[idx]),
    }));
    return { lossRate, closestWeek, averages, note: WEIGHT_STUDY_NOTES[guideDrug][key], table, meta: WEIGHT_FIGURE_META[guideDrug][key] };
  }, [guideInitialWeight, guideCurrentWeight, guideDrug, guideWeeks, guideDiabetes]);

  const avail = useMemo(() => optionAvailability(answers), [answers]);
  const foodCandidates = useMemo(() => buildFoodCandidates(answers), [answers]);
  const shownFoods = useMemo(() => Object.values(foodCandidates).flat().map((f) => f.name), [foodCandidates]);
  const extraFoods = useMemo(() => buildExtraFoods(answers, new Set(shownFoods)), [answers, shownFoods]);

  const plan = useMemo(() => buildFoodPlan(answers, foodSelection), [answers, foodSelection]);
  const extraSuggestions = useMemo(() => buildExtraSuggestions(answers, extraSelection), [answers, extraSelection]);

  // 앞 단계 답을 바꿔서 성립하지 않게 된 뒤쪽 답을 나중 문항부터 하나씩 비운다
  useEffect(() => {
    if (flowType !== "food") return;
    if (hasAnyCandidate(answers)) return;
    if (q5Idx) { setQ5Idx(0); return; }
    if (seasonIdx.length) { setSeasonIdx([]); return; }
    if (smellIdx.length) { setSmellIdx([]); setSmellAllOk(false); return; }
    if (q2Idx) { setQ2Idx(0); return; }
    setQ1Idx(0);
  }, [flowType, answers, q1Idx, q2Idx, smellIdx, seasonIdx, q5Idx]);

  // 이전 문항을 고쳐서 지금은 감춰진 선택지가 골라진 채 남아 있으면 비운다
  useEffect(() => {
    if (flowType !== "food") return;
    if (q2Idx && hiddenOptions(answers, "q2").has(q2Idx)) { setQ2Idx(0); return; }
    const hiddenQ4 = hiddenOptions(answers, "q4");
    if (seasonIdx.some((v) => hiddenQ4.has(v))) setSeasonIdx((prev) => prev.filter((v) => !hiddenQ4.has(v)));
  }, [flowType, answers, q2Idx, seasonIdx]);

  // 화면에서 사라진 식품은 선택 목록에서도 뺀다
  useEffect(() => {
    const shown = new Set(shownFoods);
    setFoodSelection((prev) => (prev.every((n) => shown.has(n)) ? prev : prev.filter((n) => shown.has(n))));
  }, [shownFoods]);

  useEffect(() => {
    const ok = new Set(extraFoods);
    setExtraSelection((prev) => (prev.every((n) => ok.has(n)) ? prev : prev.filter((n) => ok.has(n))));
  }, [extraFoods]);

  const sauceFor = (item) => displaySauces(item.sauceIds, smellIdx, seasonIdx);
  const cautions = useMemo(() => cautionsFor([...foodSelection, ...extraSelection]), [foodSelection, extraSelection]);

  const emptyGuide = useMemo(() => {
    switch (plan.reason) {
      case "combo":
        return { text: "고르신 식감과 식사 형태 조합에 해당하는 메뉴가 DB에 없어요. 다른 형태를 골라보세요.", jumps: [STEP_LINKS.form] };
      case "filtered":
        return {
          text: `고르신 식품으로 만들 수 있는 메뉴가 ${plan.blockedCount}가지 있는데, 오늘 고르신 향·간·조리시간 조건에 걸려 모두 빠졌어요. 아래 조건을 완화하면 다시 나타나요.`,
          jumps: [STEP_LINKS.smell, STEP_LINKS.season, STEP_LINKS.cook],
        };
      case "mainRole": {
        const parts = (plan.needs || []).map((r) => {
          const foods = (plan.options || {})[r] || [];
          return foods.length > 0 ? `${ROLE_LABEL[r]}로 쓸 수 있는 식품(${foods.join(", ")})` : ROLE_LABEL[r];
        });
        return { text: `지금 남은 후보 메뉴들은 ${parts.join("와 ")} 중 최소 한 가지가 필요한데 아직 고르지 않으셨어요.`, jumps: [STEP_LINKS.food, STEP_LINKS.smell, STEP_LINKS.season, STEP_LINKS.cook] };
      }
      case "empty":
        return { text: "고르신 조건과 식품으로 만들 수 있는 메뉴를 찾지 못했어요. 곡류·단백질 식품을 몇 가지 더 고르거나, 아래 조건을 조금 완화해 보세요.", jumps: [STEP_LINKS.food, STEP_LINKS.smell, STEP_LINKS.season, STEP_LINKS.cook] };
      default:
        return { text: "조건에 맞는 메뉴를 찾지 못했어요.", jumps: [STEP_LINKS.food] };
    }
  }, [plan]);

  // "또 뭐가 있지?" — 고른 식품으로 만들 수 있는 다른 메뉴.
  // 주재료 규칙과 향 회피는 지키고, 형태·식감·간·조리시간만 풀어서 폭을 넓힌다.
  const morePool = useMemo(() => {
    if (foodSelection.length === 0) return [];
    const already = new Set(plan.items.map((i) => i.id));
    return [...MENUS, ...SUBS].filter(
      (m) =>
        !already.has(m.id) &&
        usableSauces(m.sauceIds, smellIdx).length > 0 &&
        (m.q3 ? smellIdx.every((i) => bit(m.q3, i)) : subPassesSmell(m, smellIdx)) &&
        meetsMainRoles(m, foodSelection) &&
        m.ing.some((i) => foodSelection.includes(i[0]))
    );
  }, [foodSelection, smellIdx, plan]);

  const moreTotal = useMemo(() => uniq(morePool.map((m) => m.name)).length, [morePool]);

  useEffect(() => {
    const { picked, seen } = drawMenus(morePool, new Set(), MORE_PAGE_SIZE);
    setMoreMenus(picked);
    setMoreSeen(seen);
  }, [morePool]);

  const drawMoreMenus = () => {
    const { picked, seen } = drawMenus(morePool, moreSeen, MORE_PAGE_SIZE, new Set(moreMenus.map((m) => m.name)));
    setMoreMenus(picked);
    setMoreSeen(seen);
  };

  const toggleIn = (setter) => (v) => setter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const toggleSeason = toggleIn(setSeasonIdx);
  const toggleFood = toggleIn(setFoodSelection);
  const toggleExtra = toggleIn(setExtraSelection);
  const toggleSmell = (v) => {
    setSmellAllOk(false);
    setSmellIdx((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const allFoodsPicked = shownFoods.length > 0 && shownFoods.every((n) => foodSelection.includes(n));
  const toggleAllFoods = () => setFoodSelection(allFoodsPicked ? [] : shownFoods);
  const groupFoodNames = (group) => (foodCandidates[group] || []).map((f) => f.name);
  const isGroupPicked = (group) => {
    const names = groupFoodNames(group);
    return names.length > 0 && names.every((n) => foodSelection.includes(n));
  };
  const toggleGroupFoods = (group) => {
    const names = groupFoodNames(group);
    setFoodSelection((prev) => (names.every((n) => prev.includes(n)) ? prev.filter((n) => !names.includes(n)) : [...prev, ...names.filter((n) => !prev.includes(n))]));
  };
  const toggleExpandedMenu = (id) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  const allAnswered =
    q1Idx > 0 && q2Idx > 0 &&
    (smellIdx.length > 0 || smellAllOk) &&
    seasonIdx.length > 0 &&
    (skipCookStep || q5Idx > 0) &&
    foodSelection.length > 0;

  const canProceedStep = () => {
    if (flowType !== "food") return true;
    if (currentStep === 1) return q1Idx > 0;
    if (currentStep === 2) return q2Idx > 0;
    if (currentStep === 3) return smellIdx.length > 0 || smellAllOk;
    if (currentStep === 4) return seasonIdx.length > 0;
    if (currentStep === 5) return q5Idx > 0;
    if (currentStep === 6) return foodSelection.length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canProceedStep()) { alert("필수 정보를 모두 입력해주세요."); return; }
    if (currentStep >= 6) { setReturnToResult(false); setCurrentStep(101); return; }
    // 4단계 다음은 5단계이지만, 일반식이면 5단계를 건너뛴다
    if (currentStep === 4 && skipCookStep) { setCurrentStep(6); return; }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep === 101) { setCurrentStep(6); return; }
    if (currentStep === 6 && skipCookStep) { setCurrentStep(4); return; }
    if (currentStep > 1) { setCurrentStep(currentStep - 1); return; }
    setFlowType(null);
    setCurrentStep(0);
  };

  const handleReset = () => {
    setFlowType(null);
    setCurrentStep(0);
    setGuideCategory(null);
    setGuideAnswer(null);
    setGuideInitialWeight(""); setGuideCurrentWeight(""); setGuideDrug("wegovy"); setGuideWeeks(""); setGuideDiabetes("");
    setQ1Idx(0); setQ2Idx(0); setSmellIdx([]); setSmellAllOk(false); setSeasonIdx([]); setQ5Idx(0);
    setFoodSelection([]); setExtraSelection([]);
    setExpandedMenus({});
    setReturnToResult(false);
    setMoreMenus([]); setMoreSeen(new Set());
  };

  const openGuide = (category) => { setFlowType("guide"); setGuideCategory(category); setGuideAnswer(null); };
  const openGuideHome = () => { setFlowType("guide"); setGuideCategory(null); setGuideAnswer(null); };
  const openWeight = () => { setFlowType("guide"); setGuideCategory("weight"); setGuideAnswer(null); };
  const returnToGuideHome = () => { setFlowType("guide"); setGuideCategory(null); setGuideAnswer(null); };

  const chipStyle = (active, activeBg = C.sage) => ({ background: active ? activeBg : C.sagePale, color: active ? "#fff" : C.sageDeep });

  const guideResultFooter = (retryLabel = "다시 선택") => (
    <div className="flex gap-3 justify-center">
      <button type="button" onClick={() => setGuideAnswer(null)} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
        <ChevronLeft size={14} />{retryLabel}
      </button>
      <button type="button" onClick={handleReset} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
        <RotateCcw size={14} />처음으로
      </button>
    </div>
  );

  const selectAllChips = (key, values, current, setter, allowed) => {
    const pickedAll = values.every((v) => current.includes(v) || (allowed && !allowed.has(v)));
    return (
      <button
        type="button"
        onClick={() => {
          if (pickedAll) { setter([]); return; }
          const next = [...current];
          values.forEach((v) => {
            if (next.includes(v)) return;
            if (!allowed || multiOptionEnabled({ ...answers, [key]: next }, key, v)) next.push(v);
          });
          setter(next);
        }}
        className="chip px-4 py-2 rounded-full text-xs font-medium"
        style={chipStyle(pickedAll, C.apricot)}
      >
        {pickedAll ? "전체 해제" : "전체 선택"}
      </button>
    );
  };

  const chipGroup = (key, values, current, setter, allowed, chips, labels, allOk) => {
    const blocked = allowed ? values.filter((v) => !allowed.has(v) && !current.includes(v)) : [];
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{current.length > 0 ? `${current.length}개 선택함` : allOk ? "다 괜찮다고 답하셨어요" : "아직 고른 항목이 없어요"}</p>
          {selectAllChips(key, values, current, setter, allowed)}
        </div>
        <div className="flex flex-wrap gap-2">{chips}</div>
        {blocked.length > 0 && labels && (
          <div className="rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.apricot}55`, color: C.ink60 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1, color: C.apricot }} />
            <span>
              지금까지 고른 조건으로는 만들 수 있는 메뉴가 없어서 아래 선택지는 고를 수 없어요.
              <span className="block mt-1" style={{ color: C.ink }}>{blocked.map((v) => labels[v - 1]).join(" · ")}</span>
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderChoiceList = (options, value, onPick, allowed) => {
    const visibleOptions = !allowed ? options.map((label, i) => ({ label, idx: i + 1 })) : options
      .map((label, i) => ({ label, idx: i + 1 }))
      .filter(({ idx }) => allowed.has(idx));

    return (
      <div className="flex flex-col gap-3">
        {visibleOptions.map(({ label, idx }, visibleIndex) => {
          const active = value === idx;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onPick(idx)}
              className="p-4 rounded-xl text-left text-sm font-medium transition-all"
              style={{ background: active ? C.apricot : "#fff", color: active ? "#fff" : C.ink, border: `1px solid ${active ? C.apricot : C.sagePale}`, cursor: "pointer" }}
            >
              {visibleIndex + 1}. {label}
            </button>
          );
        })}
      </div>
    );
  };

  const StepJumpButtons = ({ jumps }) => (
    <div className="flex flex-wrap gap-2">
      {jumps.map((j) => (
        <button key={j.key} type="button" onClick={() => { setReturnToResult(true); setCurrentStep(j.step); }} className="chip flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
          <ChevronLeft size={12} />{j.label}
        </button>
      ))}
    </div>
  );

  const navButtons = (nextLabel = "다음") => (
    <div className="flex flex-col gap-3 pt-4">
      {returnToResult && currentStep < 6 && (
        <button type="button" onClick={() => { setReturnToResult(false); setCurrentStep(101); }} disabled={!allAnswered} className="py-2.5 rounded-full text-sm font-medium disabled:opacity-40" style={{ background: C.sagePale, color: C.sageDeep }}>
          {allAnswered ? "결과로 바로 가기" : "뒤쪽 문항 답이 지워졌어요 — 다음을 눌러 이어가주세요"}
          {allAnswered && <ChevronRight size={14} className="inline ml-1" />}
        </button>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={handlePrev} className="px-6 py-2.5 rounded-full font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
          <ChevronLeft size={16} className="inline mr-1" />이전
        </button>
        <button type="button" onClick={handleNext} className="flex-1 py-2.5 rounded-full font-medium text-white" style={{ background: C.apricot }}>
          {nextLabel}<ChevronRight size={16} className="inline ml-1" />
        </button>
      </div>
    </div>
  );

  const stepCard = (title, desc, body, nextLabel) => (
    <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
      <div>
        <h2 className="font-display text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm" style={{ color: C.ink60 }}>{desc}</p>
      </div>
      {body}
      {navButtons(nextLabel)}
    </div>
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'IBM Plex Sans KR', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .chip { transition: all 0.15s ease; }
      `}</style>

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16 font-body">
        {/* 인트로 */}
        {currentStep === 0 && !flowType && (
          <div className="flex flex-col items-center text-center gap-8">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>GLP食(지엘피식)</span>
              <p className="mt-6 max-w-md text-base leading-relaxed mx-auto" style={{ color: C.ink60 }}>GLP-1 복용자를 위한 오늘의 식사 선택과 맞춤 권고를 확인해보세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                { key: "food", title: "식품 선택", desc: "오늘의 식사 선호도에 맞는 식품 추천", color: C.apricot, deep: C.apricotDeep, onClick: () => { setFlowType("food"); setCurrentStep(1); } },
                { key: "guide", title: "권고사항", desc: "상태를 선택하고 맞춤 권고 확인", color: C.sage, deep: C.sageDeep, onClick: openGuideHome },
                { key: "weight", title: "체중 변화", desc: "임상시험 자료와 내 감량률 비교", color: C.blue, deep: C.blueDeep, onClick: openWeight },
              ].map((c) => (
                <button key={c.key} onClick={c.onClick} className="rounded-3xl p-6 md:p-7 flex flex-col items-start justify-between h-44 text-left hover:shadow-lg transition-all" style={{ background: C.card, border: `2px solid ${c.color}` }}>
                  <div>
                    <p className="font-display text-lg font-semibold mb-2" style={{ color: c.deep }}>{c.title}</p>
                    <p className="text-sm" style={{ color: C.ink60 }}>{c.desc}</p>
                  </div>
                  <ChevronRight size={20} style={{ color: c.color }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== 권고사항 흐름 ===== */}
        {flowType === "guide" && !guideCategory && (
          <div className="flex flex-col gap-6">
            <button type="button" onClick={handleReset} className="self-start flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}><ChevronLeft size={16} /> 처음으로</button>
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: C.sageDeep }}>GUIDE</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">권고사항</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>확인하고 싶은 항목을 선택해주세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDE_MENU.map((category) => {
                const guide = GUIDE_DATA[category];
                return (
                  <button key={category} type="button" onClick={() => openGuide(category)} className="rounded-2xl p-5 flex items-center justify-between text-left hover:shadow-md transition-all" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
                    <span>
                      <strong className="block text-sm">{guide.title}</strong>
                      <small className="block mt-1" style={{ color: C.ink60 }}>{guide.menuNote || `${guide.options.length}가지 상태 중 선택`}</small>
                    </span>
                    <ChevronRight size={18} style={{ color: C.sage }} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {flowType === "guide" && guideCategory === "general" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}><ChevronLeft size={16} /> 권고사항 홈</button>
              <span className="font-mono text-xs" style={{ color: C.ink60 }}>공통 권고</span>
            </div>
            <GeneralGuideView />
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}><ChevronLeft size={14} />권고사항 홈</button>
              <button type="button" onClick={handleReset} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}><RotateCcw size={14} />처음으로</button>
            </div>
          </div>
        )}

        {flowType === "guide" && guideCategory && guideCategory !== "weight" && guideCategory !== "general" && !guideAnswer && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}><ChevronLeft size={16} /> 권고사항 홈</button>
              <span className="font-mono text-xs" style={{ color: C.ink60 }}>맞춤 권고</span>
            </div>
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale, border: `1px solid ${C.sagePale}` }}>
              <p className="font-mono text-xs tracking-widest mb-3" style={{ color: C.sageDeep }}>{GUIDE_DATA[guideCategory].title}</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">{GUIDE_DATA[guideCategory].question}</h2>
            </div>
            {GUIDE_DATA[guideCategory].note && (
              <div className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
                <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <p>{GUIDE_DATA[guideCategory].note}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {GUIDE_DATA[guideCategory].options.map((option) => (
                <button key={option.id} type="button" onClick={() => setGuideAnswer(option.id)} className="rounded-2xl p-5 text-left transition-all hover:shadow-md" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
                  <span className="block font-semibold text-sm">{option.label}</span>
                  {option.description && <span className="block text-xs leading-relaxed mt-2" style={{ color: C.ink60 }}>{option.description}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {flowType === "guide" && guideCategory && guideCategory !== "weight" && guideCategory !== "general" && guideAnswer && (() => {
          const guide = GUIDE_DATA[guideCategory];
          const selected = guide.options.find((option) => option.id === guideAnswer);
          const recommendation = guide.recommendations[guideAnswer];
          const points = Array.isArray(recommendation) ? recommendation : recommendation.points;
          const goal = Array.isArray(recommendation) ? null : recommendation.goal;
          const heading = (!Array.isArray(recommendation) && recommendation.title) || selected.label;
          return (
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
                <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: C.sageDeep }}>RECOMMENDATION</p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">{heading}</h2>
              </div>
              {goal && (
                <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
                  <h3 className="font-display text-xl font-semibold mb-5">핵심 목표</h3>
                  <ul className="flex flex-col gap-4 m-0 p-0 list-none"><GuidePoint point={goal} /></ul>
                </div>
              )}
              <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
                <h3 className="font-display text-xl font-semibold mb-5">권고사항</h3>
                <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                  {points.map((point) => <GuidePoint key={typeof point === "string" ? point : point.head} point={point} />)}
                </ul>
              </div>
              {guideResultFooter("다시 선택")}
            </div>
          );
        })()}

        {flowType === "guide" && guideCategory === "weight" && !guideAnswer && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={handleReset} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}><ChevronLeft size={16} /> 처음으로</button>
              <span className="font-mono text-xs" style={{ color: C.ink60 }}>체중 변화</span>
            </div>
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale, border: `1px solid ${C.sagePale}` }}>
              <p className="font-mono text-xs tracking-widest mb-3" style={{ color: C.sageDeep }}>체중</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">투여 전후 체중과 투여 정보를 입력해주세요</h2>
            </div>
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-5" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <div>
                <label className="block text-sm font-medium mb-2">투여 직전 또는 초기 체중 (kg)</label>
                <input type="number" placeholder="70" value={guideInitialWeight} onChange={(e) => setGuideInitialWeight(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">현재 체중 (kg)</label>
                <input type="number" placeholder="65" value={guideCurrentWeight} onChange={(e) => setGuideCurrentWeight(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">투여 받으시는 GLP-1 비만치료제의 종류</label>
                <div className="flex gap-2">
                  {[{ id: "wegovy", label: "위고비" }, { id: "mounjaro", label: "마운자로" }].map((d) => (
                    <button type="button" key={d.id} onClick={() => setGuideDrug(d.id)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(guideDrug === d.id)}>{d.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">현재까지 투여 받으신 기간 (주차)</label>
                <input type="number" placeholder="12" value={guideWeeks} onChange={(e) => setGuideWeeks(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2" style={{ border: `1px solid ${C.sagePale}`, background: "#fff", color: C.ink }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">제2형 당뇨병 여부</label>
                <div className="flex gap-2">
                  {["예", "아니요"].map((ans) => (
                    <button type="button" key={ans} onClick={() => setGuideDiabetes(ans)} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(guideDiabetes === ans)}>{ans}</button>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => weightResult && setGuideAnswer("computed")} disabled={!weightResult} className="py-2.5 rounded-full font-medium text-white disabled:opacity-40" style={{ background: C.apricot }}>
                결과 보기<ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {flowType === "guide" && guideCategory === "weight" && guideAnswer && weightResult && (
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug" style={{ color: C.ink }}>
                {weightResult.lossRate >= 0
                  ? `당신은 ${guideWeeks || 0}주차에 체중 감량률 ${weightResult.lossRate.toFixed(1)}%를 달성하셨어요!`
                  : `당신은 ${guideWeeks || 0}주차에 체중이 ${Math.abs(weightResult.lossRate).toFixed(1)}% 늘었어요.`}
              </h2>
            </div>
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-3" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              {weightResult.averages.map((a) => (
                <p key={a.dose} className="text-sm leading-relaxed">
                  {DRUG_SHORT[guideDrug]}{a.dose} {weightResult.closestWeek}주차의 사람들의 평균 체중 감량률은 <strong style={{ color: C.sageDeep }}>{a.value}</strong>예요.
                </p>
              ))}
              {Number(guideWeeks) !== weightResult.closestWeek && (
                <p className="text-xs" style={{ color: C.ink60 }}>입력하신 {guideWeeks || 0}주차와 가장 가까운 {weightResult.closestWeek}주차 자료로 비교했어요.</p>
              )}
            </div>
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-7" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">임상시험 참고 자료</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.ink60 }}>
                  {weightResult.meta.who}에게 {DRUG_SHORT[guideDrug]}를 투여한 {weightResult.meta.panel} 자료예요. 그래프의 동그라미가 지금 내 위치예요.
                </p>
              </div>
              <div>
                <WeightTrendChart table={weightResult.table} userWeek={Number(guideWeeks)} userRate={weightResult.lossRate} />
                <p className="text-xs leading-relaxed mt-3" style={{ color: C.ink60 }}>
                  <strong style={{ color: C.ink }}>{weightResult.meta.figureNo}.</strong>{" "}
                  {weightResult.meta.who}에서 {weightResult.meta.drug} 투여에 따른 주차별 평균 체중변화: {weightResult.meta.panel}
                </p>
                <p className="text-xs leading-relaxed mt-1" style={{ color: "#9A988E" }}>자료 출처: {weightResult.meta.source}</p>
              </div>
              <div>
                <WeightTableView table={weightResult.table} closestWeek={weightResult.closestWeek} />
                <p className="text-xs leading-relaxed mt-3" style={{ color: C.ink60 }}>
                  <strong style={{ color: C.ink }}>{weightResult.meta.tableNo}.</strong>{" "}
                  {weightResult.meta.who}에서 {weightResult.meta.drug} 투여에 따른 주차별 평균 누적 체중감량률: {weightResult.meta.panel} 그래프 디지타이징 추정치
                </p>
                <p className="text-xs leading-relaxed mt-1" style={{ color: "#9A988E" }}>자료 출처: {weightResult.meta.source}</p>
              </div>
            </div>
            <div className="rounded-2xl p-4 flex flex-col gap-2 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
              <p>* <RichText text={weightResult.note} /></p>
              <p>** {WEIGHT_COMMON_NOTE}</p>
            </div>
            {guideResultFooter("다시 입력")}
          </div>
        )}

        {/* ===== 식품 선택 흐름 (1~5단계 문항 → 6단계 식품 → 결과) ===== */}

        {flowType === "food" && currentStep === 1 && stepCard(
          "1단계: 식감",
          "오늘은 어떤 씹는 느낌이 좋을까요?",
          renderChoiceList(Q1_TEXTURE, q1Idx, setQ1Idx, avail.q1)
        )}

        {flowType === "food" && currentStep === 2 && stepCard(
          "2단계: 식사 형태",
          "오늘은 어떤 형태의 식사를 원하시나요?",
          renderChoiceList(Q2_FORM, q2Idx, setQ2Idx, avail.q2)
        )}

        {/* 3단계(향)는 화면구성 메모대로 이전 선택과 무관하게 5개 선지를 항상 전부 띄운다 */}
        {flowType === "food" && currentStep === 3 && stepCard(
          "3단계: 냄새 민감도",
          "오늘 특히 민감하게 느껴지는 향이 있나요? (복수 선택, 없으면 '다 괜찮아요')",
          chipGroup("smellIdx", [1, 2, 3, 4, 5], smellIdx, (v) => { setSmellAllOk(false); setSmellIdx(v); }, null,
            Q3_SMELL.map((label, i) => {
              const on = smellIdx.includes(i + 1);
              return (
                <button key={label} type="button" onClick={() => toggleSmell(i + 1)} className="chip px-3 py-2 rounded-full text-xs font-medium" style={chipStyle(on, C.blue)}>{label}</button>
              );
            }).concat(
              <button key="smell-all-ok" type="button" onClick={() => { setSmellIdx([]); setSmellAllOk(true); }} className="chip px-3 py-2 rounded-full text-xs font-medium" style={chipStyle(smellAllOk, C.blue)}>다 괜찮아요</button>
            ),
            Q3_SMELL, smellAllOk
          )
        )}

        {flowType === "food" && currentStep === 4 && stepCard(
          "4단계: 간과 풍미",
          "오늘 식사의 간과 풍미는 어느 정도가 좋을까요? (복수 선택)",
          chipGroup("seasonIdx", [1, 2, 3], seasonIdx, setSeasonIdx, avail.q4,
            Q4_SEASONING.map((t, i) => {
              const on = seasonIdx.includes(i + 1);
              const off = !on && !avail.q4.has(i + 1);
              return (
                <button key={t} type="button" disabled={off} onClick={() => toggleSeason(i + 1)} title={off ? "이 간·풍미로는 쓸 수 있는 양념이 없어요" : undefined} className="chip px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40" style={chipStyle(on, C.apricot)}>{t}</button>
              );
            }),
            Q4_SEASONING
          ),
          skipCookStep ? "식품 고르기" : "다음"
        )}

        {flowType === "food" && currentStep === 5 && !skipCookStep && stepCard(
          "5단계: 조리 시간",
          "조리에 어느 정도 시간을 쓰실 수 있나요?",
          renderChoiceList(Q5_COOKTIME, q5Idx, setQ5Idx, avail.q5)
        )}

        {/* 6단계: 식품 선택 */}
        {flowType === "food" && currentStep === 6 && (
          <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">{skipCookStep ? "5단계" : "6단계"}: 식품 선택</h2>
              <p className="text-sm leading-relaxed" style={{ color: C.ink60 }}>
                지금까지의 답변으로 남은 메뉴들에 실제로 쓰이는 식품이에요. 오늘 먹고 싶은 식품을 자유롭게 골라주세요.
              </p>
            </div>

            <div className="rounded-2xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: C.sagePale, color: C.sageDeep }}>
              <Sparkles size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><strong>별표(*)</strong>는 이 시기에 부족해지기 쉬운 영양소를 채워주는 식품이에요.</span>
            </div>

            <div className="rounded-2xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: "#FFF3EC", color: C.apricotDeep }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                메뉴는 <strong>주재료 1</strong>과 <strong>주재료 2</strong> 두 자리로 만들어져요. 예를 들어 덮밥은 곡류(주재료 1)와 고기·생선·달걀·콩류(주재료 2)를 각각 하나씩 필요로 해요.
                한쪽만 고르면 그 메뉴는 추천되지 않으니, <strong>곡류·단백질 식품을 골고루</strong> 담아주세요.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {foodSelection.length > 0 ? `${foodSelection.length}가지 선택함` : "아직 고른 식품이 없어요"}
                <span className="text-xs ml-1" style={{ color: C.ink60 }}>/ 전체 {shownFoods.length}가지</span>
              </p>
              <button type="button" onClick={toggleAllFoods} className="chip px-4 py-2 rounded-full text-xs font-medium" style={chipStyle(allFoodsPicked, C.apricot)}>
                {allFoodsPicked ? "전체 해제" : "전체 선택"}
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {FOOD_GROUP_ORDER.filter((g) => (foodCandidates[g] || []).length > 0).map((group) => (
                <div key={group}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: C.ink60 }}>{group}</p>
                    <button type="button" onClick={() => toggleGroupFoods(group)} className="text-xs font-medium" style={{ color: isGroupPicked(group) ? C.apricotDeep : C.sageDeep }}>
                      {isGroupPicked(group) ? "이 그룹 해제" : "이 그룹 전체 선택"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {foodCandidates[group].map((f) => {
                      const active = foodSelection.includes(f.name);
                      return (
                        <button key={f.name} type="button" onClick={() => toggleFood(f.name)} className="chip px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1" style={chipStyle(active, C.apricot)}>
                          {f.essential && <span style={{ color: active ? "#fff" : C.apricotDeep, fontWeight: 700 }}>*</span>}
                          <FoodLabel name={f.name} size="text-sm" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* [채민 파트] 이렇게도 먹어볼 수 있어요 */}
            {extraFoods.length > 0 && (
              <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#fff", border: `1px dashed ${C.blue}` }}>
                <div>
                  <p className="font-display text-base font-semibold" style={{ color: C.blueDeep }}>이렇게도 먹어볼 수 있어요</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: C.ink60 }}>
                    위 목록에는 없지만 지금 챙기면 좋은 식품이에요. 고르시면 이 재료가 들어간 상차림을 결과 화면 아래에 따로 보여드릴게요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extraFoods.map((n) => {
                    const active = extraSelection.includes(n);
                    return (
                      <button key={n} type="button" onClick={() => toggleExtra(n)} className="chip px-3 py-2 rounded-full text-sm font-medium" style={chipStyle(active, C.blue)}>
                        <FoodLabel name={n} size="text-sm" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {cautions.length > 0 && (
              <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
                <p className="text-xs font-semibold" style={{ color: C.ink60 }}>고르신 식품에 대해 알아두면 좋은 점</p>
                {cautions.map((c) => (
                  <p key={c.text} className="text-xs leading-relaxed" style={{ color: C.ink60 }}>
                    <strong style={{ color: C.ink }}>{c.hit.join(", ")}</strong> — {c.text}
                  </p>
                ))}
              </div>
            )}

            <VitaminLegend />
            {navButtons("완료")}
          </div>
        )}

        {/* 결과 화면 */}
        {flowType === "food" && currentStep === 101 && (
          <div className="flex flex-col gap-8">
            <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-2" style={{ background: C.sagePale, color: C.sageDeep }}>
              <span className="font-mono text-xs uppercase tracking-widest">{Q2_FORM[q2Idx - 1]?.split("(")[0]}</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
                {plan.kind === "table" && plan.setting ? plan.setting.label : "당신을 위한 추천 식사"}
              </h2>
              <p className="text-sm leading-relaxed mt-2">
                고르신 식품 {foodSelection.length}가지를 바탕으로 오늘의 메뉴를 구성했어요. 항목을 눌러 자세히 볼 수 있어요.
                {!skipCookStep && q5Idx > 0 && ` 조리 시간은 '${COOK_LABEL[q5Idx - 1]}' 기준이에요.`}
              </p>
            </div>

            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <VitaminLegend />
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-semibold px-1">{plan.kind === "table" ? "오늘의 상차림" : "추천 메뉴"}</h3>
              {plan.items.length > 0 ? (
                plan.items.map((m) => (
                  <MenuToggleCard key={m.id} item={m} selected={foodSelection} sauces={sauceFor(m)} expanded={!!expandedMenus[m.id]} onToggle={() => toggleExpandedMenu(m.id)} />
                ))
              ) : (
                <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#fff", border: `1px solid ${C.apricot}55` }}>
                  <div className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: C.ink60 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2, color: C.apricot }} />
                    <span>{emptyGuide.text}</span>
                  </div>
                  {emptyGuide.jumps.length > 0 && <StepJumpButtons jumps={emptyGuide.jumps} />}
                </div>
              )}
              {plan.kind === "table" && plan.items.length > 0 && plan.riceFallback && (
                <div className="rounded-xl px-3 py-2.5 flex flex-col gap-2" style={{ background: "#FFF3EC" }}>
                  <p className="text-xs leading-relaxed" style={{ color: C.apricotDeep }}>
                    고르신 곡류가 없어서 밥은 기본 흰쌀밥으로 뒀어요. 식품 선택으로 돌아가 현미·보리·귀리·콩 등을 고르시면 그 곡물로 지은 밥으로 바뀌어요.
                  </p>
                  <StepJumpButtons jumps={[STEP_LINKS.food]} />
                </div>
              )}
            </div>

            {/* [채민 파트] 추가로 고른 식품이 들어간 메뉴 */}
            {extraSuggestions.length > 0 && (
              <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px dashed ${C.blue}` }}>
                <h3 className="font-display text-lg font-semibold mb-1" style={{ color: C.blueDeep }}>이렇게도 먹어볼 수 있어요</h3>
                <p className="text-xs mb-4" style={{ color: C.ink60 }}>
                  추가로 고르신 {extraSelection.join(", ")}이(가) 들어간 메뉴예요.
                </p>
                <div className="flex flex-col gap-2">
                  {extraSuggestions.slice(0, 6).map((m) => (
                    <div key={m.id} className="rounded-xl px-4 py-3" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
                      <p className="font-semibold text-sm">
                        {subRoleLabel(m) && <span className="font-mono text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>{subRoleLabel(m)}</span>}
                        {m.name}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: C.ink60 }}>
                        {m.formName ? `${m.formName} · ` : ""}{m.hit.join(", ")} 사용
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-lg font-semibold">또 뭐가 있지?</h3>
                <Shuffle size={16} style={{ color: C.ink60 }} />
              </div>
              <p className="text-xs mb-4" style={{ color: C.ink60 }}>고르신 식품으로 만들 수 있는 다른 메뉴들이에요.</p>
              {moreMenus.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {moreMenus.map((m) => (
                    <div key={m.id} className="rounded-xl px-4 py-3" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
                      <p className="font-semibold text-sm">
                        {subRoleLabel(m) && <span className="font-mono text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>{subRoleLabel(m)}</span>}
                        {m.name}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: C.ink60 }}>
                        {uniq(m.ing.filter((i) => foodSelection.includes(i[0])).map((i) => i[0])).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs leading-relaxed rounded-xl px-3 py-2.5" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
                  고르신 식품으로 만들 수 있는 다른 메뉴가 더 없어요. 식품을 몇 가지 더 고르시면 여기에 나타나요.
                </p>
              )}
              {morePool.length > 0 && (
                <>
                  <button type="button" onClick={drawMoreMenus} className="w-full mt-4 py-2.5 rounded-full text-sm font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>더 볼래!</button>
                  <p className="text-[11px] mt-2 text-center" style={{ color: "#9A988E" }}>
                    만들 수 있는 다른 메뉴 {moreTotal}가지 중 {moreMenus.length}가지를 보고 있어요
                  </p>
                </>
              )}
            </div>

            <PortionReferenceCard />

            <div className="rounded-2xl p-4 flex items-start gap-2.5 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <p>이 추천은 당신의 선호도를 기반으로 하며, 개인의 건강 상태에 따라 조정이 필요할 수 있어요. 특별한 건강 관련 우려사항이 있으시면 전문가와 상담하세요.</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={handlePrev} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={14} />식품 다시 고르기
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                <RotateCcw size={14} />처음부터
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}