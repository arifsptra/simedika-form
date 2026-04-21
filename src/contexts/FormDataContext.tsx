import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import type { FormEntry, FormEntryInput } from "../types/form";

interface FormDataContextType {
  entries: FormEntry[];
  addEntry: (payload: FormEntryInput) => void;
  toggleReviewed: (id: string) => void;
  deleteEntry: (id: string) => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined,
);

const DUMMY_FORM_ENTRIES: FormEntry[] = [
  {
    id: "demo-001",
    fullName: "Aditya Pratama",
    email: "aditya.pratama@mail.com",
    phone: "081234567801",
    dateOfBirth: "1998-03-14",
    gender: "Male",
    occupation: "Pharmacist",
    address: "Jl. Mangga Dua No. 12",
    city: "Jakarta",
    province: "DKI Jakarta",
    notes: "Tertarik pada konsultasi perawatan penyakit kronis.",
    createdAt: "2026-04-20T08:32:00.000Z",
    status: "new",
  },
  {
    id: "demo-002",
    fullName: "Rani Kurniawati",
    email: "rani.kurniawati@mail.com",
    phone: "081234567802",
    dateOfBirth: "1995-07-22",
    gender: "Female",
    occupation: "Teacher",
    address: "Jl. Kenanga Asri Blok C2",
    city: "Bandung",
    province: "Jawa Barat",
    notes: "Memerlukan tindak lanjut untuk panduan obat anak.",
    createdAt: "2026-04-20T09:15:00.000Z",
    status: "reviewed",
  },
  {
    id: "demo-003",
    fullName: "Bima Nugroho",
    email: "bima.nugroho@mail.com",
    phone: "081234567803",
    dateOfBirth: "1992-11-05",
    gender: "Male",
    occupation: "Entrepreneur",
    address: "Jl. Veteran No. 44",
    city: "Surabaya",
    province: "Jawa Timur",
    notes: "Meminta notifikasi pembaruan stok obat.",
    createdAt: "2026-04-20T10:01:00.000Z",
    status: "new",
  },
  {
    id: "demo-004",
    fullName: "Maya Salsabila",
    email: "maya.salsabila@mail.com",
    phone: "081234567804",
    dateOfBirth: "2000-01-30",
    gender: "Female",
    occupation: "Nurse",
    address: "Perum Griya Sehat No. 7",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    notes: "Meminta pengingat jadwal vaksinasi.",
    createdAt: "2026-04-20T11:42:00.000Z",
    status: "reviewed",
  },
  {
    id: "demo-005",
    fullName: "Fajar Ramadhan",
    email: "fajar.ramadhan@mail.com",
    phone: "081234567805",
    dateOfBirth: "1989-09-19",
    gender: "Male",
    occupation: "Logistics Coordinator",
    address: "Jl. Cendana Raya No. 88",
    city: "Semarang",
    province: "Jawa Tengah",
    notes: "Memerlukan salinan laporan bulanan melalui email.",
    createdAt: "2026-04-20T13:08:00.000Z",
    status: "new",
  },
  {
    id: "demo-006",
    fullName: "Siti Nurhaliza",
    email: "siti.nurhaliza@mail.com",
    phone: "089876543206",
    dateOfBirth: "1997-05-11",
    gender: "Female",
    occupation: "Accountant",
    address: "Jl. Diponegoro No. 56",
    city: "Medan",
    province: "Sumatera Utara",
    notes: "Membutuhkan layanan kesehatan untuk keluarga.",
    createdAt: "2026-04-20T14:20:00.000Z",
    status: "reviewed",
  },
  {
    id: "demo-007",
    fullName: "Hendra Kusuma",
    email: "hendra.kusuma@mail.com",
    phone: "085432109807",
    dateOfBirth: "1991-08-03",
    gender: "Male",
    occupation: "Software Developer",
    address: "Jl. Gatot Subroto No. 123",
    city: "Medan",
    province: "Sumatera Utara",
    notes: "Ingin konsultasi kesehatan digital jarak jauh.",
    createdAt: "2026-04-20T15:45:00.000Z",
    status: "new",
  },
  {
    id: "demo-008",
    fullName: "Dewi Lestari",
    email: "dewi.lestari@mail.com",
    phone: "087654321098",
    dateOfBirth: "1996-12-25",
    gender: "Female",
    occupation: "Marketing Manager",
    address: "Jl. Pemuda No. 78",
    city: "Makassar",
    province: "Sulawesi Selatan",
    notes: "Memerlukan program wellness korporat.",
    createdAt: "2026-04-20T16:30:00.000Z",
    status: "reviewed",
  },
  {
    id: "demo-009",
    fullName: "Ari Wijaya",
    email: "ari.wijaya@mail.com",
    phone: "081987654321",
    dateOfBirth: "1994-06-17",
    gender: "Male",
    occupation: "Civil Engineer",
    address: "Jl. Sudirman No. 345",
    city: "Medan",
    province: "Sumatera Utara",
    notes: "Mencari dokter spesialis untuk pemeriksaan rutin.",
    createdAt: "2026-04-20T17:15:00.000Z",
    status: "new",
  },
  {
    id: "demo-010",
    fullName: "Lina Wijayanti",
    email: "lina.wijayanti@mail.com",
    phone: "082109876543",
    dateOfBirth: "1999-02-08",
    gender: "Female",
    occupation: "Graphic Designer",
    address: "Jl. Irama No. 91",
    city: "Jakarta",
    province: "DKI Jakarta",
    notes: "Ingin mendaftarkan asuransi kesehatan keluarga.",
    createdAt: "2026-04-20T18:00:00.000Z",
    status: "reviewed",
  },
  {
    id: "demo-011",
    fullName: "Rudi Santoso",
    email: "rudi.santoso@mail.com",
    phone: "083456789012",
    dateOfBirth: "1990-10-29",
    gender: "Male",
    occupation: "Restaurant Owner",
    address: "Jl. Gatot Subroto No. 67",
    city: "Bandung",
    province: "Jawa Barat",
    notes: "Butuh panduan nutrisi untuk menu restoran.",
    createdAt: "2026-04-20T18:45:00.000Z",
    status: "new",
  },
  {
    id: "demo-012",
    fullName: "Natasya Khoerunnisa",
    email: "natasya.khoerunnisa@mail.com",
    phone: "084567890123",
    dateOfBirth: "2001-09-14",
    gender: "Female",
    occupation: "Student",
    address: "Jl. Merdeka No. 200",
    city: "Surabaya",
    province: "Jawa Timur",
    notes: "Menanyakan ketersediaan vaksin untuk mahasiswa.",
    createdAt: "2026-04-20T19:30:00.000Z",
    status: "reviewed",
  },
];

type LegacyFormEntry = Partial<FormEntry> & {
  name?: string;
  message?: string;
};

const normalizeEntry = (entry: FormEntry | LegacyFormEntry): FormEntry => {
  const legacyEntry = entry as LegacyFormEntry;

  return {
    id: String(entry.id ?? crypto.randomUUID()),
    fullName: String(entry.fullName ?? legacyEntry.name ?? ""),
    email: String(entry.email ?? ""),
    phone: String(entry.phone ?? ""),
    dateOfBirth: String(entry.dateOfBirth ?? ""),
    gender: String(entry.gender ?? "Tidak ingin menyebutkan"),
    occupation: String(entry.occupation ?? ""),
    address: String(entry.address ?? ""),
    city: String(entry.city ?? ""),
    province: String(entry.province ?? ""),
    notes: String(entry.notes ?? legacyEntry.message ?? ""),
    createdAt: String(entry.createdAt ?? new Date().toISOString()),
    status: entry.status === "reviewed" ? "reviewed" : "new",
  };
};

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useLocalStorage<FormEntry[]>(
    "simedika_form_entries",
    DUMMY_FORM_ENTRIES,
  );

  useEffect(() => {
    // If loaded data is missing entries compared to current dummy data,
    // reset to current dummy data to ensure we have all 12 entries
    if (entries.length < DUMMY_FORM_ENTRIES.length) {
      setEntries(DUMMY_FORM_ENTRIES);
    } else {
      setEntries((previousEntries) =>
        previousEntries.map((entry) => normalizeEntry(entry)),
      );
    }
  }, [setEntries]);

  const addEntry = (payload: FormEntryInput) => {
    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "new",
        ...payload,
      },
      ...prev,
    ]);
  };

  const toggleReviewed = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: entry.status === "new" ? "reviewed" : "new",
            }
          : entry,
      ),
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <FormDataContext.Provider
      value={{ entries, addEntry, toggleReviewed, deleteEntry }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within FormDataProvider");
  }
  return context;
};
