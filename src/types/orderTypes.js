export const ORDER_CREATED = 0;
export const ORDER_REJECTED = 1;
export const ORDER_ACCEPTED = 2;
export const ORDER_HAS_CONTRACT = 3;
export const ORDER_CONTRACT_CLOSED = 4;
export const ORDER_CONTRACT_CANCELLED = 5;

export const ORDER_TEXT_STATUS = {};

export const ORDER_COLORS = {
  [ORDER_CREATED]: "info",
  [ORDER_REJECTED]: "negative",
  [ORDER_ACCEPTED]: "positive",
  [ORDER_HAS_CONTRACT]: "warning",
  [ORDER_CONTRACT_CLOSED]: "negative",
  [ORDER_CONTRACT_CANCELLED]: "negative",
};
