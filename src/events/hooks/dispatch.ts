import { afterCreate } from "@njinlabs/njin";
import inquiry from "../../models/inquiry";
import order from "../../models/order";
import inquiryCreated from "../inquiry_created";
import orderCreated from "../order_created";

// Model hooks -> event bus: whatever creates an inquiry/order (public form, admin panel, future
// checkout) fans out the same event, so notification listeners only have to subscribe once.
afterCreate(inquiry, (record) => {
  inquiryCreated.dispatch({
    inquiryId: String(record.id.id),
    name: record.name,
    whatsapp: record.whatsapp,
    topic: record.topic,
  });
});

afterCreate(order, (record) => {
  orderCreated.dispatch({
    orderId: String(record.id.id),
    code: record.code,
    total: record.total,
    customerEmail: record.customerEmail,
  });
});
