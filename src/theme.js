import { AlertTriangle, Ban, Check } from "lucide-react";

export const C = {
  bg: "#F4F5FA", ink: "#14162E", ink60: "#5F6699", ink40: "#6E74A0",
  sage: "#6B72C4", sageDeep: "#383E8C", sagePale: "#E4E7F6", sageTint: "#EDEFF9",
  card: "#FFFFFF", line: "#E1E4F3", apricot: "#FF8A5B", apricotDeep: "#BE4D26",
  apricotPale: "#FFF1EA", blue: "#4E9AA8", blueDeep: "#2E6D7A", bluePale: "#E5F1F3",
  shadowSm: "0 1px 2px rgba(20,22,46,0.04)",
  shadowMd: "0 2px 4px rgba(20,22,46,0.04), 0 12px 28px -16px rgba(20,22,46,0.28)",
};

export const TONE = {
  good: { label: "권장", Icon: Check, fg: "#2F7A4B", bg: "#E6F4EA" },
  care: { label: "주의", Icon: AlertTriangle, fg: "#B45309", bg: "#FFF3E0" },
  avoid: { label: "피하기", Icon: Ban, fg: "#B42318", bg: "#FDECEA" },
};

export const FONT_STEPS = [
  { px: 14, name: "작게" }, { px: 16, name: "기본" }, { px: 18, name: "크게" }, { px: 20, name: "아주 크게" },
];
