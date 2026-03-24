import { Activity, BarChart2, Box, LayoutDashboard, LifeBuoy, Wallet, type LucideIcon } from "lucide-react";

export type SellerTab =
  | "dashboard"
  | "assets"
  | "finance"
  | "support"
  | "analysis"
  | "health";

export interface SellerTabItem {
  id: SellerTab;
  label: string;
  icon: LucideIcon;
}

export const SELLER_TABS: SellerTabItem[] = [
  { id: "dashboard", label: "概览", icon: LayoutDashboard },
  { id: "assets", label: "资产管理", icon: Box },
  { id: "finance", label: "业务管理", icon: Wallet },
  { id: "support", label: "工单服务", icon: LifeBuoy },
  { id: "analysis", label: "运营分析", icon: BarChart2 },
  { id: "health", label: "健康监控", icon: Activity },
];

export const isSellerTab = (tab: string): tab is SellerTab => {
  return SELLER_TABS.some((item) => item.id === tab);
};
