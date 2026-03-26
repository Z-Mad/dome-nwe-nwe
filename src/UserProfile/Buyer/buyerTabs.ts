import { FileText, Headphones, LayoutDashboard, PieChart, Receipt, type LucideIcon, Box } from "lucide-react";

export type BuyerTab =
  | "dashboard"
  | "orders"
  | "bills"
  | "invoices"
  | "resources"
  | "analysis"
  | "support";

export interface BuyerTabItem {
  id: BuyerTab;
  label: string;
  icon: LucideIcon;
}

export const BUYER_TABS: BuyerTabItem[] = [
  { id: "dashboard", label: "概览", icon: LayoutDashboard },
  { id: "orders", label: "订单管理", icon: FileText },
  { id: "bills", label: "账单管理", icon: FileText },
  { id: "invoices", label: "发票管理", icon: Receipt },
  { id: "resources", label: "我的资源", icon: Box },
  { id: "analysis", label: "成本分析", icon: PieChart },
  { id: "support", label: "服务支持", icon: Headphones },
];

export const isBuyerTab = (tab: string): tab is BuyerTab => {
  return BUYER_TABS.some((item) => item.id === tab);
};
