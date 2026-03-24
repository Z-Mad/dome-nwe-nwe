import { describe, expect, it } from "vitest";
import {
  filterOrders,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  matchesOrderKeyword,
  matchesOrderStatus,
} from "./orderUtils";

const orders = [
  { id: "ORD-001", productName: "冷轧板形控制专家", paymentStatus: "Paid" },
  { id: "ORD-002", productName: "热连轧机组振动预测", paymentStatus: "PendingPayment" },
  { id: "TRIAL-003", productName: "表面缺陷视觉检测模型", paymentStatus: "Rejected" },
];

describe("orderUtils", () => {
  it("返回状态文案", () => {
    expect(getOrderStatusLabel("all")).toBe("全部订单");
    expect(getOrderStatusLabel("Paid")).toBe("已支付");
  });

  it("返回支付方式文案", () => {
    expect(getPaymentMethodLabel("Alipay")).toBe("支付宝");
    expect(getPaymentMethodLabel("CorporateRemittance")).toBe("对公转账");
    expect(getPaymentMethodLabel("Custom")).toBe("Custom");
  });

  it("匹配状态过滤器", () => {
    expect(matchesOrderStatus(orders[0], "all")).toBe(true);
    expect(matchesOrderStatus(orders[0], "Paid")).toBe(true);
    expect(matchesOrderStatus(orders[1], "Paid")).toBe(false);
  });

  it("匹配关键词过滤器", () => {
    expect(matchesOrderKeyword(orders[0], "ORD-001")).toBe(true);
    expect(matchesOrderKeyword(orders[2], "视觉")).toBe(true);
    expect(matchesOrderKeyword(orders[2], "不存在")).toBe(false);
  });

  it("组合过滤订单", () => {
    const paid = filterOrders(orders, "Paid", "");
    const search = filterOrders(orders, "all", "热连轧");
    expect(paid).toHaveLength(1);
    expect(paid[0].id).toBe("ORD-001");
    expect(search).toHaveLength(1);
    expect(search[0].id).toBe("ORD-002");
  });
});
