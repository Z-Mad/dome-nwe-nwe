import { filterOrders, ProfileOrderItem } from "./orderUtils";

interface FilterPayload<T extends ProfileOrderItem> {
  orders: T[];
  statusFilter: string;
  keyword: string;
}

self.onmessage = (event: MessageEvent<FilterPayload<ProfileOrderItem>>) => {
  const { orders, statusFilter, keyword } = event.data;
  const filtered = filterOrders(orders, statusFilter, keyword);
  self.postMessage(filtered);
};

export {};
