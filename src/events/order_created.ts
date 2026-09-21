import { makeEvent } from "@njinlabs/njin";

const orderCreated = makeEvent<{ orderId: string; code: string; total: number; customerEmail: string }>();

export default orderCreated;
