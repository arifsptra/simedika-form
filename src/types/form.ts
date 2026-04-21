export type FormEntryStatus = "new" | "reviewed";

export interface FormEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  address: string;
  city: string;
  province: string;
  notes: string;
  createdAt: string;
  status: FormEntryStatus;
}

export interface FormEntryInput {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  address: string;
  city: string;
  province: string;
  notes: string;
}
