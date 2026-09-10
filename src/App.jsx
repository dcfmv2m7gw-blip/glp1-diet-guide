import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ChevronLeft, Info, RotateCcw, ChevronDown, ChevronUp, Clock, Shuffle, Sparkles, AlertCircle } from "lucide-react";

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
  warn: "#C4663F",
};

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
          {
            head: "적은 양을 3~4시간 간격으로 나누어 드세요",
            body: "한 번에 평균 식사량을 섭취하려 하지 말고, 3~4시간 간격으로 소량 분할 섭취하며 냄새가 강하거나 기름진 조리법은 피하세요.",
          },
          {
            head: "미온수의 물을 조금씩 자주 마셔 체액을 보충하세요",
            body: "식사량이 급감할 때 수분 섭취가 줄면 탈수로 인한 급성 신손상 위험이 커지므로, 하루 종일 물을 나누어 마셔 탈수를 우선 예방해야 해요.",
          },
          {
            head: "고형식 대신 부드러운 단백질 연식, 유동식을 활용하세요",
            body: "씹어 삼키기 힘든 고형식 대신 고단백 쉐이크, 스무디, 맑은 단백질 수프, 계란찜 등을 활용하여 근육 손실과 영양 결핍을 방지하세요.",
          },
        ],
      },
      moderate: {
        title: "식욕이 적당하고 소식으로도 만족스럽게 식사할 수 있을 때",
        points: [
          {
            head: "식사할 때 단백질을 먼저 챙기세요",
            body: "조기 포만감이 느껴질 수 있으므로 생선, 달걀, 콩류, 유제품, 살코기 등 단백질 식품을 먼저 선택하세요.",
          },
          {
            head: "영양 밀도 높은 식품을 골고루 선택하세요",
            body: "과일, 채소, 통곡물, 콩류, 견과류 등 덜 가공된 식품을 중심으로 식사해 보세요. 단 음료, 정제 탄수화물, 패스트푸드, 가공 간식은 먹는 횟수를 줄여 보세요.",
          },
          {
            head: "천천히 드시고, 포만감을 확인하세요",
            body: "한 번에 많은 식사보다 천천히 소량으로 드세요. 포만감이 느껴지면 더 먹기보다 다음 식사로 넘겨 보세요.",
          },
        ],
      },
      high: {
        title: "배고픔이 심하게 몰려오거나 단 음식·야식·간식 생각이 계속 맴돌 때",
        points: [
          {
            head: "물 한 컵을 천천히 마시고 15분간 기다려보세요",
            body: "갈증이나 감정적 스트레스로 인한 가짜 배고픔(Food Noise)일 수 있으므로, 물을 천천히 마시며 진짜 허기인지 먼저 점검하세요.",
          },
          {
            head: "초가공식품 대신 고단백·고식이섬유 간식을 선택하세요",
            body: "배달음식이나 과자 대신 삶은 달걀, 그릭 요거트, 풋콩, 견과류 한 줌, 방울토마토·오이 등을 먼저 섭취해 음식 갈망을 잠재우세요.",
          },
          {
            head: "장시간 공복으로 인한 보상성 폭식을 주의하세요",
            body: "오랜 시간 식사를 거르면 강한 폭식이 발생하기 쉬우므로, 끼니를 거르지 말고 규칙적으로 적정량의 식사를 유지하세요.",
          },
        ],
      },
    },
  },
  weight: {
    title: "체중 변화",
    question: "투여 전후 체중과 투여 정보를 입력해주세요",
  },
};

// 권고사항 홈에 띄울 항목 순서. 체중(weight)은 첫 화면으로 빠져서 여기엔 없다.
const GUIDE_MENU = ["general", "stage", "sideEffects", "appetite"];

// ══════════════════════════════════════════════════════════════════
// 일반적_권고사항_사이트용.hwpx 원문
// blocks: {type:"point"} = 본문 한 줄 / {type:"table"} = 권장·회피 2열 표
// ══════════════════════════════════════════════════════════════════
const GENERAL_GUIDE = [
  {
    id: "assessment",
    icon: "🩺",
    title: "치료 전 영양 및 건강 상태 평가",
    summary: "시작 전에 확인할 것",
    blocks: [
      {
        type: "point",
        text: "치료 시작 전에는 식사 패턴, 동반질환, 복용 약물 및 영양 상태를 의료진과 함께 확인하세요. 필요 시 개인의 건강 상태에 맞는 영양 평가를 시행하세요.",
      },
    ],
  },
  {
    id: "food",
    icon: "🥗",
    title: "식품 선택, 식습관",
    summary: "무엇을, 어떻게 먹을까",
    blocks: [
      {
        type: "point",
        text: "GLP-1 치료 중에는 영양 밀도가 높은 식품을 중심으로 식사하고, 정제 탄수화물·당류 첨가 음료·초가공식품의 섭취는 줄이는 것이 좋아요. 자세한 식품 선택은 아래 표를 참고하세요.",
      },
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
        avoid: [
          "정제 탄수화물(정제 곡물, 밀가루, 첨가당)",
          "당류 첨가 음료",
          "붉은 고기 및 가공육",
          "대부분의 패스트푸드",
          "단 음식 및 짭짤한 스낵류",
        ],
      },
      {
        type: "point",
        text: "GLP-1 치료 중에는 식사량 감소로 단백질 섭취가 부족해질 수 있으므로, 매 끼니 단백질 식품을 우선적으로 포함하는 것이 중요해요.",
      },
      {
        type: "point",
        text: "규칙적인 식사와 충분한 수분 섭취를 유지하고, 장시간 식사를 거르거나 한 번에 많은 양을 섭취하는 습관은 피하세요. 자세한 식습관은 아래 표를 참고하세요.",
      },
      {
        type: "table",
        good: [
          "일정한 시간에 소량씩 규칙적으로 식사하기",
          "식품 선택지를 지나치게 제한하지 않기",
          "간식이나 디저트는 적정량으로 즐기기",
          "충분한 수분 섭취",
          "음주는 최소화하기",
        ],
        avoid: [
          "감정적 식사, 무의식적 식사 또는 야식",
          "장시간 식사를 거르기(지나치게 배고픈 상태가 되기)",
          "한 번에 많은 양을 먹는 식사",
        ],
      },
      {
        type: "point",
        text: "체중감량만을 목표로 식사를 지나치게 제한하지 마세요. 치료 중에도 영양소를 충분히 섭취할 수 있는 균형 잡힌 식사와 지속 가능한 생활습관을 함께 유지하는 것이 중요해요.",
      },
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
    blocks: [
      {
        type: "point",
        text: "식욕과 식사량이 줄어들면 비타민과 무기질 섭취가 부족해질 수 있어요. 특히 비타민 D, 엽산, 칼슘, 비타민 A·C·E, 칼륨, 티아민(B1), 철, 비타민 B12, 아연의 결핍에 유의하고, 해당 영양소가 풍부한 식품을 의식적으로 섭취하는 것이 중요해요.",
      },
    ],
  },
];

// ── "체중" 카드 전용 데이터: 체중감량률 계산 + 임상시험 참고 구간 비교 ──
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

// 체중 결과화면 각주 — 약물 × 당뇨 여부 4가지
const WEIGHT_STUDY_NOTES = {
  wegovy: {
    noDiabetes:
      "위 수치는 **당뇨병이 없는 성인**을 대상으로 한 세마글루타이드 2.4 mg(**위고비**)의 STEP 1 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
    diabetes:
      "위 수치는 **당뇨병이 있는 성인**을 대상으로 한 세마글루타이드 2.4 mg(**위고비**)의 STEP 2 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
  },
  mounjaro: {
    noDiabetes:
      "위 수치는 **당뇨병이 없는 성인**을 대상으로 한 티르제파타이드(**마운자로**)의 SURMOUNT-1 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
    diabetes:
      "위 수치는 **당뇨병이 있는 성인**을 대상으로 한 티르제파타이드(**마운자로**)의 SURMOUNT-2 연구에서 **치료 시작 후 주차별 누적 체중감량률**을 정리한 표를 기반으로 합니다. 연구에서 제시된 시간경과별 체중변화 그래프를 AI 기반 그래프 디지타이징(graph digitizing)으로 분석하여 산출하였습니다. 따라서 그래프 판독에 따른 근사값이 포함될 수 있습니다.",
  },
};

const WEIGHT_COMMON_NOTE =
  "제시된 수치는 개인별 목표치나 안전 상한선이 아닙니다. 각 임상시험에서 시험약을 지속적으로 사용한 조건에서 관찰·추정된 평균적 누적 체중감량 경과를 참고하기 위한 값으로 해석해야 합니다.";

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

const PORTION_IMAGES = {
  grain_rice: "data:image/jpeg;base64,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",
  protein_beef: "data:image/jpeg;base64,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",
  veg_sprout: "data:image/jpeg;base64,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",
  fruit_apple: "data:image/jpeg;base64,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",
  milk_milk: "data:image/jpeg;base64,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",
  fat_oil: "data:image/jpeg;base64,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",
  grain_noodle: "data:image/jpeg;base64,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",
  protein_pork: "data:image/jpeg;base64,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",
  veg_spinach: "data:image/jpeg;base64,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",
  fruit_tangerine: "data:image/jpeg;base64,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",
  milk_yogurt: "data:image/jpeg;base64,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",
  fat_butter: "data:image/jpeg;base64,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",
  grain_bread: "data:image/jpeg;base64,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",
  protein_mackerel: "data:image/jpeg;base64,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",
  veg_kimchi: "data:image/jpeg;base64,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",
  fruit_grape: "data:image/jpeg;base64,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",
  fat_mayo: "data:image/jpeg;base64,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",
};

// ══════════════════════════════════════════════════════════════════
// 1인_1회_분량_칼로리별_섭취량_표_당뇨병_기준.docx 원본 그대로 옮긴 참고자료
// (식품군 이름·분량은 당뇨병 식품교환표 기준이라 앱 내부의 식품군 분류와 이름이 조금 다르다)
// img = PORTION_IMAGES의 키
// ══════════════════════════════════════════════════════════════════
const PORTION_REFERENCE = {
  footnote: "*표시는 0.3회, †표시는 0.5회",
  source: "출처: 당뇨병 식품교환표 활용지침, 대한당뇨병학회, 2023",
  groups: [
    { name: "곡류군", icon: "🍚", items: [
      { name: "쌀밥", amount: "70g", img: "grain_rice" },
      { name: "국수(말린 것)", amount: "30g", img: "grain_noodle" },
      { name: "식빵 1쪽*", amount: "35g", img: "grain_bread" },
    ]},
    { name: "어육류군", icon: "🍗", items: [
      { name: "쇠고기", amount: "생 40g", img: "protein_beef" },
      { name: "돼지고기", amount: "생 40g", img: "protein_pork" },
      { name: "고등어", amount: "생 50g", img: "protein_mackerel" },
    ]},
    { name: "채소군", icon: "🥬", items: [
      { name: "콩나물", amount: "생 70g", img: "veg_sprout" },
      { name: "익힌 시금치", amount: "70g", img: "veg_spinach" },
      { name: "배추김치", amount: "생 50g", img: "veg_kimchi" },
    ]},
    { name: "과일군", icon: "🍎", items: [
      { name: "사과", amount: "100g", img: "fruit_apple" },
      { name: "귤", amount: "100g", img: "fruit_tangerine" },
      { name: "포도", amount: "80g", img: "fruit_grape" },
    ]},
    { name: "우유군", icon: "🥛", items: [
      { name: "우유", amount: "200ml", img: "milk_milk" },
      { name: "호상요구르트", amount: "100g", img: "milk_yogurt" },
    ]},
    { name: "지방군", icon: "🫒", items: [
      { name: "콩기름 1작은술", amount: "5g", img: "fat_oil" },
      { name: "버터 1작은술", amount: "5g", img: "fat_butter" },
      { name: "마요네즈", amount: "8g", img: "fat_mayo" },
    ]},
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


// 표의 값은 숫자(고정값) 또는 [최소, 최대] 구간 두 가지 형태로 들어 있다
const loOf = (v) => (Array.isArray(v) ? v[0] : v);
const hiOf = (v) => (Array.isArray(v) ? v[1] : v);
const midOf = (v) => (Array.isArray(v) ? (v[0] + v[1]) / 2 : v);

// 용량별 선 색 (마운자로는 2~3개, 위고비는 1개)
const SERIES_COLORS = [C.sageDeep, C.apricot, C.blue];
const seriesLabel = (label) => (label === "관찰 구간" ? "평균 누적 체중감량률" : label);

function findClosestWeekIndex(weeksArr, target) {
  let bestIdx = 0;
  let bestDiff = Infinity;
  weeksArr.forEach((w, i) => {
    const diff = Math.abs(w - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function rangeLabel(v) {
  if (Array.isArray(v)) return `${v[0]}~${v[1]}%`;
  return `${v}%`;
}

// ══════════════════════════════════════════════════════════════════
// 메뉴추천_최종DB_통합수정_2.xlsx 에서 그대로 추출한 원본 데이터
//   RAW_MAIN  ← 03_메뉴선택지태그 + 04_메뉴식품 + 05_메뉴양념
//   RAW_SUB   ← 11/12/13_서브메뉴* (국·탕 G / 찌개 J / 주찬 M / 부찬 B)
//   RAW_RICE  ← 01_메뉴마스터 F09-01~05 (밥 베이스)
//   RAW_SAUCE ← 06_양념마스터 (양념명 + "구성 예시" = 무엇으로 만드는지)
//   RAW_FOODS ← 09_식품저작감
//   TEXTURE_COOK_HINT ← 09_식품저작감의 "구현 예"
// 비트문자열 표기: "10100" = 1번·3번 선택지에 해당(1) / 나머지 해당 없음(0)
//
// [2차 수정] 역할코드가 바뀌었다.
//   "1" = 주재료 1   "2" = 주재료 2   ← 예전에는 둘 다 "M"(주재료) 하나였다
//   V=채소  C=탄수화물  D=유제품  F=과일  N=지방·견과  G=국물원료
// 04_메뉴식품이 주재료를 두 칸으로 나눠 갖게 되면서,
// "주재료 1에서 최소 1개 + 주재료 2에서 최소 1개"가 선택되어야 그 메뉴가 성립한다.
// (칸 자체가 없는 메뉴는 그 칸을 건너뛴다. 예: 과일 컵은 주재료 2가 아예 없다)
// F07~F09 상차림은 밥 베이스가 주재료 1(곡류)을,
// 국·찌개·주찬·부찬이 주재료 2를 맡는 구조로 되어 있다.
// ══════════════════════════════════════════════════════════════════
const RAW_MAIN=[["L01-01","베리 스무디","L01",1,"10000","1000010","011",3,[["딸기","1"],["블루베리","1"],["라즈베리","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L01-02","수박 스무디","L01",1,"10000","1000010","011",3,[["수박","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L01-03","비타민C 스무디","L01",1,"10000","1000010","011",3,[["딸기","1"],["키위","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L01-04","레드 스무디","L01",1,"10000","1000010","011",3,[["딸기","1"],["사과","1"],["복숭아","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L01-05","멜론 스무디","L01",1,"10000","1000010","011",3,[["멜론","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L01-06","헬시 스무디","L01",1,"10000","1000010","011",3,[["당근","1"],["케일","1"],["딸기","1"],["사과","1"],["저지방 우유","2"],["무가당 플레인 요거트","D"]],["S001"]],["L02-01","사과 배 컵","L02",1,"01100","1011011","011",1,[["사과","1"],["배","1"]],["S001"]],["L02-02","베리 컵","L02",1,"01100","1000010","011",1,[["블루베리","1"],["라즈베리","1"],["딸기","1"]],["S001"]],["L02-03","수박 멜론 컵","L02",1,"01100","0010010","011",1,[["수박","1"],["멜론","1"]],["S001"]],["L02-04","핑크 볼","L02",1,"01100","1010010","011",1,[["복숭아","1"],["블루베리","1"]],["S001"]],["L02-05","단단히 볼","L02",1,"01100","1011011","011",1,[["감","1"],["사과","1"]],["S001"]],["L02-06","아이셔 컵","L02",1,"01100","1000010","011",1,[["감귤류","1"],["키위","1"],["딸기","1"]],["S001"]],["L03-01","베리 요거트볼","L03",1,"01000","1000010","011",1,[["블루베리","1"],["라즈베리","1"],["무가당 플레인 요거트","2"],["치아씨","N"]],["S001"]],["L03-02","힘내요거트볼","L03",1,"01000","1011011","011",1,[["키위","1"],["딸기","1"],["사과","1"],["배","1"],["블루베리","1"],["라즈베리","1"],["수박","1"],["멜론","1"],["복숭아","1"],["감","1"],["감귤류","1"],["무가당 플레인 요거트","2"],["아몬드","N"],["호두","N"],["아마씨","N"]],["S001"]],["L04-01","건강에 스틱","L04",1,"00100","1011011","011",1,[["당근","1"],["오이","1"],["빨간 파프리카","1"],["로메인 상추","1"],["사과","1"],["배","1"]],["S001","S016","S015"]],["L05-01","아몬드 호두 스낵팩","L05",1,"00100","0001001","001",1,[["아몬드","1"],["호두","1"]],["S001"]],["L05-02","씨앗 스낵팩","L05",1,"00100","0001001","001",1,[["해바라기씨","1"],["호박씨","1"]],["S001"]],["S01-01","연두부 한그릇","S01",2,"01100","1000011","011",1,[["두부","2"]],["S003"]],["S01-02","삶은 달걀","S01",2,"01100","0000011","011",1,[["달걀","2"]],["S002"]],["S01-03","닭가슴살","S01",2,"01100","0000011","011",1,[["닭가슴살","2"]],["S001"]],["S01-04","플레인 요거트","S01",2,"01100","1000000","011",1,[["무가당 플레인 요거트","1"]],["S001"]],["S02-01","주황 수프","S02",2,"01000","1000010","100",4,[["단호박","1"],["당근","1"],["두부","2"]],["S002"]],["S02-02","초록 수프","S02",2,"01000","1000010","100",4,[["브로콜리","1"],["양배추","1"],["두부","2"]],["S003"]],["S02-03","닭가슴살 채소 수프","S02",2,"01000","1000010","100",4,[["당근","1"],["양배추","1"],["브로콜리","1"],["닭가슴살","2"]],["S002"]],["S02-04","헝가리식 수프","S02",2,"01000","1000010","100",4,[["당근","1"],["양배추","1"],["렌틸콩","2"]],["S003"]],["S02-05","계란 수프","S02",2,"01000","1000010","100",4,[["옥수수","1"],["달걀","2"]],["S002"]],["S02-06","게살 수프","S02",2,"01000","1000010","100",4,[["게","2"],["단호박","V"],["당근","V"]],["S002"]],["S03-01","닭가슴살 샐러드","S03",2,"00010","1011011","011",1,[["닭가슴살","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S015"]],["S03-02","연어 샐러드","S03",2,"00010","1011111","011",1,[["연어","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-03","달걀 샐러드","S03",2,"00010","1011011","011",1,[["달걀","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-04","두부 샐러드","S03",2,"00010","1011011","011",1,[["두부","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-05","병아리콩 샐러드","S03",2,"00010","1011011","011",1,[["병아리콩","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-06","렌틸콩 샐러드","S03",2,"00010","1011011","011",1,[["렌틸콩","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-07","소고기 샐러드","S03",2,"00010","1011011","011",1,[["쇠고기 안심","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-08","코티지치즈 샐러드","S03",2,"00010","1011011","011",1,[["코티지치즈","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S03-09","아보카도 샐러드","S03",2,"00010","1011011","011",1,[["아보카도","2"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001"]],["S04-01","따뜻한 두부 한그릇","S04",2,"01000","0000011","111",1,[["두부","2"]],["S003"]],["S04-02","두부 한그릇","S04",2,"01000","1000011","111",1,[["두부","2"]],["S001"]],["S05-01","계란찜","S05",2,"01000","1000010","101",3,[["달걀","2"],["당근","V"],["건표고버섯","V"],["브로콜리","V"]],["S002"]],["S06-01","닭가슴살 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["닭가슴살","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-02","달걀 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["달걀","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-03","두부 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["두부","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-04","연어 샐러드볼","S06",2,"00010","1011111","111",3,[["오트밀","1"],["연어","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-05","병아리콩 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["병아리콩","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-06","저속노화 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["렌틸콩","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["S06-07","소고기 샐러드볼","S06",2,"00010","1011011","111",3,[["오트밀","1"],["쇠고기 안심","2"],["아몬드","N"],["호두","N"],["치아씨","N"],["아마씨","N"],["아보카도","N"],["해바라기씨","N"],["호박씨","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["F01-01","닭가슴살 덮밥","F01",3,"00010","0010011","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["닭가슴살","2"],["양배추","V"],["청경채","V"]],["S004","S009","S007","S012","S008","S005","S006","S013"]],["F01-02","스테이크동","F01",3,"00010","0010011","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["쇠고기 안심","2"],["청경채","V"],["아스파라거스","V"]],["S004","S009","S007","S008","S005","S006"]],["F01-03","부타동","F01",3,"00010","0010011","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["돼지고기 안심","2"],["청경채","V"]],["S004","S009","S007","S012","S008","S005","S006","S013"]],["F01-04","생연어 덮밥","F01",3,"00010","1000111","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["연어","2"],["아보카도","N"]],["S004","S009","S007","S008","S005","S006"]],["F01-05","연어스테이크 덮밥","F01",3,"00010","0000111","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["연어","2"]],["S004","S009","S007","S008","S005","S006"]],["F01-06","두부 구이 덮밥","F01",3,"00010","0010111","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["두부","2"],["양배추","V"],["당근","V"],["청경채","V"]],["S004","S009","S007","S008","S005","S006"]],["F01-07","달걀 채소 덮밥","F01",3,"00010","0010011","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["달걀","2"],["양배추","V"],["당근","V"],["브로콜리","V"]],["S004","S009","S007","S008","S005","S006"]],["F01-08","고등어 오차즈케","F01",3,"00010","0010111","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["고등어","2"],["무","V"]],["S004","S009","S007","S005","S006"]],["F02-01","닭가슴살 비빔밥","F02",3,"00010","0010011","101",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["닭가슴살","2"],["시금치","V"],["콩나물","V"],["당근","V"],["무","V"],["건표고버섯","V"],["로메인 상추","V"]],["S004","S007","S012","S005","S006","S011","S013"]],["F02-02","쇠고기 비빔밥","F02",3,"00010","0010011","101",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["쇠고기 안심","2"],["시금치","V"],["콩나물","V"],["당근","V"],["무","V"],["건표고버섯","V"],["로메인 상추","V"]],["S004","S007","S012","S005","S006","S011","S013"]],["F02-03","연어 비빔밥","F02",3,"00010","0010111","101",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["연어","2"],["시금치","V"],["콩나물","V"],["당근","V"],["무","V"],["건표고버섯","V"],["로메인 상추","V"]],["S004","S007","S012","S005","S006","S011","S013"]],["F03-01","닭가슴살 볶음밥","F03",3,"00010","0010001","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["닭가슴살","2"],["카놀라유","N"],["당근","V"],["양배추","V"],["빨간 파프리카","V"],["브로콜리","V"]],["S004","S009","S007","S008","S005","S006"]],["F03-02","쇠고기 볶음밥","F03",3,"00010","0010001","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["쇠고기 안심","2"],["카놀라유","N"],["당근","V"],["양배추","V"],["빨간 파프리카","V"],["브로콜리","V"]],["S004","S009","S007","S008","S005","S006"]],["F03-03","돼지고기 볶음밥","F03",3,"00010","0010001","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["돼지고기 안심","2"],["카놀라유","N"],["당근","V"],["양배추","V"],["빨간 파프리카","V"],["브로콜리","V"]],["S004","S009","S007","S008","S005","S006"]],["F03-04","간장 계란 볶음밥","F03",3,"00010","0010001","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["달걀","2"],["카놀라유","N"],["토마토","V"],["양배추","V"],["당근","V"]],["S004","S009","S007","S008","S005","S006"]],["F03-05","게 볶음밥","F03",3,"00010","0010001","100",3,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["게","2"],["카놀라유","N"],["당근","V"],["양배추","V"],["빨간 파프리카","V"],["브로콜리","V"]],["S004","S009","S007","S008","S005","S006"]],["F04-01","닭가슴살 스튜(카레)","F04",3,"00010","1000011","100",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["닭가슴살","2"],["당근","V"],["양배추","V"],["단호박","V"],["브로콜리","V"],["아스파라거스","V"]],["S020"]],["F04-02","쇠고기 스튜(카레)","F04",3,"00010","1000011","100",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["쇠고기 안심","2"],["당근","V"],["양배추","V"],["단호박","V"],["브로콜리","V"],["아스파라거스","V"]],["S020"]],["F04-03","돼지고기 스튜(카레)","F04",3,"00010","1000011","100",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["돼지고기 안심","2"],["당근","V"],["양배추","V"],["단호박","V"],["브로콜리","V"],["아스파라거스","V"]],["S020"]],["F04-04","두부 된장 스튜","F04",3,"00010","1000011","100",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["두부","2"],["당근","V"],["양배추","V"],["단호박","V"],["브로콜리","V"],["아스파라거스","V"]],["S010"]],["F05-01","포케","F05",3,"00010","1111011","011",3,[["현미","1"],["보리","1"],["귀리","1"],["백미","1"],["닭가슴살","2"],["병아리콩","2"],["렌틸콩","2"],["달걀","2"],["아보카도","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["F05-02","포케","F05",3,"00010","1111011","011",3,[["현미","1"],["보리","1"],["귀리","1"],["백미","1"],["돼지고기 안심","2"],["병아리콩","2"],["렌틸콩","2"],["달걀","2"],["아보카도","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["F05-03","포케","F05",3,"00010","1111111","011",3,[["현미","1"],["보리","1"],["귀리","1"],["백미","1"],["연어","2"],["병아리콩","2"],["렌틸콩","2"],["달걀","2"],["아보카도","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["F05-04","포케","F05",3,"00010","1111011","011",3,[["현미","1"],["보리","1"],["귀리","1"],["백미","1"],["쇠고기 안심","2"],["병아리콩","2"],["렌틸콩","2"],["달걀","2"],["아보카도","N"],["로메인 상추","V"],["오이","V"],["빨간 파프리카","V"],["토마토","V"],["당근","V"],["케일","V"],["양배추","V"]],["S016","S014","S003","S015","S001","S017","S018"]],["F06-01","닭가슴살 통밀파스타","F06",3,"00010","0010111","111",3,[["통밀파스타","1"],["닭가슴살","2"],["브로콜리","V"],["아스파라거스","V"],["건표고버섯","V"],["시금치","V"],["토마토","V"]],["S004","S009","S007","S008","S005","S006"]],["F06-02","게 통밀파스타","F06",3,"00010","0010011","111",3,[["통밀파스타","1"],["게","2"],["브로콜리","V"],["아스파라거스","V"],["건표고버섯","V"],["시금치","V"],["토마토","V"]],["S004","S009","S007","S008","S005","S006"]],["F06-03","두부 통밀파스타","F06",3,"00010","0010011","111",3,[["통밀파스타","1"],["두부","2"],["브로콜리","V"],["아스파라거스","V"],["건표고버섯","V"],["시금치","V"],["토마토","V"]],["S004","S009","S007","S008","S005","S006","S017"]],["F06-04","쇠고기 통밀파스타","F06",3,"00010","0010011","111",3,[["통밀파스타","1"],["쇠고기 안심","2"],["브로콜리","V"],["아스파라거스","V"],["건표고버섯","V"],["시금치","V"],["토마토","V"]],["S004","S009","S007","S008","S005","S006"]],["F06-05","메밀 닭가슴살 비빔면","F06",3,"00010","1111011","111",3,[["메밀","1"],["닭가슴살","2"],["오이","V"],["당근","V"],["토마토","V"],["로메인 상추","V"]],["S004","S009","S007","S008","S005","S006"]],["F06-06","메밀 비빔면","F06",3,"00010","1111011","111",3,[["메밀","1"],["달걀","2"],["아보카도","N"],["오이","V"],["당근","V"],["토마토","V"],["로메인 상추","V"]],["S004","S009","S007","S008","S005","S006","S017","S013","S018"]],["F06-07","따뜻한 대구 메밀면","F06",3,"00010","0000111","111",3,[["메밀","1"],["흰살생선(대구)","2"]],["S004","S009","S007","S008","S005","S006"]],["F10-01","닭가슴살 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["닭가슴살","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S016","S015"]],["F10-02","달걀 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["달걀","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S016","S002"]],["F10-03","치즈 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["저지방 치즈","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S001","S002","S015"]],["F10-04","코티지치즈 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["코티지치즈","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S015","S001","S002"]],["F10-05","연어 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["연어","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S015","S016"]],["F10-06","불고기 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["쇠고기 안심","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S009"]],["F10-07","포크 샌드위치","F10",3,"00100","1011111","111",3,[["통밀빵","1"],["돼지고기 안심","2"],["로메인 상추","V"],["토마토","V"],["오이","V"],["양배추","V"],["빨간 파프리카","V"],["당근","V"],["케일","V"],["무가당 플레인 요거트","D"],["사과","F"],["감귤류","F"],["블루베리","F"],["키위","F"]],["S009"]],["F11-01","닭죽","F11",3,"01000","1000011","111",2,[["백미","1"],["현미","1"],["귀리","1"],["보리","1"],["닭가슴살","2"],["당근","V"],["건표고버섯","V"],["브로콜리","V"]],["S002","S003"]],["F11-02","쇠고기죽","F11",3,"01000","1000011","111",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["쇠고기 안심","2"],["당근","V"],["건표고버섯","V"]],["S003","S020"]],["F11-03","달걀죽","F11",3,"01000","1000011","111",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["달걀","2"],["당근","V"],["브로콜리","V"]],["S002","S003"]],["F11-04","게살죽","F11",3,"01000","1000011","111",2,[["백미","1"],["현미","1"],["보리","1"],["귀리","1"],["게","2"],["당근","V"],["브로콜리","V"]],["S002","S003"]],["F11-05","옥수수 달걀수프","F11",3,"01000","1000011","111",2,[["옥수수","1"],["달걀","2"],["당근","V"],["브로콜리","V"],["양배추","V"]],["S002"]]];

const RAW_SUB=[["G01-01","콩나물국","G01","1000010","100",4,[["콩나물","1"],["무","V"],["건표고버섯","V"],["콩나물","G"]],["S002"]],["G01-02","콩나물국","G01","1000010","100",4,[["콩나물","1"],["무","V"],["건표고버섯","V"],["콩나물","G"]],["S003"]],["G01-03","쇠고기 무국","G01","1000010","100",4,[["쇠고기 안심","1"],["무","2"],["콩나물","V"],["건표고버섯","V"],["쇠고기 안심","G"]],["S003"]],["G01-04","쇠고기 무국","G01","1000010","100",4,[["쇠고기 안심","1"],["무","2"],["콩나물","V"],["건표고버섯","V"],["쇠고기 안심","G"]],["S020"]],["G01-05","바지락 맑은국","G01","1000010","100",4,[["바지락","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["두부","V"],["바지락","G"]],["S002"]],["G01-06","굴 맑은국","G01","1000010","100",4,[["굴","2"],["무","V"],["콩나물","V"],["두부","V"],["시금치","V"],["굴","G"]],["S002"]],["G01-07","계란국","G01","1000010","100",4,[["옥수수","C"],["달걀","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["당근","V"],["건표고버섯","G"]],["S002"]],["G01-08","두부 맑은국","G01","1000010","100",4,[["두부","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["청경채","V"],["건표고버섯","G"]],["S003"]],["G01-09","대구 맑은국(지리)","G01","1000010","100",4,[["흰살생선(대구)","2"],["무","V"],["콩나물","V"],["두부","V"],["건표고버섯","V"],["무","G"]],["S002"]],["G01-10","게 맑은국","G01","1000010","100",4,[["게","2"],["무","V"],["콩나물","V"],["두부","V"],["건표고버섯","V"],["게","G"]],["S002"]],["G01-12","시금치 된장국","G01","1000010","100",4,[["시금치","1"],["무","V"],["두부","V"],["건표고버섯","V"],["건표고버섯","G"]],["S010"]],["G02-02","닭가슴살 곰탕","G02","1000010","100",4,[["닭가슴살","2"],["무","V"],["건표고버섯","V"],["닭가슴살","G"]],["S002"]],["G02-03","쇠고기 얼큰탕","G02","1000010","100",4,[["쇠고기 안심","2"],["콩나물","V"],["무","V"],["건표고버섯","V"],["청경채","V"],["당근","V"],["단호박","V"],["쇠고기 안심","G"]],["S013"]],["G02-04","게 매운탕","G02","1000010","100",4,[["게","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["청경채","V"],["단호박","V"],["게","G"]],["S013"]],["G02-05","대구 매운탕","G02","1000010","100",4,[["흰살생선(대구)","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["청경채","V"],["흰살생선(대구)","G"]],["S012"]],["G02-07","돼지고기 콩나물국","G02","1000010","100",4,[["콩나물","1"],["돼지고기 안심","2"],["무","V"],["양배추","V"],["건표고버섯","V"],["당근","V"],["돼지고기 안심","G"]],["S012"]],["G02-10","등푸른생선 매운탕","G02","1000010","100",4,[["등푸른생선","2"],["무","V"],["콩나물","V"],["건표고버섯","V"],["양배추","V"],["청경채","V"],["등푸른생선","G"]],["S012"]],["G03-01","오이냉국","G03","1011011","010",3,[["오이","1"],["무","V"]],["S014"]],["G03-02","오이냉국","G03","1011011","010",3,[["오이","1"],["무","V"]],["S008"]],["G03-03","콩나물냉국","G03","0010011","010",4,[["콩나물","1"]],["S003"]],["J01-01","두부 된장찌개","J01","1000010","100",4,[["두부","2"],["무","V"],["건표고버섯","V"],["건표고버섯","G"]],["S010"]],["J01-03","바지락 된장찌개","J01","1000010","100",4,[["바지락","2"],["무","V"],["건표고버섯","V"],["바지락","G"]],["S010"]],["J01-04","돼지고기 된장찌개","J01","1000010","100",4,[["돼지고기 안심","2"],["무","V"],["건표고버섯","V"],["건표고버섯","G"]],["S011"]],["J01-05","쇠고기 된장찌개","J01","1000010","100",4,[["쇠고기 안심","2"],["무","V"],["건표고버섯","V"],["무","G"]],["S010"]],["J01-07","맑은 두부찌개","J01","1000010","100",4,[["두부","2"],["콩나물","V"],["무","V"],["양배추","V"],["건표고버섯","V"],["청경채","V"],["당근","V"],["건표고버섯","G"]],["S003"]],["J02-01","돼지고기 고추장찌개","J02","1000010","100",4,[["돼지고기 안심","2"],["무","V"],["건표고버섯","G"]],["S013"]],["J02-03","쇠고기 얼큰전골","J02","1000010","100",4,[["쇠고기 안심","2"],["무","V"],["콩나물","V"],["양배추","V"],["건표고버섯","V"],["청경채","V"],["당근","V"],["단호박","V"],["무","G"]],["S013"]],["J02-05","바지락 얼큰찌개","J02","1000010","100",4,[["바지락","2"],["콩나물","V"],["무","V"],["양배추","V"],["건표고버섯","V"],["청경채","V"],["바지락","G"]],["S012"]],["M01-01","연어구이","M01","0000101","100",3,[["연어","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S001"]],["M01-02","연어 소금구이","M01","0000101","100",3,[["연어","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-03","연어 간장구이","M01","0000101","100",3,[["연어","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S003"]],["M01-04","고등어 소금구이","M01","0000101","100",3,[["고등어","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-05","고등어구이","M01","0000101","100",3,[["고등어","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S001"]],["M01-06","등푸른생선 소금구이","M01","0000101","100",3,[["등푸른생선","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-07","대구 소금구이","M01","0000101","100",3,[["흰살생선(대구)","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-08","돼지고기 소금구이","M01","0000001","100",3,[["돼지고기 안심","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-09","돼지고기 마늘간장구이","M01","0000001","100",3,[["돼지고기 안심","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S005"]],["M01-10","돼지고기 고추장구이","M01","0000001","100",3,[["돼지고기 안심","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S013"]],["M01-11","소고기 간장구이","M01","0000001","100",3,[["쇠고기 안심","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S009"]],["M01-12","스테이크","M01","0000001","100",3,[["쇠고기 안심","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-13","닭가슴살 마늘간장구이","M01","0000101","100",3,[["닭가슴살","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S005"]],["M01-14","닭가슴살 소금구이","M01","0000101","100",3,[["닭가슴살","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M01-15","닭가슴살 고추장구이","M01","0000101","100",3,[["닭가슴살","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S012"]],["M01-16","두부 간장구이","M01","0000101","100",3,[["두부","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S003"]],["M01-17","두부구이","M01","0000101","100",3,[["두부","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S001"]],["M01-20","아스파라거스구이","M01","0000101","100",3,[["아스파라거스","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["M02-01","달걀찜","M02","1000010","100",3,[["옥수수","C"],["달걀","2"],["당근","V"],["건표고버섯","V"],["건표고버섯","G"]],["S002"]],["M02-02","대구 맑은찜","M02","1000010","100",3,[["흰살생선(대구)","2"],["무","V"],["청경채","V"],["무","G"]],["S003"]],["M02-03","대구찜","M02","1000010","100",3,[["흰살생선(대구)","2"],["무","V"],["청경채","V"],["무","G"]],["S013","S012"]],["M02-04","간장 찜닭","M02","1000010","100",3,[["닭가슴살","2"],["당근","V"],["단호박","V"],["양배추","V"],["청경채","V"],["건표고버섯","G"]],["S009","S004"]],["M02-06","갈비찜","M02","1000010","100",3,[["옥수수","C"],["쇠고기 안심","2"],["당근","V"],["무","V"],["건표고버섯","V"],["양배추","V"],["청경채","V"],["건표고버섯","G"]],["S009","S004"]],["M02-08","게찜","M02","1000010","100",3,[["게","2"],["콩나물","V"],["무","V"],["무","G"]],["S013"]],["M02-11","간장 돼지고기 찜","M02","1000010","100",3,[["돼지고기 안심","2"],["양배추","V"],["당근","V"],["건표고버섯","G"]],["S009"]],["M03-01","제육볶음","M03","0010001","100",3,[["돼지고기 안심","2"],["양배추","V"],["당근","V"],["콩나물","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S013","S012"]],["M03-02","돼지고기 간장볶음","M03","0010001","100",3,[["돼지고기 안심","2"],["양배추","V"],["당근","V"],["청경채","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S004","S005","S009"]],["M03-04","소고기 볶음","M03","0010001","100",3,[["쇠고기 안심","2"],["빨간 파프리카","V"],["양배추","V"],["당근","V"],["브로콜리","V"],["건표고버섯","V"],["아스파라거스","V"],["청경채","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S004","S005","S009"]],["M03-06","닭가슴살 볶음","M03","0010001","100",3,[["닭가슴살","2"],["빨간 파프리카","V"],["양배추","V"],["브로콜리","V"],["당근","V"],["아스파라거스","V"],["청경채","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S004","S005","S009"]],["M03-09","두부 볶음","M03","0010001","100",3,[["두부","2"],["양배추","V"],["당근","V"],["빨간 파프리카","V"],["브로콜리","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S007","S005"]],["M03-11","달걀 볶음","M03","0010001","100",3,[["달걀","2"],["당근","V"],["빨간 파프리카","V"],["양배추","V"],["브로콜리","V"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S002"]],["M04-01","쇠고기 장조림","M04","0000011","101",4,[["쇠고기 안심","2"]],["S009"]],["M04-02","달걀 장조림","M04","0000011","101",4,[["달걀","2"]],["S009"]],["M04-03","두부 간장조림","M04","0000011","101",4,[["두부","2"],["당근","V"],["무","V"],["양배추","V"],["청경채","V"]],["S004","S005","S009"]],["M04-04","두부조림","M04","0000011","101",4,[["두부","2"],["당근","V"]],["S013","S012"]],["M04-05","고등어 조림","M04","0000011","101",4,[["고등어","2"],["무","V"]],["S013","S012"]],["M04-07","대구 조림","M04","0000011","101",4,[["흰살생선(대구)","2"],["무","V"]],["S012","S013"]],["M04-10","등푸른생선 조림","M04","0000011","101",4,[["등푸른생선","2"],["무","V"]],["S012","S013"]],["B01-01","시금치나물","B01","0010010","111",3,[["시금치","2"]],["S007"]],["B01-02","시금치 된장무침","B01","0010010","111",3,[["시금치","2"]],["S011"]],["B01-03","콩나물무침","B01","0010010","111",3,[["콩나물","2"]],["S007"]],["B01-04","콩나물 매콤무침","B01","0010010","111",3,[["콩나물","2"]],["S012","S013"]],["B01-05","브로콜리 초고추장무침","B01","0010010","111",3,[["브로콜리","2"]],["S012"]],["B01-06","청경채 무침","B01","0010010","111",3,[["청경채","2"]],["S007"]],["B01-07","양배추 된장무침","B01","0010010","111",3,[["양배추","2"]],["S011"]],["B01-08","무나물","B01","0010010","111",3,[["무","2"]],["S002"]],["B01-09","오이 무침","B01","0010010","111",3,[["오이","2"]],["S013"]],["B02-02","무생채","B02","1011011","001",1,[["무","2"]],["S013"]],["B03-01","표고버섯볶음","B03","0000001","100",3,[["건표고버섯","2"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S004"]],["B03-02","당근볶음","B03","0010001","100",3,[["당근","2"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S002"]],["B03-05","브로콜리 마늘볶음","B03","0010001","100",3,[["브로콜리","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S005"]],["B03-06","아스파라거스볶음","B03","0010001","100",3,[["아스파라거스","2"],["올리브오일(엑스트라버진)","N"],["카놀라유","N"]],["S002"]],["B03-07","청경채 마늘볶음","B03","0010001","100",3,[["청경채","2"],["카놀라유","N"],["올리브오일(엑스트라버진)","N"]],["S005"]]];

const RAW_RICE=[["F09-01","흰쌀밥",["백미"],["백미"]],["F09-02","현미밥",["현미","백미","보리","귀리","검정콩","렌틸콩","병아리콩"],["현미"]],["F09-03","보리밥",["보리","백미","현미","귀리","검정콩","렌틸콩","병아리콩"],["보리"]],["F09-04","귀리밥",["귀리","백미","현미","보리","검정콩","렌틸콩","병아리콩"],["귀리"]],["F09-05","콩밥",["검정콩","렌틸콩","병아리콩","백미","현미","보리","귀리"],["검정콩","렌틸콩","병아리콩"]]];

const RAW_SAUCE=[["S001","무양념","000000","000","110","없음"],["S002","소금 아주 소량","000000","010","010","소금 소량"],["S003","저염 간장 희석","001000","010","011","저염 간장+물"],["S004","간장 기본양념","001000","010","001","간장+물+깨"],["S005","마늘 간장양념","001100","010","001","간장+다진마늘+물"],["S006","파 간장양념","001100","010","001","간장+다진파+물"],["S007","고소 간장양념","001000","011","001","간장+참기름+깨"],["S008","새콤 간장양념","001000","010","001","간장+식초+물"],["S009","달콤 간장양념","001000","110","001","간장+설탕/올리고당 소량"],["S010","된장 희석양념","001000","010","011","된장+물/육수"],["S011","된장 마늘양념","001100","010","001","된장+마늘+물"],["S012","고추장 희석양념","001000","110","001","고추장+물"],["S013","고추장 마늘양념","001100","110","001","고추장+마늘+물"],["S014","식초 드레싱","000000","010","011","식초+물+소금 아주 소량"],["S015","레몬 드레싱","000000","010","011","레몬즙+물+소금 아주 소량"],["S016","요거트 담백소스","001000","000","011","플레인 요거트+물/레몬"],["S017","두유 참깨소스","000010","000","011","무가당 두유+깨 소량"],["S018","오이 요거트소스","001001","000","011","오이+플레인 요거트"],["S019","액젓 양념","101000","010","001","멸치액젓+물"],["S020","고기육수 간장양념","011000","010","001","고기육수+간장 소량"]];

const RAW_FOODS=[["현미","곡류","1100011","0001100"],["귀리","곡류","1000011","0100100"],["오트밀","곡류","1000010","0000100"],["보리","곡류","0100011","1000000"],["통밀빵","곡류","0100111","1001000"],["통밀파스타","곡류","0100011","0000100"],["메밀","곡류","0100011","1000000"],["옥수수","곡류","0010011","0001100"],["백미","곡류","1000011","0001100"],["흰살생선(대구)","고기·생선·달걀·콩류","0000011","0000100"],["등푸른생선","고기·생선·달걀·콩류","0000011","0000100"],["닭가슴살","고기·생선·달걀·콩류","0000011","0000100"],["돼지고기 안심","고기·생선·달걀·콩류","0000011","0000000"],["쇠고기 안심","고기·생선·달걀·콩류","0000011","0000000"],["두부","고기·생선·달걀·콩류","1000111","0000000"],["렌틸콩","고기·생선·달걀·콩류","1000011","0000100"],["검정콩","고기·생선·달걀·콩류","1000011","0001100"],["병아리콩","고기·생선·달걀·콩류","1001111","0000000"],["연어","고기·생선·달걀·콩류","0000011","0000100"],["고등어","고기·생선·달걀·콩류","0000111","0000000"],["바지락","고기·생선·달걀·콩류","0100001","0000000"],["굴","고기·생선·달걀·콩류","0000010","0000001"],["달걀","고기·생선·달걀·콩류","1000011","0000000"],["게","고기·생선·달걀·콩류","0000011","0000000"],["건표고버섯","채소류","0100011","0001100"],["시금치","채소류","0000010","1010100"],["브로콜리","채소류","0010011","1000100"],["콩나물","채소류","0010011","0000000"],["당근","채소류","0011111","1000000"],["무","채소류","0011011","1000100"],["단호박","채소류","1000111","0000000"],["양배추","채소류","0010011","0000100"],["청경채","채소류","0010011","0000000"],["빨간 파프리카","채소류","0010011","0000000"],["케일","채소류","0010111","0000000"],["오이","채소류","0010000","0000010"],["토마토","채소류","1000010","0000001"],["아스파라거스","채소류","0010011","0000100"],["로메인 상추","채소류","0010000","0000000"],["키위","과일류","0000010","1000000"],["딸기","과일류","0000010","1000000"],["사과","과일류","0011111","1000000"],["배","과일류","0010111","1001000"],["블루베리","과일류","0000010","1000000"],["라즈베리","과일류","1000010","0000000"],["수박","과일류","0010010","0000000"],["멜론","과일류","0000010","0010000"],["복숭아","과일류","0000010","1010000"],["감","과일류","1010011","0101100"],["감귤류","과일류","0000010","0000000"],["저지방 우유","우유·유제품류","1000000","0000000"],["무가당 플레인 요거트","우유·유제품류","1000000","0000000"],["코티지치즈","우유·유제품류","1000010","0000000"],["저지방 치즈","우유·유제품류","0100011","0001100"],["올리브오일(엑스트라버진)","유지·당류","0000000","0000000"],["코코넛","유지·당류","0101101","0000000"],["해바라기씨","유지·당류","0001100","0000001"],["아몬드","유지·당류","0001101","0000000"],["아보카도","유지·당류","1000010","0000000"],["카놀라유","유지·당류","0000000","0000000"],["호박씨","유지·당류","0001100","0000001"],["호두","유지·당류","0001101","0000000"],["아마씨","유지·당류","0000000","0000000"],["치아씨","유지·당류","1000000","0000000"]];

const TEXTURE_COOK_HINT={"현미":{"1":"죽/미음 수준으로 푹 익힘","2":"일반 현미밥","4":"누룽지처럼 충분히 건조·구운 경우","5":"얇은 누룽지/밥 크리스프 형태","6":"진밥/푹 익힌 밥","7":"일반 현미밥"},"귀리":{"1":"포리지","2":"통귀리/스틸컷을 덜 무르게 조리","5":"마른 귀리 토스팅 또는 얇은 베이크드 오트","6":"포리지","7":"익힌 통귀리"},"오트밀":{"1":"묽은 오트밀","5":"얇게 펴서 구운 오트 크리스프","6":"일반 오트밀"},"보리":{"1":"보리죽","2":"익힌 보리의 탄력 있는 씹힘","6":"푹 익힌 보리","7":"일반 보리밥"},"통밀빵":{"1":"수프/우유 등에 충분히 적셔 연화","2":"부드러운 통밀빵","4":"강하게 토스트한 경우","5":"토스트","6":"부드러운 빵","7":"일반 빵"},"통밀파스타":{"2":"알덴테 파스타","5":"삶은 뒤 물기 제거 후 파스타칩 형태","6":"충분히 익힌 파스타","7":"일반 익힘"},"메밀":{"1":"메밀죽/묽은 형태","2":"메밀면","6":"부드럽게 익힌 메밀면/곡물","7":"일반 메밀면/곡물"},"옥수수":{"3":"삶은 옥수수 알갱이의 아삭한 씹힘","4":"건조·구운 옥수수","5":"건조한 옥수수 알/얇은 옥수수 형태를 구운 경우","6":"충분히 익힌 옥수수","7":"일반 삶은 옥수수"},"백미":{"1":"죽/미음","4":"누룽지","5":"누룽지/밥 크리스프","6":"진밥","7":"일반 밥"},"흰살생선(대구)":{"5":"껍질/표면 고온구이","6":"포칭·찜·부드러운 구이","7":"일반 구이/조림"},"등푸른생선":{"5":"껍질/표면 고온구이","6":"포칭·찜·부드러운 구이","7":"일반 구이/조림"},"닭가슴살":{"5":"얇게 썰고 표면을 건조해 에어프라이/오븐 구이","6":"포칭/찜","7":"일반 구이"},"돼지고기 안심":{"6":"저온/수분 조리","7":"일반 구이"},"쇠고기 안심":{"6":"부드럽게 익힌 안심","7":"일반 구이"},"두부":{"1":"연두부/순두부 형태","5":"단단한 두부의 물기를 제거해 에어프라이/오븐 구이","6":"연두부/찐 두부","7":"구운 두부"},"렌틸콩":{"1":"퓌레/수프","5":"익힌 렌틸을 충분히 건조해 로스팅","6":"푹 익힘","7":"일반 익힘"},"검정콩":{"1":"갈아 퓌레/수프","4":"건조·로스팅한 경우","5":"삶은 뒤 건조하여 로스팅","6":"푹 삶음","7":"일반 삶은 콩"},"병아리콩":{"1":"후무스/퓌레","4":"로스팅 병아리콩","5":"로스팅 병아리콩","6":"푹 삶음","7":"일반 삶은 병아리콩"},"연어":{"5":"껍질/표면 고온구이","6":"포칭·찜·부드러운 구이","7":"일반 구이/조림"},"고등어":{"5":"껍질/표면 고온구이","6":"포칭·찜·부드러운 구이","7":"일반 구이/조림"},"바지락":{"2":"익힌 조갯살의 탄력","7":"일반 익힌 조갯살"},"굴":{"6":"찜/포칭한 굴","7":"과도하게 익히지 않은 굴"},"달걀":{"1":"계란찜/스크램블","6":"계란찜/부드러운 달걀","7":"삶은 달걀/오믈렛"},"게":{"6":"부드럽게 익힌 게살","7":"일반 게살"},"건표고버섯":{"2":"불린 뒤 익힌 표고의 쫄깃함","4":"건조 상태/강한 로스팅","5":"얇게 썰어 건조 로스팅","6":"푹 익힌 표고","7":"일반 볶음/구이"},"시금치":{"1":"퓌레/아주 부드럽게 익힘","3":"어린잎 생식 시 약한 아삭함","5":"잎을 완전히 건조해 시금치칩 형태","6":"데침/찜"},"브로콜리":{"1":"퓌레","3":"생식/짧은 데침","5":"표면 수분 제거 후 고온 로스팅한 꽃부분","6":"푹 찜","7":"일반 찜/구이"},"콩나물":{"3":"짧게 데친 콩나물","6":"충분히 익힘","7":"일반 데침/무침"},"당근":{"1":"퓌레","3":"생당근","4":"생당근/굵은 조각","5":"얇게 슬라이스한 당근칩","6":"찜/삶기","7":"일반 구이"},"무":{"1":"무퓌레/푹 익힘","3":"생무","4":"생무","5":"얇게 썬 무칩","6":"조림/찜","7":"일반 익힘"},"단호박":{"1":"퓌레","5":"얇은 단호박칩","6":"찜/삶기","7":"구운 단호박"},"양배추":{"3":"생채/짧은 데침","5":"얇은 잎 가장자리 로스팅","6":"찜/볶음","7":"일반 볶음/구이"},"청경채":{"3":"줄기 생식/짧은 데침","6":"찜/볶음","7":"일반 볶음"},"빨간 파프리카":{"3":"생식","6":"구이/볶음 후 연화","7":"일반 생식/구이"},"케일":{"3":"생잎","5":"케일칩","6":"익힌 케일","7":"생/볶은 케일"},"오이":{"3":"생오이","6":"가열 시 연화 가능하나 일반 추천은 아님"},"토마토":{"1":"잘 익은 토마토/으깬 형태","6":"익힌 토마토","7":"형태가 유지되는 생토마토"},"아스파라거스":{"3":"짧은 데침/생에 가까운 조리","5":"가느다란 줄기·끝부분 고온 로스팅","6":"푹 익힘","7":"일반 구이"},"로메인 상추":{"3":"생식"},"키위":{"1":"퓌레/매우 익은 상태","6":"익은 과육"},"딸기":{"1":"퓌레","6":"생과"},"사과":{"1":"익혀 퓌레","3":"생사과","4":"생사과","5":"얇은 사과칩","6":"익힌 사과","7":"생사과"},"배":{"1":"익혀 퓌레","3":"단단한 생배","4":"단단한 품종/덜 익은 배","5":"얇은 배칩","6":"포칭/익힌 배","7":"생배"},"블루베리":{"1":"으깨거나 퓌레","6":"생과"},"라즈베리":{"1":"혀/입천장으로 쉽게 으깨짐","6":"생과"},"수박":{"3":"생수박의 수분 많은 아삭함","6":"생과"},"멜론":{"3":"단단한 숙도의 멜론","6":"익은 생과"},"복숭아":{"1":"매우 익은 과육/퓌레","3":"단단한 숙도","6":"익은 생과"},"감":{"1":"완숙 홍시","2":"곶감/말랭이","3":"단감","4":"단감","5":"얇은 감칩","6":"연시/완숙 감","7":"단감"},"감귤류":{"6":"과육"},"저지방 우유":{"1":"마시는 형태"},"무가당 플레인 요거트":{"1":"떠먹는 반고형"},"코티지치즈":{"1":"작은 커드로 저작 부담 매우 낮음","6":"쉽게 으깨지는 커드"},"저지방 치즈":{"2":"치즈 종류에 따라 탄력/쫄깃","4":"단단한 저지방 치즈","5":"얇게 구워 치즈크리스프 형태","6":"부드러운 슬라이스/커드","7":"일반 치즈"},"코코넛":{"2":"생 코코넛 과육","4":"생/건조 코코넛 조각","5":"코코넛칩","7":"얇은 생 과육"},"해바라기씨":{"4":"생/볶은 씨앗","5":"토스팅 씨앗","7":"소량 토핑으로 씹힘"},"아몬드":{"4":"생아몬드","5":"로스팅 아몬드","7":"견과류 씹힘"},"아보카도":{"1":"으깬 아보카도","6":"생과육"},"호박씨":{"4":"생/볶은 씨앗","5":"로스팅 씨앗","7":"소량 토핑"},"호두":{"4":"생호두","5":"로스팅 호두","7":"견과류 씹힘"},"치아씨":{"1":"충분히 불린 치아 푸딩/젤 형태"}};
// ── 원본 배열 → 객체로 변환 ──
const bit = (bits, n) => bits[n - 1] === "1";
const uniq = (arr) => [...new Set(arr)];

// 역할코드 → 화면 표기
const ROLE_LABEL = {
  "1": "주재료 1",
  "2": "주재료 2",
  V: "채소",
  C: "탄수화물",
  D: "유제품",
  F: "과일",
  N: "지방·견과",
  G: "국물 원료",
};
const ROLE_ORDER = ["1", "2", "C", "V", "D", "F", "N", "G"];

// 01_메뉴마스터의 표기를 화면 표시용으로만 정리 (DB 원본은 그대로 둔다)
// F05-01~04는 DB상 이름이 전부 "포케"라 화면에서 구분되지 않는다.
// 주재료 2가 서로 달라 실제로는 다른 메뉴이므로 그 재료명을 앞에 붙여 보여준다.
const NAME_FIX = {
  "F05-01": "닭가슴살 포케",
  "F05-02": "돼지고기 포케",
  "F05-03": "연어 포케",
  "F05-04": "소고기 포케",
};
const displayName = (id, n) => NAME_FIX[id] || n.replace(/\s+/g, " ").trim();

// parts = 06_양념마스터의 "구성 예시" — 그 양념을 무엇으로 만드는지
const SAUCES = Object.fromEntries(
  RAW_SAUCE.map(([id, name, q5has, q6has, q7ok, parts]) => [id, { id, name, q5has, q6has, q7ok, parts }])
);

const MENUS = RAW_MAIN.map(([id, name, formId, q1, q2, q3, q4, q8min, ing, sauceIds]) => ({
  id, name: displayName(id, name), formId, q1, q2, q3, q4, q8min, ing, sauceIds,
}));

const SUBMENUS = RAW_SUB.map(([id, name, formId, q3, q4, q8min, ing, sauceIds]) => ({
  id, name: displayName(id, name), formId, q3, q4, q8min, ing, sauceIds,
}));

// keys = 사용 가능한 곡류 전체, primary = 그 밥의 이름을 정하는 주곡물(= 주재료 1)
const RICE_BASES = RAW_RICE.map(([id, name, keys, primary]) => ({ id, name: displayName(id, name), keys, primary }));

const FOODS = RAW_FOODS.map(([name, group, tex, texCond]) => ({ name, group, tex, texCond }));

const FOOD_GROUP_ORDER = ["곡류", "고기·생선·달걀·콩류", "채소류", "과일류", "우유·유제품류", "유지·당류"];

// 14_상차림구성규칙 — F07/F08/F09. Q1/Q2/Q4/Q8은 08_메뉴형태마스터 기준
const TABLE_SETTINGS = [
  { id: "F07", label: "국·탕 한상", mainRoleLabel: "국·탕", mainForms: ["G01", "G02", "G03"], sideForms: ["B01", "B02", "B03"], q4: "100", q8min: 4 },
  { id: "F08", label: "찌개·전골 한상", mainRoleLabel: "찌개·전골", mainForms: ["J01", "J02"], sideForms: ["B01", "B02", "B03"], q4: "100", q8min: 4 },
  { id: "F09", label: "일반식(밥+주찬+부찬)", mainRoleLabel: "주찬", mainForms: ["M01", "M02", "M03", "M04"], sideForms: ["B01", "B02", "B03"], q4: "101", q8min: 4 },
];

// ── 선택지 (15_문항정의의 문항번호·선택지번호 순서를 그대로 인덱스로 사용) ──
// Q1(식사 스타일)은 Q2와 겹치는 부분이 많아 화면에서 제거했다.
// 아래 목록은 15_문항정의 원본 보존용이며, 지금은 어느 화면에서도 쓰지 않는다.
// (Q1을 되살리려면 이 목록으로 1단계 화면을 만들고 q1Idx에 1~3을 넣으면 된다)
const MEAL_STYLE_OPTIONS = [
  "가볍게 즐기고 싶어요 (과일, 두유 등)",
  "간단하게 한 끼 챙기고 싶어요(그릭 요거트, 샐러드, 닭가슴살, 연두부 등)",
  "꽉 찬 한 끼의 식사가 좋아요",
];
const MEAL_FORM_OPTIONS = [
  "마시는 것이 좋아요",
  "쉽게 떠먹는 것이 좋아요",
  "핑거푸드가 좋아요",
  "혼합형 한그릇(덮밥, 비빔밥, 포케)이 좋아요",
  "일반식이 좋아요",
];
const TEXTURE_OPTIONS = [
  "거의 씹지 않아도 되는 부드러운 느낌이 좋아요",
  "쫄깃한 느낌이 좋아요",
  "아삭한 느낌이 좋아요",
  "단단한 느낌이 좋아요",
  "바삭한 느낌이 좋아요",
  "쉽게 씹히는 느낌이 좋아요",
  "적당히 씹히는 느낌이 좋아요",
];
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
const SEASONING_OPTIONS = ["재료 본연의 맛을 즐길래요", "담백하고 삼삼하게 먹고 싶어요", "양념이 필요해요"];
const COOKING_TIME_OPTIONS = ["바로 먹을래요", "데우기만 하고 먹을래요", "15분 이내로 조리해서 먹을래요", "충분히 조리할 수 있어요"];

// Q8 등급 → 화면 표기용 (07_조리법마스터의 기본 소요시간 기준 안내값)
const COOK_GRADE_LABEL = ["바로 먹기", "데우기만", "15분 이내", "충분히 조리"];

// ══════════════════════════════════════════════════════════════════
// 식품선별.docx — 질문 3번(식감) / 4번(온도) / 6번(맛) 의 식품 배치표
// 마지막 단계에 "어떤 식품을 보여줄지"를 정하는 표. 메뉴 필터링에는 쓰지 않는다.
// ══════════════════════════════════════════════════════════════════

// 질문 3번: 각 식감 선택지에 기본으로 배치되는 식품
const DOCX_TEXTURE_MAP = {
  1: ["오트밀", "두부", "무가당 플레인 요거트", "코티지치즈", "아보카도", "치아씨"],
  2: ["바지락", "건표고버섯"],
  3: ["브로콜리", "콩나물", "당근", "양배추", "청경채", "빨간 파프리카", "오이", "로메인 상추", "토마토", "케일", "사과", "배", "수박", "감"],
  4: ["아몬드", "호두", "해바라기씨", "호박씨", "아마씨"],
  5: [], // 문서상 "배치 식재료 없음" → 09_식품저작감의 판정으로 보완한다
  6: ["렌틸콩", "굴", "시금치", "무", "아스파라거스", "키위", "딸기", "멜론", "블루베리", "라즈베리", "복숭아", "감귤류"],
  7: ["현미", "백미", "귀리", "보리", "메밀", "옥수수", "통밀빵", "통밀파스타", "흰살생선(대구)", "등푸른생선", "연어", "고등어", "돼지고기 안심", "쇠고기 안심", "닭가슴살", "게", "검정콩", "병아리콩", "달걀", "저지방 치즈", "코코넛"],
};
// 문서상 "액체류(특별한 식감 없음)" — 식감 답변과 무관하게 항상 노출
const DOCX_NEUTRAL_FOODS = ["저지방 우유", "올리브오일(엑스트라버진)"];

// 질문 4번: 온도별 식품 (64개 식품이 각각 한 곳에만 배치되어 있다)
const TEMP_FOOD_MAP = {
  1: ["현미", "귀리", "오트밀", "보리", "메밀", "옥수수", "백미", "닭가슴살", "돼지고기 안심", "쇠고기 안심", "흰살생선(대구)", "등푸른생선", "연어", "고등어", "바지락", "굴", "게", "달걀", "두부", "렌틸콩", "검정콩", "병아리콩", "건표고버섯", "시금치", "브로콜리", "콩나물", "무", "단호박", "양배추", "청경채", "아스파라거스"],
  2: ["저지방 우유", "무가당 플레인 요거트", "코티지치즈", "저지방 치즈", "키위", "딸기", "사과", "배", "블루베리", "라즈베리", "수박", "멜론", "빨간 파프리카", "케일", "로메인 상추"],
  3: ["통밀빵", "통밀파스타", "올리브오일(엑스트라버진)", "카놀라유", "코코넛", "해바라기씨", "아몬드", "호박씨", "호두", "아마씨", "치아씨", "당근", "오이", "토마토", "아보카도", "복숭아", "감", "감귤류"],
};

// 질문 6번: 민감하게 느껴지는 맛 → 피할 식품
const TASTE_AVOID_FOOD_MAP = {
  1: ["키위", "딸기", "사과", "배", "블루베리", "라즈베리", "수박", "멜론", "복숭아", "감", "감귤류", "단호박"],
  2: ["바지락", "굴", "게", "코티지치즈", "저지방 치즈"],
  3: ["연어", "고등어", "해바라기씨", "아몬드", "아보카도", "호박씨", "호두", "아마씨", "치아씨", "올리브오일(엑스트라버진)"],
};

// 질문 5번(향)은 식품선별.docx에 식품 단위 표가 없고, 엑셀도 양념 단위로만 다룬다.
// 아래는 근거 문서가 없는 임시 매핑이라 별도 표시해 둔다. (담당자 확인 필요)
const SMELL_AVOID_FOOD_MAP = {
  1: ["흰살생선(대구)", "등푸른생선", "연어", "고등어", "바지락", "굴", "게"],
  2: ["닭가슴살", "돼지고기 안심", "쇠고기 안심"],
  3: ["코티지치즈"],
  4: [],
  5: ["두부", "검정콩", "렌틸콩", "병아리콩"],
  6: ["오이", "수박"],
};

// 식품군별_추천.docx 의 주의 문단 — 고른 식품에 해당하면 안내한다
const FOOD_CAUTIONS = [
  { foods: ["백미"], text: "통곡물보다 식이섬유·미량영양소가 적어 평상시 우선 선택으로 권장하지는 않지만, 투여 초기·증량기이거나 오심·복부팽만·설사가 있는 시기에는 자극이 적어 활용할 수 있어요." },
  { foods: ["렌틸콩", "검정콩", "병아리콩"], text: "영양밀도가 높지만 대장에서 가스를 만들어 복부팽만을 유발할 수 있어요. 투여 초기나 팽만감이 있을 때는 소량부터 드세요." },
  { foods: ["연어", "고등어"], text: "흰살생선보다 지방이 많아 오심·설사·역류가 심할 때는 부담이 될 수 있어요. 그럴 땐 대구 등 흰살생선으로 잠시 바꿔보세요." },
  { foods: ["브로콜리", "양배추", "케일"], text: "영양적으로 우수하지만 일부에서는 장내 발효로 가스와 복부팽만을 일으킬 수 있어요." },
  { foods: ["토마토"], text: "속쓰림·역류 증상을 악화시킬 수 있어요. 속쓰림이 심하면 피하는 편이 좋아요." },
  { foods: ["감귤류"], text: "산미가 속쓰림이나 역류를 유발할 수 있어요." },
  { foods: ["사과", "배", "키위"], text: "설사가 지속되는 동안에는 권하지 않아요." },
  { foods: ["아마씨", "치아씨"], text: "변비가 있을 때 도움이 될 수 있어요." },
  { foods: ["저지방 우유", "무가당 플레인 요거트", "코티지치즈"], text: "유당불내증이 있거나 설사 중이라면 락토프리 제품으로 대체하세요." },
  { foods: ["오트밀", "통밀빵", "통밀파스타"], text: "가당 제품·첨가당이 많은 제품은 피하고 무가당·저나트륨 제품으로 고르세요." },
];

// ── 6대 우선 영양소 라벨링 (식품군별_추천 ★High Priority 기준) ──
const VITAMIN_META = {
  D: { label: "비타민 D", color: "#C4863F", shape: "●" },
  B1: { label: "비타민 B1", color: "#5E7FA6", shape: "◆" },
  B12: { label: "비타민 B12", color: "#8B6BA8", shape: "▲" },
  folate: { label: "엽산", color: "#4C8A5E", shape: "■" },
  iron: { label: "철", color: "#B24A3A", shape: "★" },
  zinc: { label: "아연", color: "#2E8C86", shape: "⬢" },
};

const FOOD_NUTRIENTS = {
  연어: ["D", "B12"], 고등어: ["D", "B12"], 달걀: ["D"], 건표고버섯: ["D"],
  현미: ["B1"], 귀리: ["B1"], 검정콩: ["B1"], 해바라기씨: ["B1"],
  바지락: ["B12", "iron"], 굴: ["B12", "zinc"],
  렌틸콩: ["folate", "iron"], 시금치: ["folate", "iron"], 브로콜리: ["folate"], 콩나물: ["folate"],
  두부: ["iron"], 병아리콩: ["zinc"], 게: ["zinc"], 호박씨: ["zinc"],
};

const ESSENTIAL_FOODS = ["현미", "귀리", "두부", "달걀", "건표고버섯", "시금치", "딸기", "블루베리", "저지방 우유", "무가당 플레인 요거트", "해바라기씨", "호박씨"];

// 결과 화면에서 "그 문항으로 돌아가기" 버튼이 쓰는 내부 단계 번호.
// (화면에 보이는 단계 번호와 다르다. Q1 문항을 없애면서 내부 번호는 2~9로 남겨뒀다)
const STEP_LINKS = {
  form: { key: "form", label: "식사 형태 다시 고르기", step: 2 },
  texture: { key: "texture", label: "식감 조건 완화하기", step: 3 },
  temp: { key: "temp", label: "온도 다시 고르기", step: 4 },
  smell: { key: "smell", label: "향 회피 완화하기", step: 5 },
  taste: { key: "taste", label: "맛 회피 완화하기", step: 6 },
  season: { key: "season", label: "간과 풍미 완화하기", step: 7 },
  cook: { key: "cook", label: "조리 시간 늘리기", step: 8 },
  food: { key: "food", label: "식품 다시 고르기", step: 9 },
};

// blockingReasons()가 돌려주는 키 → 화면 표기 / 되돌아갈 문항
const BLOCK_LABEL = { texture: "식감", temp: "온도", cook: "조리 시간", season: "간과 풍미", avoid: "향·맛 회피" };
const BLOCK_LINK = {
  texture: STEP_LINKS.texture,
  temp: STEP_LINKS.temp,
  cook: STEP_LINKS.cook,
  season: STEP_LINKS.season,
  avoid: STEP_LINKS.smell,
};

const GROUP_ICON = { rice: "🍚", table_main: "🍲", side: "🥗", main: "🍽️" };

// ══════════════════════════════════════════════════════════════════
// 추천 엔진 — 00_추천로직 시트의 단계·랭킹 규칙을 그대로 구현
// ══════════════════════════════════════════════════════════════════

// Q4·Q7이 단일선택에서 복수선택으로 바뀌었다. 예전 호출부가 숫자를 넘겨도 깨지지 않도록
// 배열로 정규화해서 쓴다. (0 또는 빈 배열 = 아직 안 고름 = 조건 없음)
const asIdxList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// [Q5/Q6/Q7] 06_양념마스터 기준으로 메뉴에 붙은 양념 후보를 거른다.
//  · Q5/Q6는 복수선택 AND — 양념 1개가 선택한 회피조건을 "모두" 만족해야 한다.
//  · Q7은 복수선택 OR — 고른 간·풍미 중 하나로라도 쓸 수 있는 양념이면 통과.
//  · 남는 양념이 0개면 그 메뉴는 후보에서 제외한다.
function usableSauces(sauceIds, smellIdx, tasteIdx, seasonIdx) {
  const season = asIdxList(seasonIdx);
  return (sauceIds || [])
    .map((id) => SAUCES[id])
    .filter(Boolean)
    .filter((s) => smellIdx.every((i) => s.q5has[i - 1] === "0"))
    .filter((s) => tasteIdx.every((i) => s.q6has[i - 1] === "0"))
    .filter((s) => season.length === 0 || season.some((i) => s.q7ok[i - 1] === "1"));
}

// [Q3/Q4/Q8] 03_메뉴선택지태그 기준 메뉴 단위 게이트
//  · Q3는 복수선택 OR — 고른 식감 중 하나라도 구현 가능하면 통과
//  · Q4도 복수선택 OR — 고른 온도 중 하나로라도 제공 가능하면 통과
//  · Q8은 "사용자 등급 ≥ 메뉴 최소등급" (분 단위 비교가 아님)
function passesQ3Q4Q8(item, q3Idx, q4Idx, q8Grade) {
  const q4 = asIdxList(q4Idx);
  if (q3Idx.length > 0 && !q3Idx.some((i) => bit(item.q3, i))) return false;
  if (q4.length > 0 && !q4.some((i) => bit(item.q4, i))) return false;
  if (q8Grade && q8Grade < item.q8min) return false;
  return true;
}

// 그 메뉴를 탈락시킨 문항이 무엇인지 되짚는다.
// "고른 식품으로는 만들 수 있는데 다른 조건에 걸린" 경우를 정확히 안내하기 위한 함수.
function blockingReasons(item, a) {
  const out = [];
  if (a.q3Idx.length > 0 && !a.q3Idx.some((i) => bit(item.q3, i))) out.push("texture");
  const q4 = asIdxList(a.q4Idx);
  if (q4.length > 0 && !q4.some((i) => bit(item.q4, i))) out.push("temp");
  if (a.q8Grade && a.q8Grade < item.q8min) out.push("cook");
  if (usableSauces(item.sauceIds, a.smellIdx, a.tasteIdx, a.seasonIdx).length === 0) {
    // Q7(간과 풍미)만 풀어도 살아나면 Q7 탓, 그래도 0개면 Q5·Q6(향·맛 회피) 탓이다
    out.push(usableSauces(item.sauceIds, a.smellIdx, a.tasteIdx, []).length > 0 ? "season" : "avoid");
  }
  return out;
}

function passesAll(item, a) {
  if (!passesQ3Q4Q8(item, a.q3Idx, a.q4Idx, a.q8Grade)) return false;
  return usableSauces(item.sauceIds, a.smellIdx, a.tasteIdx, a.seasonIdx).length > 0;
}

// ── [2차 수정] 주재료 1 / 주재료 2 필수 규칙 ──────────────────────
// 그 메뉴가 실제로 갖고 있는 주재료 칸만 대상으로 한다.
// (주재료 2가 아예 없는 과일 컵·스낵팩 같은 메뉴는 주재료 1만 확인한다)
function mainRoleSlots(item) {
  return ["1", "2"].filter((r) => item.ing.some((i) => i[1] === r));
}
// 각 주재료 칸에서 "최소 1개"가 선택되어 있어야 그 메뉴를 만들 수 있다.
function meetsMainRoles(item, selected) {
  return mainRoleSlots(item).every((role) =>
    item.ing.some((i) => i[1] === role && selected.includes(i[0]))
  );
}
// 부족한 주재료 칸이 무엇인지 (안내 문구용)
function missingMainRoles(item, selected) {
  return mainRoleSlots(item).filter((role) => !item.ing.some((i) => i[1] === role && selected.includes(i[0])));
}
// 이 메뉴에서 주재료로 쓰인 모든 식품 (중복 방지용)
function mainFoodsOf(item) {
  return uniq(item.ing.filter((i) => i[1] === "1" || i[1] === "2").map((i) => i[0]));
}

// 선택 식품과 메뉴의 교집합 (04_메뉴식품의 목록은 "최대 허용 목록", 실제로는 부분집합을 씀)
function scoreMenu(item, selected) {
  const pick = (test) => uniq(item.ing.filter((i) => selected.includes(i[0]) && test(i[1])).map((i) => i[0]));
  const m1Matched = pick((r) => r === "1");
  const m2Matched = pick((r) => r === "2");
  return {
    matched: pick(() => true),
    m1Matched,
    m2Matched,
    mainMatched: uniq([...m1Matched, ...m2Matched]),
    vegMatched: pick((r) => r === "V"),
    etcMatched: pick((r) => !["1", "2", "V"].includes(r)),
  };
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// 랭킹 1: 주재료(1+2) 일치수 → 랭킹 2: 전체 일치수 → 채소 일치수 → 기타 역할 일치수
// [2차 수정] 예전의 "주재료 fallback"은 없앴다.
//   주재료 1·2에서 각각 최소 1개가 반드시 포함되어야 하므로,
//   조건을 못 맞춘 메뉴는 아예 후보가 되지 않는다.
function rankItems(pool, selected, answers) {
  const seedKey = selected.join("|");
  const scored = pool
    .filter((m) => passesAll(m, answers))
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

// usedFoods를 넘기면 이미 쓴 재료가 주재료인 후보는 건너뛴다.
// (부찬 2개가 "시금치나물 + 시금치 된장무침"처럼 같은 재료로 겹치는 것을 막는다)
function pickTop(pool, selected, answers, count, usedFoods) {
  const ranked = rankItems(pool, selected, answers);
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
  // 재료가 겹치지 않는 후보가 없으면 개수를 억지로 채우지 않고 1개만 낸다.
  // (14_상차림구성규칙의 부찬은 1~2개이므로 1개만 나오는 것도 정상)
  if (out.length === 0) take(true, 1);
  return out;
}

// 밥 베이스: F07~F09 상차림에서 "주재료 1(곡류)"을 맡는 자리다.
// primary(그 밥의 이름을 정하는 곡물)가 선택되었는지를 먼저 보고, 나머지 곡류 겹침으로 판단한다.
// 고른 곡류가 하나도 없으면 밥 자체가 없으면 상차림이 성립하지 않으므로
// 기본 흰쌀밥으로 채우되, 결과 화면에서 그 사실을 알려준다.
function pickRice(selected) {
  let best = null;
  let bestScore = 0;
  RICE_BASES.forEach((r) => {
    const s = r.primary.filter((k) => selected.includes(k)).length * 10 + r.keys.filter((k) => selected.includes(k)).length;
    if (s > bestScore) {
      bestScore = s;
      best = r;
    }
  });
  const fallback = best === null;
  const base = best || RICE_BASES[0];
  const used = base.keys.filter((k) => selected.includes(k));
  const grains = used.length > 0 ? used : base.primary;
  return {
    id: base.id,
    name: base.name,
    formId: "F09",
    kind: "rice",
    q8min: 4,
    sauceIds: [],
    fallback,
    // 주재료 1(곡류) 자리를 밥이 채운다
    ing: grains.map((k) => [k, "1"]),
    s: { matched: used, m1Matched: used, m2Matched: [], mainMatched: used, vegMatched: [], etcMatched: [] },
  };
}

// ── 메인 함수 ──────────────────────────────────────────────
// answers = { q1Idx, q2Idx, q3Idx[], q4Idx, smellIdx[], tasteIdx[], seasonIdx, q8Grade }
// [3차 수정] Q1(식사 스타일) 문항을 화면에서 뺐다.
//   q1Idx = 0 은 "Q1 선택지를 전부 고른 것과 같다"는 뜻의 와일드카드로,
//   아래 두 곳에서 Q1 조건 자체를 건너뛴다. 랭킹·주재료·양념 규칙은 그대로다.
//   (나중에 Q1을 되살리고 싶으면 1~3을 넣기만 하면 예전처럼 동작한다)
function buildFoodPlan(answers, selected) {
  const { q1Idx, q2Idx } = answers;
  if (!q2Idx || selected.length === 0) return { items: [], kind: "none", reason: null };

  // Q2 = 5(일반식) → 14_상차림구성규칙에 따라 밥 + (국/찌개/주찬) 1 + 부찬 1~2
  // 주재료 1은 밥(곡류)이, 주재료 2는 국·찌개·주찬·부찬이 담당한다.
  if (q2Idx === 5) {
    if (q1Idx && q1Idx !== 3) return { items: [], kind: "table", reason: "q1" };
    const rice = pickRice(selected);
    const built = TABLE_SETTINGS
      .filter((t) => {
        const q4 = asIdxList(answers.q4Idx);
        return (q4.length === 0 || q4.some((i) => bit(t.q4, i))) && (!answers.q8Grade || answers.q8Grade >= t.q8min);
      })
      .map((t) => {
        const mainPool = SUBMENUS.filter((m) => t.mainForms.includes(m.formId));
        const sidePool = SUBMENUS.filter((m) => t.sideForms.includes(m.formId));
        const main = pickTop(mainPool, selected, answers, 1)[0];
        if (!main) return null;
        const sides = pickTop(sidePool, selected, answers, 2, mainFoodsOf(main));
        if (sides.length === 0) return null;
        const items = [
          { ...rice, label: "밥" },
          { ...main, kind: "table_main", label: t.mainRoleLabel },
          ...sides.map((s, i) => ({ ...s, kind: "side", label: sides.length > 1 ? `부찬 ${i + 1}` : "부찬" })),
        ];
        const score = main.s.matched.length + sides.reduce((a, s) => a + s.s.matched.length, 0);
        return { setting: t, items, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
    if (built.length === 0) return { items: [], kind: "table", reason: "empty" };
    return { items: built[0].items, kind: "table", setting: built[0].setting, riceFallback: rice.fallback, reason: null };
  }

  // 그 외 → 01_메뉴마스터의 단독 완성 메뉴에서 Q1·Q2가 모두 맞는 것만
  const pool = MENUS.filter((m) => (!q1Idx || m.q1 === q1Idx) && bit(m.q2, q2Idx));
  if (pool.length === 0) return { items: [], kind: "single", reason: "combo" };
  const picked = pickTop(pool, selected, answers, 3);
  if (picked.length === 0) {
    // ① 고른 식품으로 주재료 조건까지 만족하는 메뉴는 있는데,
    //    식감·온도·간·조리시간 같은 다른 문항에 걸려 전부 빠진 경우.
    //    이걸 먼저 확인하지 않으면 "주재료를 안 골랐다"는 엉뚱한 안내가 나간다.
    //    (예: 현미·연어를 골랐는데 현미를 쓰는 덮밥이 식감 조건에서 전부 걸러지면,
    //     남는 후보가 오트밀을 주재료 1로 쓰는 샐러드볼뿐이라 "주재료 1 미선택"으로 보인다)
    const blockedByAnswers = pool.filter((m) => meetsMainRoles(m, selected) && !passesAll(m, answers));
    if (blockedByAnswers.length > 0) {
      const tally = {};
      blockedByAnswers.forEach((m) => blockingReasons(m, answers).forEach((k) => { tally[k] = (tally[k] || 0) + 1; }));
      const blocked = Object.entries(tally)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, count }));
      return { items: [], kind: "single", reason: "filtered", blocked, blockedCount: blockedByAnswers.length };
    }
    // ② 다른 조건은 통과했지만 주재료 칸을 못 채운 경우
    const nearMiss = pool.filter((m) => passesAll(m, answers) && !meetsMainRoles(m, selected));
    if (nearMiss.length > 0) {
      // 후보 전부에서 공통으로 비어 있는 칸만 짚어준다.
      const needs = ["1", "2"].filter((role) => nearMiss.every((m) => missingMainRoles(m, selected).includes(role)));
      if (needs.length > 0) {
        // 그 칸을 채울 수 있는 실제 식품 이름까지 알려준다.
        // ("주재료 1을 안 골랐다"가 아니라 "남은 메뉴엔 오트밀이 필요하다"가 정확한 설명이다)
        const options = {};
        needs.forEach((role) => {
          options[role] = uniq(nearMiss.flatMap((m) => m.ing.filter((i) => i[1] === role).map((i) => i[0])));
        });
        return { items: [], kind: "single", reason: "mainRole", needs, options };
      }
    }
    return { items: [], kind: "single", reason: "empty" };
  }
  return { items: picked.map((m, i) => ({ ...m, kind: "main", label: `추천 ${i + 1}` })), kind: "single", reason: null };
}

// ── 선택지 가용성 ────────────────────────────────────────────
// 어떤 답변 조합이 DB상 메뉴 0개로 이어지는지 미리 계산해서, 그 선택지는 화면에서 막는다.
// (여기서는 아직 식품을 고르기 전이라 주재료 1·2 규칙은 적용하지 않는다)

// 주어진 응답으로 성립하는 메뉴/상차림이 하나라도 있는지.
// 메뉴 태그(엑셀)뿐 아니라 마지막 단계에 보여줄 식품(식품선별.docx)까지 함께 본다.
// 식품 표와 메뉴 표가 서로 다른 문서라, 메뉴는 남아도 그 메뉴에 넣을 식품이
// 하나도 안 보이는 조합이 생긴다. 그런 선택지는 미리 막아야 한다.
function hasAnyCandidate(a) {
  // 식감·온도가 모두 정해졌을 때만 식품 교집합까지 확인한다
  let foods = null;
  if (a.q3Idx.length > 0 && asIdxList(a.q4Idx).length > 0) {
    foods = new Set(
      Object.values(buildFoodCandidates(a.q3Idx, a.q4Idx, a.smellIdx, a.tasteIdx)).flat().map((f) => f.name)
    );
    if (foods.size === 0) return false;
  }
  // 주재료 칸이 있는 메뉴는 그 칸을 채울 식품이 화면에 보여야 의미가 있다
  const overlaps = (m) => {
    if (!foods) return true;
    const slots = mainRoleSlots(m);
    if (slots.length > 0) return slots.every((r) => m.ing.some((i) => i[1] === r && foods.has(i[0])));
    return m.ing.some((i) => foods.has(i[0]));
  };

  if (a.q2Idx === 5) {
    if (a.q1Idx && a.q1Idx !== 3) return false;
    return TABLE_SETTINGS.some((t) => {
      const q4 = asIdxList(a.q4Idx);
      if (q4.length > 0 && !q4.some((i) => bit(t.q4, i))) return false;
      if (a.q8Grade && a.q8Grade < t.q8min) return false;
      const ok = (forms) => SUBMENUS.some((m) => forms.includes(m.formId) && passesAll(m, a) && overlaps(m));
      return ok(t.mainForms) && ok(t.sideForms);
    });
  }
  return MENUS.some((m) => (!a.q1Idx || m.q1 === a.q1Idx) && (!a.q2Idx || bit(m.q2, a.q2Idx)) && passesAll(m, a) && overlaps(m));
}

// 복수선택 문항에서 그 선택지를 지금 고를 수 있는지.
// 두 조건을 모두 만족해야 열어준다.
//  (1) 그 선택지 하나만 골랐을 때도 결과가 있어야 한다.
//      → Q3(식감)처럼 OR로 넓어지는 문항에서, 혼자서는 만들 수 있는 메뉴가 없는 선택지가
//        옆의 다른 선택지 덕에 갑자기 열리는 일을 막는다. 어차피 결과에 기여하지 못하는 선택지다.
//  (2) 지금까지 고른 것에 더했을 때도 결과가 있어야 한다.
//      → Q5(향)·Q6(맛)처럼 AND로 좁혀지는 문항에서, 조합했을 때 양념이 0개가 되는 선택지를 막는다.
// 이미 고른 선택지는 해제할 수 있어야 하므로 항상 열어둔다.
function multiOptionEnabled(a, key, v) {
  if (a[key].includes(v)) return true;
  return hasAnyCandidate({ ...a, [key]: [v] }) && hasAnyCandidate({ ...a, [key]: [...a[key], v] });
}

// 각 문항에서 아직 고를 수 있는 선택지 번호 집합
function optionAvailability(a) {
  const single = (key, values) => new Set(values.filter((v) => hasAnyCandidate({ ...a, [key]: v })));
  const multi = (key, values) => new Set(values.filter((v) => multiOptionEnabled(a, key, v)));
  return {
    q2: single("q2Idx", [1, 2, 3, 4, 5]),
    q3: multi("q3Idx", [1, 2, 3, 4, 5, 6, 7]),
    q4: multi("q4Idx", [1, 2, 3]),
    q5: multi("smellIdx", [1, 2, 3, 4, 5, 6]),
    q6: multi("tasteIdx", [1, 2, 3]),
    q7: multi("seasonIdx", [1, 2, 3]),
    q8: single("q8Grade", [1, 2, 3, 4]),
  };
}

// ── 8단계 식품 후보 ──────────────────────────────────────────
// 기본 배치는 식품선별.docx(질문 3·4·6번)를 따르고,
// docx에 배치가 없는 식감(예: "바삭 — 배치 식재료 없음")은 09_식품저작감의 판정으로 보완한다.
//   tier "base"  : docx가 그 식감에 배치한 식품 + 액체류
//   tier "cook"  : docx엔 없지만 09_식품저작감에서 A·C 판정을 받은 식품 (조리법이 필요)
//   tier "always": 식품군별_추천.docx의 ★필수 식품 (식감 답변과 무관하게 노출)
// 온도(Q4)·맛(Q6)·향(Q5) 회피는 필수 식품에도 예외 없이 적용한다.
function buildFoodCandidates(q3Idx, q4Idx, smellIdx, tasteIdx) {
  const avoid = new Set();
  smellIdx.forEach((i) => (SMELL_AVOID_FOOD_MAP[i] || []).forEach((f) => avoid.add(f)));
  tasteIdx.forEach((i) => (TASTE_AVOID_FOOD_MAP[i] || []).forEach((f) => avoid.add(f)));
  // 온도를 여러 개 고르면 각 온도에 배치된 식품의 합집합을 쓴다
  const q4List = asIdxList(q4Idx);
  const tempOk = q4List.length > 0 ? new Set(q4List.flatMap((i) => TEMP_FOOD_MAP[i] || [])) : null;

  const placed = new Set(DOCX_NEUTRAL_FOODS);
  q3Idx.forEach((i) => (DOCX_TEXTURE_MAP[i] || []).forEach((f) => placed.add(f)));

  const grouped = {};
  FOOD_GROUP_ORDER.forEach((g) => (grouped[g] = []));
  FOODS.forEach((f) => {
    if (avoid.has(f.name)) return;
    if (tempOk && !tempOk.has(f.name)) return;

    let tier = null;
    let hintIdx = null;
    if (placed.has(f.name)) tier = "base";
    else {
      const hit = q3Idx.find((i) => bit(f.tex, i) || bit(f.texCond, i));
      if (hit) { tier = "cook"; hintIdx = hit; }
      else if (ESSENTIAL_FOODS.includes(f.name)) tier = "always";
    }
    if (!tier) return;

    grouped[f.group] = grouped[f.group] || [];
    grouped[f.group].push({
      name: f.name,
      tier,
      essential: ESSENTIAL_FOODS.includes(f.name),
      hint: hintIdx ? (TEXTURE_COOK_HINT[f.name] || {})[String(hintIdx)] || null : null,
    });
  });
  return grouped;
}

// "또 뭐가 있지?" 한 회차에 보여줄 개수
const MORE_PAGE_SIZE = 5;

// 이미 보여준 메뉴(seen)는 빼고 무작위로 count개를 뽑는다.
// 남은 후보가 없으면 seen을 비우고 처음부터 다시 돌린다.
// (순서만 바뀐 같은 목록을 다시 보여주지 않기 위한 장치)
// 조합ID가 아니라 메뉴명을 기준으로 센다. F05-01~04처럼 주재료만 다르고
// 이름이 똑같은 메뉴가 여러 개 있어서, ID로 세면 화면에는 같은 이름이 또 뜬다.
function drawMenus(pool, seen, count, justShown) {
  let rest = pool.filter((m) => !seen.has(m.name));
  let cycle = new Set(seen);
  if (rest.length === 0) {
    // 후보를 다 돌았으면 처음부터 다시 시작한다.
    // 다만 방금 화면에 있던 묶음이 연달아 또 나오면 안 바뀐 것처럼 보이므로,
    // 후보가 충분할 때는 그 묶음만 이번 회차에서 제외한다.
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

// 그 메뉴가 지금 답변(형태·식감·온도·간·조리시간)을 전부 만족하는지.
// "또 뭐가 있지?"에서 조건을 푼 메뉴가 섞였는지 판단할 때만 쓴다.
// 서브메뉴에는 Q2(형태) 태그가 없으므로 그 항목은 건너뛴다.
function matchesAllAnswers(item, a) {
  if (item.q2) {
    if (a.q2Idx && !bit(item.q2, a.q2Idx)) return false;
  } else if (a.q2Idx && a.q2Idx !== 5) {
    // 서브메뉴는 상차림의 구성요소라, 일반식을 고르지 않았다면 형태가 맞지 않는다
    return false;
  }
  return passesAll(item, a);
}

// 서브메뉴가 상차림에서 맡는 자리 (형태ID 앞글자 기준)
const SUB_ROLE_BY_FORM = { G: "국·탕", J: "찌개·전골", M: "주찬", B: "부찬" };
const subRoleLabel = (item) => (item.q2 ? null : SUB_ROLE_BY_FORM[item.formId[0]] || null);

// 고른 식품에 해당하는 식품군별_추천.docx 주의 문단
function cautionsFor(selected) {
  return FOOD_CAUTIONS
    .map((c) => ({ ...c, hit: c.foods.filter((f) => selected.includes(f)) }))
    .filter((c) => c.hit.length > 0);
}

function itemVitamins(item, selected) {
  const set = new Set();
  item.ing.forEach((i) => {
    if (!selected.includes(i[0])) return;
    (FOOD_NUTRIENTS[i[0]] || []).forEach((v) => set.add(v));
  });
  return [...set];
}

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

// 원문에서 굵게 표시된 **구간**을 굵은 글씨로 그린다
function RichText({ text }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: C.ink }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// 권고 한 줄. 식욕처럼 "제목: 설명" 구조인 항목은 첫줄을 강조해서 보여준다.
function GuidePoint({ point }) {
  const head = typeof point === "string" ? null : point.head;
  const body = typeof point === "string" ? point : point.body;
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span style={{ color: C.apricot }}>#</span>
      <span>
        {head && (
          <strong className="block mb-1" style={{ color: C.sageDeep }}>
            {head}
          </strong>
        )}
        {body}
      </span>
    </li>
  );
}

function WeightTrendChart({ table, userWeek, userRate }) {
  const W = 480;
  const H = 300;
  const P = { l: 40, r: 14, t: 26, b: 42 };

  const weeks = table.weeks;
  const maxWeek = weeks[weeks.length - 1];
  const entries = Object.entries(table.series);

  const dataMax = Math.max(...entries.flatMap(([, vs]) => vs.map(hiOf)));
  const yMax = Math.max(5, Math.ceil((dataMax + 2) / 5) * 5);

  const x = (w) => P.l + (w / maxWeek) * (W - P.l - P.r);
  const y = (v) => P.t + (v / yMax) * (H - P.t - P.b);

  const yTicks = [];
  for (let v = 0; v <= yMax; v += 5) yTicks.push(v);

  const bandPath = (vs) =>
    [
      ...weeks.map((w, i) => `${i === 0 ? "M" : "L"}${x(w)},${y(hiOf(vs[i]))}`),
      ...weeks.map((_, i) => {
        const j = weeks.length - 1 - i;
        return `L${x(weeks[j])},${y(loOf(vs[j]))}`;
      }),
      "Z",
    ].join(" ");

  const linePath = (vs) => weeks.map((w, i) => `${i === 0 ? "M" : "L"}${x(w)},${y(midOf(vs[i]))}`).join(" ");

  // 내 위치는 그래프 범위 안에 들어올 때만 찍는다 (체중이 늘었거나 연구 기간을 넘으면 제외)
  const userVisible =
    Number.isFinite(userWeek) && Number.isFinite(userRate) &&
    userWeek > 0 && userWeek <= maxWeek && userRate >= 0 && userRate <= yMax;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} role="img" aria-label="주차별 평균 누적 체중감량률 그래프">
        <text x={6} y={12} fontSize={10} fill={C.ink60}>체중 변화(%)</text>

        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)}
              stroke={v === 0 ? C.ink60 : C.sagePale}
              strokeWidth={1}
              strokeDasharray={v === 0 ? "4 3" : undefined}
              opacity={v === 0 ? 0.5 : 1}
            />
            <text x={P.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#9A988E" fontFamily="IBM Plex Mono, monospace">
              {v === 0 ? "0" : `-${v}`}
            </text>
          </g>
        ))}

        {entries.map(([label, vs], si) => {
          const color = SERIES_COLORS[si % SERIES_COLORS.length];
          return (
            <g key={label}>
              <path d={bandPath(vs)} fill={color} opacity={0.14} />
              <path d={linePath(vs)} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {weeks.map((w, i) => (
                <circle key={w} cx={x(w)} cy={y(midOf(vs[i]))} r={2.4} fill={color} />
              ))}
            </g>
          );
        })}

        {userVisible && (
          <g>
            <circle cx={x(userWeek)} cy={y(userRate)} r={6} fill="#fff" stroke={C.apricotDeep} strokeWidth={2.5} />
            <text x={x(userWeek)} y={y(userRate) - 11} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.apricotDeep}>나</text>
          </g>
        )}

        {weeks.map((w) => (
          <text key={w} x={x(w)} y={H - P.b + 16} textAnchor="middle" fontSize={11} fill="#9A988E" fontFamily="IBM Plex Mono, monospace">
            {w}
          </text>
        ))}
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

      {!userVisible && (
        <p className="text-xs mt-2" style={{ color: C.ink60 }}>
          입력하신 주차·체중은 이 연구의 관찰 범위를 벗어나서 그래프에 표시하지 않았어요.
        </p>
      )}
    </div>
  );
}

// 주차별 누적 체중감량률 표. 비교 기준이 된 주차 행을 강조한다.
function WeightTableView({ table, closestWeek }) {
  const entries = Object.entries(table.series);
  const cell = { padding: "7px 10px", borderBottom: `1px solid ${C.sagePale}` };
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.sagePale}`, background: "#fff" }}>
      <table className="w-full text-xs" style={{ borderCollapse: "collapse", minWidth: entries.length > 1 ? 320 : 220 }}>
        <thead>
          <tr style={{ background: C.sagePale, color: C.sageDeep }}>
            <th style={{ ...cell, textAlign: "left", fontWeight: 600 }}>주차</th>
            {entries.map(([label]) => (
              <th key={label} style={{ ...cell, textAlign: "right", fontWeight: 600 }}>
                {entries.length > 1 ? label : "누적 체중감량률"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.weeks.map((w, i) => {
            const on = w === closestWeek;
            return (
              <tr key={w} style={{ background: on ? "#FFF3EC" : "transparent" }}>
                <td className="font-mono" style={{ ...cell, color: on ? C.apricotDeep : C.ink60, fontWeight: on ? 700 : 400 }}>{w}</td>
                {entries.map(([label, vs]) => (
                  <td key={label} className="font-mono" style={{ ...cell, textAlign: "right", color: on ? C.apricotDeep : C.ink, fontWeight: on ? 700 : 400 }}>
                    {rangeLabel(vs[i])}
                  </td>
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

// 일반적 권고사항 — 원문의 "권장할 요소 / 줄이거나 피할 요소" 2열 표
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
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-semibold">{section.title}</p>
          <p className="text-xs mt-1" style={{ color: C.ink60 }}>{section.summary}</p>
        </div>
        {open ? <ChevronUp size={18} style={{ color: C.ink60 }} /> : <ChevronDown size={18} style={{ color: C.ink60 }} />}
      </button>
      {open && (
        <div className="px-6 pt-6 pb-6 md:px-8 md:pb-8 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.sagePale}` }}>
          {section.blocks.map((b, i) =>
            b.type === "table" ? (
              <GoodBadTable key={i} good={b.good} avoid={b.avoid} />
            ) : (
              <ul key={i} className="flex flex-col gap-4 m-0 p-0 list-none">
                <GuidePoint point={b.text} />
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}

// 선택지 없이 전체 내용을 펼쳐 보여주고, 섹션 단위로 접을 수 있게 한다
function GeneralGuideView() {
  const [openIds, setOpenIds] = useState(() => GENERAL_GUIDE.map((s) => s.id));
  const allOpen = openIds.length === GENERAL_GUIDE.length;
  const toggle = (id) => setOpenIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <>
      <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: C.sageDeep }}>GENERAL</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold leading-snug">일반적 권고사항</h2>
        <p className="text-sm mt-2" style={{ color: C.ink60 }}>
          투여 단계와 관계없이 공통으로 지켜야 할 내용이에요. 제목을 눌러 접거나 펼칠 수 있어요.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpenIds(allOpen ? [] : GENERAL_GUIDE.map((s) => s.id))}
          className="chip px-4 py-2 rounded-full text-xs font-medium"
          style={{ background: C.sagePale, color: C.sageDeep }}
        >
          {allOpen ? "전체 접기" : "전체 펼치기"}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {GENERAL_GUIDE.map((s) => (
          <GeneralGuideSection key={s.id} section={s} open={openIds.includes(s.id)} onToggle={() => toggle(s.id)} />
        ))}
      </div>
    </>
  );
}

// 사진이 없으면 식품군 아이콘으로 대체한다 (경로 방식으로 바꿨을 때 파일이 빠진 경우 대비)
function PortionThumb({ imgKey, alt }) {
  const [failed, setFailed] = useState(false);
  const src = PORTION_IMAGES[imgKey];
  const box = {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 14,
    background: "#fff",
    border: `1px solid ${C.sagePale}`,
  };
  if (!src || failed) {
    return (
      <div className="text-xs" style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink60 }}>
        사진 없음
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ ...box, objectFit: "contain", display: "block" }}
    />
  );
}

// docx 원본 "1인 1회 분량" 표 + "권장식사패턴" 표를 접었다 펼치는 카드로 보여준다
function PortionReferenceCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-6 py-5 md:px-8 md:py-6 text-left">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>
          🍽️
        </div>
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
                  <p className="text-xs font-semibold flex items-center gap-1.5 mb-3" style={{ color: C.sageDeep }}>
                    <span>{g.icon}</span>{g.name}
                  </p>
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

          <p className="text-xs leading-relaxed" style={{ color: C.ink60 }}>
            {PORTION_REFERENCE.footnote}<br />{PORTION_REFERENCE.source}
          </p>

          <div>
            <p className="font-display text-base font-semibold mb-3">{CALORIE_PATTERN.title}</p>
            <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.sagePale}`, background: "#fff" }}>
              <table className="w-full text-xs" style={{ borderCollapse: "collapse", minWidth: 460 }}>
                <thead>
                  <tr style={{ background: C.sagePale, color: C.sageDeep }}>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600 }}>열량(kcal)</th>
                    {CALORIE_PATTERN.columns.map((c) => (
                      <th key={c} style={{ padding: "8px 10px", textAlign: "right", fontWeight: 600 }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CALORIE_PATTERN.rows.map((r) => (
                    <tr key={r.kcal}>
                      <td className="font-mono" style={{ padding: "7px 10px", fontWeight: 600, borderTop: `1px solid ${C.sagePale}` }}>{r.kcal}</td>
                      {r.values.map((v, i) => (
                        <td key={i} className="font-mono" style={{ padding: "7px 10px", textAlign: "right", borderTop: `1px solid ${C.sagePale}` }}>{v}</td>
                      ))}
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

// 양념 칩. 누르면 06_양념마스터의 "구성 예시"(무엇으로 만드는지)를 펼쳐 보여준다.
function SauceChips({ sauces }) {
  const [openId, setOpenId] = useState(null);
  const open = sauces.find((s) => s.id === openId);
  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: C.ink60 }}>
        오늘 조건에 맞는 양념
        <span className="font-normal"> — 눌러서 무엇으로 만드는지 확인해보세요</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sauces.map((s) => {
          const on = s.id === openId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(on ? null : s.id)}
              className="chip text-xs px-2.5 py-1 rounded-full"
              style={{ background: on ? C.apricot : "#FFF3EC", color: on ? "#fff" : C.apricotDeep }}
            >
              {s.name}
            </button>
          );
        })}
      </div>
      {open && (
        <p className="text-xs leading-relaxed mt-2 rounded-xl px-3 py-2" style={{ background: "#FFF3EC", color: C.apricotDeep }}>
          <strong>{open.name}</strong>
          {" — "}
          {open.parts && open.parts !== "없음"
            ? `${open.parts} 으로 만들어요.`
            : "따로 양념하지 않고 재료 본연의 맛으로 드세요."}
        </p>
      )}
    </div>
  );
}

function MenuToggleCard({ item, selected, sauces, expanded, onToggle }) {
  // 고른 식품 중 이 메뉴에 실제로 쓰이는 재료를 역할(주재료 1 / 주재료 2 / 채소 …)별로 묶는다
  const byRole = ROLE_ORDER.map((role) => ({
    role,
    foods: uniq(item.ing.filter((i) => i[1] === role && selected.includes(i[0])).map((i) => i[0])),
  })).filter((g) => g.foods.length > 0);
  const vitamins = itemVitamins(item, selected);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, fontSize: 22, background: C.sagePale }}>
          {GROUP_ICON[item.kind] || "🍽️"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {item.label ? (
              <span className="font-mono text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>{item.label}</span>
            ) : null}
            {item.name}
          </p>
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: C.ink60 }}>
            <Clock size={12} />
            {COOK_GRADE_LABEL[item.q8min - 1]} 이상 필요
          </p>
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
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{
                        background: g.role === "1" || g.role === "2" ? C.sage : C.sagePale,
                        color: g.role === "1" || g.role === "2" ? "#fff" : C.sageDeep,
                      }}
                    >
                      {ROLE_LABEL[g.role]}
                    </span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                      {g.foods.map((n) => <FoodLabel key={n} name={n} />)}
                    </span>
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
  const [flowType, setFlowType] = useState(null); // "food" | "guide" | null(인트로)
  const [currentStep, setCurrentStep] = useState(0);
  const [guideCategory, setGuideCategory] = useState(null);
  const [guideAnswer, setGuideAnswer] = useState(null);

  // "체중" 가이드 카드 전용 입력값
  const [guideInitialWeight, setGuideInitialWeight] = useState("");
  const [guideCurrentWeight, setGuideCurrentWeight] = useState("");
  const [guideDrug, setGuideDrug] = useState("wegovy");
  const [guideWeeks, setGuideWeeks] = useState("");
  const [guideDiabetes, setGuideDiabetes] = useState("");

  // 식품 선택 흐름 — 값은 15_문항정의의 "선택지번호"를 그대로 저장한다 (0 = 미선택)
  // Q1은 문항을 없앴으므로 항상 0(= Q1 전체 선택과 동일)으로 고정한다.
  const q1Idx = 0;
  const [q2Idx, setQ2Idx] = useState(0);
  const [q3Idx, setQ3Idx] = useState([]);
  const [q4Idx, setQ4Idx] = useState([]);
  const [smellIdx, setSmellIdx] = useState([]);
  const [smellAllOk, setSmellAllOk] = useState(false);
  const [tasteIdx, setTasteIdx] = useState([]);
  const [tasteAllOk, setTasteAllOk] = useState(false);
  const [seasonIdx, setSeasonIdx] = useState([]);
  const [q8Grade, setQ8Grade] = useState(0);

  const [foodSelection, setFoodSelection] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  // 결과 화면의 "…완화하기" 버튼으로 문항에 돌아온 상태인지.
  // true면 각 문항에 "결과로 바로 가기" 지름길을 띄운다.
  const [returnToResult, setReturnToResult] = useState(false);
  const [moreMenus, setMoreMenus] = useState([]);
  const [moreSeen, setMoreSeen] = useState(() => new Set());

  const answers = useMemo(
    () => ({ q1Idx, q2Idx, q3Idx, q4Idx, smellIdx, tasteIdx, seasonIdx, q8Grade }),
    [q2Idx, q3Idx, q4Idx, smellIdx, tasteIdx, seasonIdx, q8Grade]
  );

  // 체중감량률 계산
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
    // 마운자로는 용량별로, 위고비는 단일 값으로 평균 감량률을 보여준다
    const averages = Object.entries(table.series).map(([label, values]) => ({
      dose: label === "관찰 구간" ? "" : ` ${label}`,
      value: rangeLabel(values[idx]),
    }));
return {
      lossRate,
      closestWeek,
      averages,
      note: WEIGHT_STUDY_NOTES[guideDrug][key],
      table,
      meta: WEIGHT_FIGURE_META[guideDrug][key],
    };
  }, [guideInitialWeight, guideCurrentWeight, guideDrug, guideWeeks, guideDiabetes]);

  // 각 단계에서 아직 고를 수 있는 선택지 (DB상 결과가 0개가 되는 선택은 막는다)
  const avail = useMemo(() => optionAvailability(answers), [answers]);

  const foodCandidates = useMemo(
    () => buildFoodCandidates(q3Idx, q4Idx, smellIdx, tasteIdx),
    [q3Idx, q4Idx, smellIdx, tasteIdx]
  );

  const plan = useMemo(() => buildFoodPlan(answers, foodSelection), [answers, foodSelection]);

  // 이전 단계로 돌아가 답을 바꾸면, 그 때문에 성립하지 않게 된 "뒤쪽" 답을 나중 문항부터 하나씩 비운다.
  // (예: 4단계에서 발효향 회피를 추가하면 이미 골라둔 6단계 '양념이 필요해요'가 무효가 된다)
  useEffect(() => {
    if (flowType !== "food") return;
    if (hasAnyCandidate(answers)) return;
    if (q8Grade) { setQ8Grade(0); return; }
    if (seasonIdx.length) { setSeasonIdx([]); return; }
    if (q4Idx.length) { setQ4Idx([]); return; }
    if (q2Idx) { setQ2Idx(0); return; }
    setQ3Idx([]);
  }, [flowType, answers, q2Idx, q4Idx, seasonIdx, q8Grade]);

  // 식감·회피 답을 바꿔서 후보에서 빠진 식품은 선택 목록에서도 빼준다.
  // (그대로 두면 화면에는 안 보이는데 매칭에는 쓰여서 결과가 설명되지 않는다)
  useEffect(() => {
    const shown = new Set(Object.values(foodCandidates).flat().map((f) => f.name));
    setFoodSelection((prev) => (prev.every((n) => shown.has(n)) ? prev : prev.filter((n) => shown.has(n))));
  }, [foodCandidates]);

  const sauceFor = (item) => usableSauces(item.sauceIds, smellIdx, tasteIdx, seasonIdx);
  const cautions = useMemo(() => cautionsFor(foodSelection), [foodSelection]);

  // 추천이 0개일 때 보여줄 안내 문구와, 되돌아갈 문항 버튼 목록
  const emptyGuide = useMemo(() => {
    switch (plan.reason) {
      case "combo":
        return { text: "고르신 식사 형태에 해당하는 메뉴가 DB에 없어요. 다른 형태를 골라보세요.", jumps: [STEP_LINKS.form] };
      case "q1":
        return { text: "일반식 상차림은 밥·주찬·부찬을 갖춘 형태에서만 구성할 수 있어요.", jumps: [STEP_LINKS.form] };
      case "filtered": {
        const names = (plan.blocked || []).map((b) => BLOCK_LABEL[b.key]).filter(Boolean);
        const jumps = [];
        (plan.blocked || []).forEach((b) => {
          const link = BLOCK_LINK[b.key];
          if (link && !jumps.some((j) => j.key === link.key)) jumps.push(link);
        });
        return {
          text: `고르신 식품으로 만들 수 있는 메뉴가 ${plan.blockedCount}가지 있는데, 오늘 고르신 ${names.join(" · ")} 조건에 걸려 모두 빠졌어요. 아래 조건을 완화하면 다시 나타나요.`,
          jumps: jumps.length > 0 ? jumps : [STEP_LINKS.food],
        };
      }
      case "mainRole": {
        const parts = (plan.needs || []).map((r) => {
          const foods = (plan.options || {})[r] || [];
          return foods.length > 0 ? `${ROLE_LABEL[r]}로 쓸 수 있는 식품(${foods.join(", ")})` : ROLE_LABEL[r];
        });
        return {
          text: `지금 남은 후보 메뉴들은 ${parts.join("와 ")} 중 최소 한 가지가 필요한데 아직 고르지 않으셨어요. 다른 주재료를 이미 고르셨더라도, 그 식품을 쓰는 메뉴가 식감·온도·간·조리시간 조건에서 걸러졌을 수 있어요.`,
          jumps: [STEP_LINKS.food, STEP_LINKS.texture, STEP_LINKS.season, STEP_LINKS.cook],
        };
      }
      case "empty":
        return {
          text: "고르신 조건과 식품으로 만들 수 있는 메뉴를 찾지 못했어요. 곡류·단백질 식품을 몇 가지 더 고르거나, 아래 조건을 조금 완화해 보세요.",
          jumps: [STEP_LINKS.food, STEP_LINKS.texture, STEP_LINKS.season, STEP_LINKS.cook],
        };
      default:
        return { text: "조건에 맞는 메뉴를 찾지 못했어요.", jumps: [STEP_LINKS.food] };
    }
  }, [plan]);

  // "또 뭐가 있지?" 후보군.
  // 고른 식품으로 실제 만들 수 있는 메뉴만 남긴다 —
  //  · 주재료 1·2 규칙을 추천 메뉴와 똑같이 적용하고
  //  · Q5/Q6(향·맛) 회피 조건도 그대로 지킨다
  //  · 대신 형태·식감·온도·간·조리시간 조건은 풀어서 폭을 넓힌다
  // 위에 이미 추천된 메뉴는 중복이라 뺀다.
  const morePool = useMemo(() => {
    if (foodSelection.length === 0) return [];
    const already = new Set(plan.items.map((i) => i.id));
    // 단독 완성 메뉴(01_메뉴마스터) + 국·찌개·주찬·부찬(10_서브메뉴마스터)을 함께 본다
    return [...MENUS, ...SUBMENUS].filter(
      (m) =>
        !already.has(m.id) &&
        usableSauces(m.sauceIds, smellIdx, tasteIdx, []).length > 0 &&
        meetsMainRoles(m, foodSelection) &&
        m.ing.some((i) => foodSelection.includes(i[0]))
    );
  }, [foodSelection, smellIdx, tasteIdx, plan]);

  // 화면에 뜬 메뉴 중 지금 답변 조건을 벗어난 게 하나라도 있으면 그때만 안내한다
  const moreRelaxed = useMemo(
    () => moreMenus.some((m) => !matchesAllAnswers(m, answers)),
    [moreMenus, answers]
  );

  // 화면에 뜨는 이름 기준 개수 (같은 이름의 변형은 하나로 센다)
  const moreTotal = useMemo(() => uniq(morePool.map((m) => m.name)).length, [morePool]);

  // 후보군이 바뀌면 첫 회차를 새로 뽑는다
  useEffect(() => {
    const { picked, seen } = drawMenus(morePool, new Set(), MORE_PAGE_SIZE);
    setMoreMenus(picked);
    setMoreSeen(seen);
  }, [morePool]);

  // "더 볼래!" — 이번 사이클에 안 나온 메뉴 중에서만 다음 묶음을 뽑고,
  // 다 돌면 같은 후보군으로 새 사이클을 시작한다 (버튼은 계속 살아 있다)
  const drawMoreMenus = () => {
    const { picked, seen } = drawMenus(morePool, moreSeen, MORE_PAGE_SIZE, new Set(moreMenus.map((m) => m.name)));
    setMoreMenus(picked);
    setMoreSeen(seen);
  };

  const toggleIn = (setter) => (v) => setter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const toggleTexture = toggleIn(setQ3Idx);
  const toggleTemp = toggleIn(setQ4Idx);
  const toggleSeason = toggleIn(setSeasonIdx);
  const toggleSmell = (v) => {
    setSmellAllOk(false);
    setSmellIdx((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };
  const toggleTaste = (v) => {
    setTasteAllOk(false);
    setTasteIdx((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };
  const setSmellChoices = (values) => {
    setSmellAllOk(false);
    setSmellIdx(values);
  };
  const setTasteChoices = (values) => {
    setTasteAllOk(false);
    setTasteIdx(values);
  };
  const toggleFood = toggleIn(setFoodSelection);

  // 8단계 전체선택 — 지금 화면에 보이는 식품만 대상으로 한다
  const shownFoods = useMemo(
    () => Object.values(foodCandidates).flat().map((f) => f.name),
    [foodCandidates]
  );
  const allFoodsPicked = shownFoods.length > 0 && shownFoods.every((n) => foodSelection.includes(n));
  const toggleAllFoods = () =>
    setFoodSelection(allFoodsPicked ? [] : shownFoods);
  const groupFoodNames = (group) => (foodCandidates[group] || []).map((f) => f.name);
  const isGroupPicked = (group) => {
    const names = groupFoodNames(group);
    return names.length > 0 && names.every((n) => foodSelection.includes(n));
  };
  const toggleGroupFoods = (group) => {
    const names = groupFoodNames(group);
    setFoodSelection((prev) =>
      names.every((n) => prev.includes(n))
        ? prev.filter((n) => !names.includes(n))
        : [...prev, ...names.filter((n) => !prev.includes(n))]
    );
  };
  const toggleExpandedMenu = (id) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  // 결과 화면을 그리는 데 필요한 답이 전부 남아 있는지
  // (문항을 고치는 과정에서 뒤쪽 답이 자동으로 비워졌을 수 있다)
  const allAnswered =
    q2Idx > 0 &&
    q3Idx.length > 0 &&
    q4Idx.length > 0 &&
    (smellIdx.length > 0 || smellAllOk) &&
    (tasteIdx.length > 0 || tasteAllOk) &&
    seasonIdx.length > 0 &&
    q8Grade > 0 &&
    foodSelection.length > 0;

  const canProceedStep = () => {
    if (flowType !== "food") return true;
    if (currentStep === 2) return q2Idx > 0;
    if (currentStep === 3) return q3Idx.length > 0;
    if (currentStep === 4) return q4Idx.length > 0;
    // "다 괜찮아요" 버튼이 있으므로 무응답으로 넘어가지 못하게 한다
    if (currentStep === 5) return smellIdx.length > 0 || smellAllOk;
    if (currentStep === 6) return tasteIdx.length > 0 || tasteAllOk;
    if (currentStep === 7) return seasonIdx.length > 0;
    if (currentStep === 8) return q8Grade > 0;
    if (currentStep === 9) return foodSelection.length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canProceedStep()) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }
    if (currentStep >= 9) setReturnToResult(false);
    setCurrentStep(currentStep < 9 ? currentStep + 1 : 101);
  };

  const handlePrev = () => {
    if (currentStep === 101) setCurrentStep(9);
    else if (currentStep > 2) setCurrentStep(currentStep - 1);
    else {
      setFlowType(null);
      setCurrentStep(0);
    }
  };

  const handleReset = () => {
    setFlowType(null);
    setCurrentStep(0);
    setGuideCategory(null);
    setGuideAnswer(null);
    setGuideInitialWeight("");
    setGuideCurrentWeight("");
    setGuideDrug("wegovy");
    setGuideWeeks("");
    setGuideDiabetes("");
    setQ2Idx(0); setQ3Idx([]); setQ4Idx([]);
    setSmellIdx([]); setSmellAllOk(false); setTasteIdx([]); setTasteAllOk(false); setSeasonIdx([]); setQ8Grade(0);
    setFoodSelection([]);
    setExpandedMenus({});
    setReturnToResult(false);
    setMoreMenus([]);
    setMoreSeen(new Set());
  };

  const openGuide = (category) => { setFlowType("guide"); setGuideCategory(category); setGuideAnswer(null); };
  const openGuideHome = () => { setFlowType("guide"); setGuideCategory(null); setGuideAnswer(null); };
  const openWeight = () => { setFlowType("guide"); setGuideCategory("weight"); setGuideAnswer(null); };
  const returnToGuideHome = () => { setFlowType("guide"); setGuideCategory(null); setGuideAnswer(null); };

  const chipStyle = (active, activeBg = C.sage) => ({
    background: active ? activeBg : C.sagePale,
    color: active ? "#fff" : C.sageDeep,
  });

  // 권고 결과 화면 아래에 두는 버튼 줄 (다시 선택 / 처음으로)
  const guideResultFooter = (retryLabel = "다시 선택") => (
    <div className="flex gap-3 justify-center">
      <button
        type="button"
        onClick={() => setGuideAnswer(null)}
        className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
        style={{ background: C.sagePale, color: C.sageDeep }}
      >
        <ChevronLeft size={14} />
        {retryLabel}
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
        style={{ background: C.sagePale, color: C.sageDeep }}
      >
        <RotateCcw size={14} />
        처음으로
      </button>
    </div>
  );

  // 복수선택 문항의 전체 선택 버튼.
  // 하나씩 더해보며 결과가 0개가 되는 선택지는 건너뛴다.
  // (예: 향을 전부 피하면 쓸 수 있는 양념이 사라져 추천이 비어버린다)
  const selectAllChips = (key, values, current, setter, allowed) => {
    const pickedAll = values.every((v) => current.includes(v) || (allowed && !allowed.has(v)));
    return (
      <button
        type="button"
        onClick={() => {
          if (pickedAll) {
            setter([]);
            return;
          }
          const next = [...current];
          values.forEach((v) => {
            if (next.includes(v)) return;
            // 개별 칩과 똑같은 기준으로 판정해서, 전체 선택이 막힌 선택지를 끼워 넣지 않게 한다
            if (multiOptionEnabled({ ...answers, [key]: next }, key, v)) next.push(v);
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

  // 복수선택 문항 공통 레이아웃 — 선택 개수 + 전체 선택 버튼 + 칩 목록 + 비활성 안내
  // labels는 선택지 번호(1부터) 순서의 문구 배열. 막힌 선택지가 있으면 이유를 함께 보여준다.
  const chipGroup = (key, values, current, setter, allowed, chips, labels, allOk) => {
    const blocked = values.filter((v) => allowed && !allowed.has(v) && !current.includes(v));
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {current.length > 0 ? `${current.length}개 선택함` : allOk ? "다 괜찮다고 답하셨어요" : "아직 고른 항목이 없어요"}
          </p>
          {selectAllChips(key, values, current, setter, allowed)}
        </div>
        <div className="flex flex-wrap gap-2">{chips}</div>
        {blocked.length > 0 && labels && (
          <div className="rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.apricot}55`, color: C.ink60 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1, color: C.apricot }} />
            <span>
              지금까지 고른 조건으로는 만들 수 있는 메뉴가 없어서 아래 선택지는 고를 수 없어요.
              <span className="block mt-1" style={{ color: C.ink }}>
                {blocked.map((v) => labels[v - 1]).join(" · ")}
              </span>
            </span>
          </div>
        )}
      </div>
    );
  };

  // 단일선택 목록을 그리는 공통 렌더러 (비활성 선택지는 이유와 함께 흐리게)
  const renderChoiceList = (options, value, onPick, allowed) => (
    <div className="flex flex-col gap-3">
      {options.map((label, i) => {
        const idx = i + 1;
        const disabled = allowed && !allowed.has(idx);
        const active = value === idx;
        return (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(idx)}
            className="p-4 rounded-xl text-left text-sm font-medium transition-all"
            style={{
              background: active ? C.apricot : "#fff",
              color: active ? "#fff" : disabled ? "#B7B4AA" : C.ink,
              border: `1px solid ${active ? C.apricot : C.sagePale}`,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {idx}. {label}
            {disabled && <span className="block text-xs mt-1">지금까지 고른 조건으로는 만들 수 있는 메뉴가 없어요</span>}
          </button>
        );
      })}
    </div>
  );

  // 결과 화면에서 특정 문항으로 바로 돌아가는 버튼 줄
  const StepJumpButtons = ({ jumps }) => (
    <div className="flex flex-wrap gap-2">
      {jumps.map((j) => (
        <button
          key={j.key}
          type="button"
          onClick={() => { setReturnToResult(true); setCurrentStep(j.step); }}
          className="chip flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: C.sagePale, color: C.sageDeep }}
        >
          <ChevronLeft size={12} />
          {j.label}
        </button>
      ))}
    </div>
  );

  const navButtons = (nextLabel = "다음") => (
    <div className="flex flex-col gap-3 pt-4">
      {returnToResult && currentStep < 9 && (
        <button
          type="button"
          onClick={() => { setReturnToResult(false); setCurrentStep(101); }}
          disabled={!allAnswered}
          className="py-2.5 rounded-full text-sm font-medium disabled:opacity-40"
          style={{ background: C.sagePale, color: C.sageDeep }}
        >
          {allAnswered
            ? "결과로 바로 가기"
            : "뒤쪽 문항 답이 지워졌어요 — 다음을 눌러 이어가주세요"}
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
        input[type="date"] { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16 font-body">
        {/* 인트로 */}
        {currentStep === 0 && !flowType && (
          <div className="flex flex-col items-center text-center gap-8">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                GLP食(지엘피식)
              </span>
              <p className="mt-6 max-w-md text-base leading-relaxed mx-auto" style={{ color: C.ink60 }}>
                GLP-1 복용자를 위한 오늘의 식사 선택과 맞춤 권고를 확인해보세요.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                { key: "food", title: "식품 선택", desc: "오늘의 식사 선호도에 맞는 식품 추천", color: C.apricot, deep: C.apricotDeep, onClick: () => { setFlowType("food"); setCurrentStep(2); } },
                { key: "guide", title: "권고사항", desc: "상태를 선택하고 맞춤 권고 확인", color: C.sage, deep: C.sageDeep, onClick: openGuideHome },
                { key: "weight", title: "체중 변화", desc: "임상시험 자료와 내 감량률 비교", color: C.blue, deep: C.blueDeep, onClick: openWeight },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={c.onClick}
                  className="rounded-3xl p-6 md:p-7 flex flex-col items-start justify-between h-44 text-left hover:shadow-lg transition-all"
                  style={{ background: C.card, border: `2px solid ${c.color}` }}
                >
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
            <button type="button" onClick={handleReset} className="self-start flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}>
              <ChevronLeft size={16} /> 처음으로
            </button>
            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.sagePale }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: C.sageDeep }}>GUIDE</p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">권고사항</h2>
              <p className="text-sm" style={{ color: C.ink60 }}>확인하고 싶은 항목을 선택해주세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDE_MENU.map((category) => {
                const guide = GUIDE_DATA[category];
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => openGuide(category)}
                    className="rounded-2xl p-5 flex items-center justify-between text-left hover:shadow-md transition-all"
                    style={{ background: C.card, border: `1px solid ${C.sagePale}` }}
                  >
                    <span>
                      <strong className="block text-sm">{guide.title}</strong>
                      <small className="block mt-1" style={{ color: C.ink60 }}>
                        {guide.menuNote || `${guide.options.length}가지 상태 중 선택`}
                      </small>
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
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}>
                <ChevronLeft size={16} /> 권고사항 홈
              </button>
              <span className="font-mono text-xs" style={{ color: C.ink60 }}>공통 권고</span>
            </div>
            <GeneralGuideView />
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                <ChevronLeft size={14} />권고사항 홈
              </button>
              <button type="button" onClick={handleReset} className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                <RotateCcw size={14} />처음으로
              </button>
            </div>
          </div>
        )}

        {flowType === "guide" && guideCategory && guideCategory !== "weight" && guideCategory !== "general" && !guideAnswer && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={returnToGuideHome} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}>
                <ChevronLeft size={16} /> 권고사항 홈
              </button>
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
                  <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                    <GuidePoint point={goal} />
                  </ul>
                </div>
              )}
              <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
                <h3 className="font-display text-xl font-semibold mb-5">권고사항</h3>
                <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                  {points.map((point) => (
                    <GuidePoint key={typeof point === "string" ? point : point.head} point={point} />
                  ))}
                </ul>
              </div>
              {guideResultFooter("다시 선택")}
            </div>
          );
        })()}

        {flowType === "guide" && guideCategory === "weight" && !guideAnswer && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={handleReset} className="flex items-center gap-1 text-sm font-medium" style={{ color: C.sageDeep }}>
                <ChevronLeft size={16} /> 처음으로
              </button>
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
                  {DRUG_SHORT[guideDrug]}{a.dose} {weightResult.closestWeek}주차의 사람들의 평균 체중 감량률은{" "}
                  <strong style={{ color: C.sageDeep }}>{a.value}</strong>예요.
                </p>
              ))}
              {Number(guideWeeks) !== weightResult.closestWeek && (
                <p className="text-xs" style={{ color: C.ink60 }}>
                  입력하신 {guideWeeks || 0}주차와 가장 가까운 {weightResult.closestWeek}주차 자료로 비교했어요.
                </p>
              )}
            </div>
<div className="rounded-3xl p-6 md:p-8 flex flex-col gap-7" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">임상시험 참고 자료</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.ink60 }}>
                  {weightResult.meta.who}에게 {DRUG_SHORT[guideDrug]}를 투여한 {weightResult.meta.panel} 자료예요.
                  그래프의 동그라미가 지금 내 위치예요.
                </p>
              </div>

              <div>
                <WeightTrendChart
                  table={weightResult.table}
                  userWeek={Number(guideWeeks)}
                  userRate={weightResult.lossRate}
                />
                <p className="text-xs leading-relaxed mt-3" style={{ color: C.ink60 }}>
                  <strong style={{ color: C.ink }}>{weightResult.meta.figureNo}.</strong>{" "}
                  {weightResult.meta.who}에서 {weightResult.meta.drug} 투여에 따른 주차별 평균 체중변화: {weightResult.meta.panel}
                </p>
                <p className="text-xs leading-relaxed mt-1" style={{ color: "#9A988E" }}>
                  자료 출처: {weightResult.meta.source}
                </p>
              </div>

              <div>
                <WeightTableView table={weightResult.table} closestWeek={weightResult.closestWeek} />
                <p className="text-xs leading-relaxed mt-3" style={{ color: C.ink60 }}>
                  <strong style={{ color: C.ink }}>{weightResult.meta.tableNo}.</strong>{" "}
                  {weightResult.meta.who}에서 {weightResult.meta.drug} 투여에 따른 주차별 평균 누적 체중감량률:{" "}
                  {weightResult.meta.panel} 그래프 디지타이징 추정치
                </p>
                <p className="text-xs leading-relaxed mt-1" style={{ color: "#9A988E" }}>
                  자료 출처: {weightResult.meta.source}
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-4 flex flex-col gap-2 text-xs leading-relaxed" style={{ background: "#fff", border: `1px solid ${C.sagePale}`, color: C.ink60 }}>
              <p>* <RichText text={weightResult.note} /></p>
              <p>** {WEIGHT_COMMON_NOTE}</p>
            </div>
            {guideResultFooter("다시 입력")}
          </div>
        )}

        {/* ===== 식품 선택 흐름 (Q2~Q8 → 식품 선택 → 결과 / Q1 문항은 제거) ===== */}

        {flowType === "food" && currentStep === 2 && stepCard(
          "1단계: 식사 형태",
          "오늘은 어떤 형태의 식사를 원하시나요?",
          renderChoiceList(MEAL_FORM_OPTIONS, q2Idx, setQ2Idx, avail.q2)
        )}

        {flowType === "food" && currentStep === 3 && stepCard(
          "2단계: 식감 선호도",
          "오늘은 어떤 씹는 느낌이 좋을까요? (복수 선택)",
          chipGroup("q3Idx", [1, 2, 3, 4, 5, 6, 7], q3Idx, setQ3Idx, avail.q3,
            TEXTURE_OPTIONS.map((t, i) => {
              const on = q3Idx.includes(i + 1);
              const off = !on && !avail.q3.has(i + 1);
              return (
                <button key={t} type="button" disabled={off} onClick={() => toggleTexture(i + 1)} title={off ? "이 식감으로는 남는 메뉴가 없어요" : undefined} className="chip px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40" style={chipStyle(on, C.apricot)}>
                  {t}
                </button>
              );
            }),
            TEXTURE_OPTIONS
          )
        )}

        {flowType === "food" && currentStep === 4 && stepCard(
          "3단계: 온도 선호도",
          "오늘은 어떤 온도의 식사가 좋을까요? (복수 선택)",
          chipGroup("q4Idx", [1, 2, 3], q4Idx, setQ4Idx, avail.q4,
            TEMP_OPTIONS.map((t, i) => {
              const on = q4Idx.includes(i + 1);
              const off = !on && !avail.q4.has(i + 1);
              return (
                <button key={t} type="button" disabled={off} onClick={() => toggleTemp(i + 1)} title={off ? "이 온도로는 남는 메뉴가 없어요" : undefined} className="chip px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40" style={chipStyle(on, C.apricot)}>
                  {t}
                </button>
              );
            }),
            TEMP_OPTIONS
          )
        )}

        {flowType === "food" && currentStep === 5 && stepCard(
          "4단계: 냄새 민감도",
          "오늘 특히 민감하게 느껴지는 향이 있나요? (복수 선택, 없으면 '다 괜찮아요')",
          chipGroup("smellIdx", [1, 2, 3, 4, 5, 6], smellIdx, setSmellChoices, avail.q5,
            SMELL_OPTIONS.map((label, i) => {
              const on = smellIdx.includes(i + 1);
              const off = !on && !avail.q5.has(i + 1);
              return (
                <button key={label} type="button" disabled={off} onClick={() => toggleSmell(i + 1)} title={off ? "이 향을 모두 피하면 남는 양념이 없어요" : undefined} className="chip px-3 py-2 rounded-full text-xs font-medium disabled:opacity-40" style={chipStyle(on, C.blue)}>
                  {label}
                </button>
              );
            }).concat(
              <button key="smell-all-ok" type="button" onClick={() => { setSmellIdx([]); setSmellAllOk(true); }} className="chip px-3 py-2 rounded-full text-xs font-medium" style={chipStyle(smellAllOk, C.blue)}>
                다 괜찮아요
              </button>
            ),
            SMELL_OPTIONS,
            smellAllOk
          )
        )}

        {flowType === "food" && currentStep === 6 && stepCard(
          "5단계: 맛 민감도",
          "오늘 특히 민감하게 느껴지는 맛이 있나요? (복수 선택, 없으면 '다 괜찮아요')",
          chipGroup("tasteIdx", [1, 2, 3], tasteIdx, setTasteChoices, avail.q6,
            TASTE_OPTIONS.map((t, i) => {
              const on = tasteIdx.includes(i + 1);
              const off = !on && !avail.q6.has(i + 1);
              return (
                <button key={t} type="button" disabled={off} onClick={() => toggleTaste(i + 1)} title={off ? "이 맛을 모두 피하면 남는 양념이 없어요" : undefined} className="chip px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40" style={chipStyle(on, C.blue)}>
                  {t}
                </button>
              );
            }).concat(
              <button key="taste-all-ok" type="button" onClick={() => { setTasteIdx([]); setTasteAllOk(true); }} className="chip px-4 py-2 rounded-full text-sm font-medium" style={chipStyle(tasteAllOk, C.blue)}>
                다 괜찮아요
              </button>
            ),
            TASTE_OPTIONS,
            tasteAllOk
          )
        )}

        {flowType === "food" && currentStep === 7 && stepCard(
          "6단계: 간과 풍미",
          "오늘 식사의 간과 풍미는 어느 정도가 좋을까요? (복수 선택)",
          chipGroup("seasonIdx", [1, 2, 3], seasonIdx, setSeasonIdx, avail.q7,
            SEASONING_OPTIONS.map((t, i) => {
              const on = seasonIdx.includes(i + 1);
              const off = !on && !avail.q7.has(i + 1);
              return (
                <button key={t} type="button" disabled={off} onClick={() => toggleSeason(i + 1)} title={off ? "이 간·풍미로는 쓸 수 있는 양념이 없어요" : undefined} className="chip px-4 py-2 rounded-full text-sm font-medium disabled:opacity-40" style={chipStyle(on, C.apricot)}>
                  {t}
                </button>
              );
            }),
            SEASONING_OPTIONS
          )
        )}

        {flowType === "food" && currentStep === 8 && stepCard(
          "7단계: 조리 시간",
          "조리에 어느 정도 시간을 쓰실 수 있나요?",
          renderChoiceList(COOKING_TIME_OPTIONS, q8Grade, setQ8Grade, avail.q8)
        )}

        {/* 8단계(마지막): 식품 선택 */}
        {flowType === "food" && currentStep === 9 && (
          <div className="rounded-3xl p-6 md:p-8 flex flex-col gap-6" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">8단계: 식품 선택</h2>
              <p className="text-sm leading-relaxed" style={{ color: C.ink60 }}>
                지금까지 답변에 맞는 식품들을 모아봤어요. 오늘 먹고 싶은 식품을 자유롭게 골라주세요.
              </p>
            </div>

            <div className="rounded-2xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: C.sagePale, color: C.sageDeep }}>
              <Sparkles size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>별표(*)</strong>는 이 시기에 부족해지기 쉬운 영양소를 채워주는 식품이라 식감 답변과 관계없이 항상 보여드려요.
                이름 뒤 <strong>(조리하면)</strong>이 붙은 식품은 조리 방법에 따라 그 식감이 되는 것들이고, 눌러서 조리 방법을 볼 수 있어요.
              </span>
            </div>

            <div className="rounded-2xl p-3 flex items-start gap-2 text-xs leading-relaxed" style={{ background: "#FFF3EC", color: C.apricotDeep }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                메뉴는 <strong>주재료 1</strong>과 <strong>주재료 2</strong> 두 자리로 만들어져요.
                예를 들어 덮밥은 곡류(주재료 1)와 고기·생선·달걀·콩류(주재료 2)를 각각 하나씩 필요로 해요.
                한쪽만 고르면 그 메뉴는 추천되지 않으니, <strong>곡류·단백질 식품을 골고루</strong> 담아주세요.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {foodSelection.length > 0 ? `${foodSelection.length}가지 선택함` : "아직 고른 식품이 없어요"}
                <span className="text-xs ml-1" style={{ color: C.ink60 }}>/ 전체 {shownFoods.length}가지</span>
              </p>
              <button
                type="button"
                onClick={toggleAllFoods}
                className="chip px-4 py-2 rounded-full text-xs font-medium"
                style={chipStyle(allFoodsPicked, C.apricot)}
              >
                {allFoodsPicked ? "전체 해제" : "전체 선택"}
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {FOOD_GROUP_ORDER.filter((g) => (foodCandidates[g] || []).length > 0).map((group) => (
                <div key={group}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: C.ink60 }}>{group}</p>
                    <button
                      type="button"
                      onClick={() => toggleGroupFoods(group)}
                      className="text-xs font-medium"
                      style={{ color: isGroupPicked(group) ? C.apricotDeep : C.sageDeep }}
                    >
                      {isGroupPicked(group) ? "이 그룹 해제" : "이 그룹 전체 선택"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {foodCandidates[group].map((f) => {
                      const active = foodSelection.includes(f.name);
                      return (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => toggleFood(f.name)}
                          title={f.hint ? `이렇게 조리하면 그 식감이 돼요: ${f.hint}` : undefined}
                          className="chip px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1"
                          style={chipStyle(active, C.apricot)}
                        >
                          {f.essential && <span style={{ color: active ? "#fff" : C.apricotDeep, fontWeight: 700 }}>*</span>}
                          <FoodLabel name={f.name} size="text-sm" />
                          {f.tier === "cook" && <span className="text-[10px] opacity-70">(조리하면)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

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
              <span className="font-mono text-xs uppercase tracking-widest">
                {MEAL_FORM_OPTIONS[q2Idx - 1]?.split("(")[0]}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
                {plan.kind === "table" && plan.setting ? plan.setting.label : "당신을 위한 추천 식사"}
              </h2>
              <p className="text-sm leading-relaxed mt-2">
                고르신 식품 {foodSelection.length}가지를 바탕으로 오늘의 메뉴를 구성했어요. 항목을 눌러 자세히 볼 수 있어요.
              </p>
            </div>

            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <VitaminLegend />
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-semibold px-1">
                {plan.kind === "table" ? "오늘의 상차림" : "추천 메뉴"}
              </h3>
              {plan.items.length > 0 ? (
                plan.items.map((m) => (
                  <MenuToggleCard
                    key={m.id}
                    item={m}
                    selected={foodSelection}
                    sauces={sauceFor(m)}
                    expanded={!!expandedMenus[m.id]}
                    onToggle={() => toggleExpandedMenu(m.id)}
                  />
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

            <div className="rounded-3xl p-6 md:p-8" style={{ background: C.card, border: `1px solid ${C.sagePale}` }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-lg font-semibold">또 뭐가 있지?</h3>
                <Shuffle size={16} style={{ color: C.ink60 }} />
              </div>
              <p className="text-xs mb-4" style={{ color: C.ink60 }}>
                고르신 식품으로 만들 수 있는 다른 메뉴들이에요.
              </p>
              {moreMenus.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {moreMenus.map((m) => (
                    <div key={m.id} className="rounded-xl px-4 py-3" style={{ background: "#fff", border: `1px solid ${C.sagePale}` }}>
                      <p className="font-semibold text-sm">
                        {subRoleLabel(m) && (
                          <span className="font-mono text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full" style={{ background: C.sagePale, color: C.sageDeep }}>
                            {subRoleLabel(m)}
                          </span>
                        )}
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
                <button type="button" onClick={drawMoreMenus} className="w-full mt-4 py-2.5 rounded-full text-sm font-medium" style={{ background: C.sagePale, color: C.sageDeep }}>
                  더 볼래!
                </button>
              )}
              {morePool.length > 0 && (
                <p className="text-[11px] mt-2 text-center" style={{ color: "#9A988E" }}>
                  만들 수 있는 다른 메뉴 {moreTotal}가지 중 {moreMenus.length}가지를 보고 있어요
                </p>
              )}
              {moreRelaxed && (
                <p className="text-xs leading-relaxed mt-3 rounded-xl px-3 py-2.5" style={{ background: C.sagePale, color: C.sageDeep }}>
                  이 중에는 오늘 고르신 식사 형태·식감·온도·간·조리시간 조건에서 벗어난 메뉴도 있어요.
                  피하고 싶다고 하신 향·맛, 고르신 식품, 주재료 규칙만 지켜서 폭을 넓힌 목록이에요.
                </p>
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
