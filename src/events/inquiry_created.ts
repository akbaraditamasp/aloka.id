import { makeEvent } from "@njinlabs/njin";

const inquiryCreated = makeEvent<{ inquiryId: string; name: string; whatsapp: string; topic: string }>();

export default inquiryCreated;
