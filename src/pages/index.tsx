import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardPenLine } from "lucide-react";
import { useFormData } from "../contexts/FormDataContext";
import { Button } from "../components/general/Button";
import { Card } from "../components/general/Card";
import { ThemeToggle } from "../components/general/ThemeToggle";
import { Input } from "../components/general/inputs/Input";
import { TextArea } from "../components/general/inputs/TextArea";
import useColorMode from "../hooks/useColorMode";
import type { FormEntryInput } from "../types/form";
import { cn } from "../utils/cn";

type FormErrors = Partial<Record<keyof FormEntryInput, string>>;
type FormField = keyof FormEntryInput;

interface StepField {
  field: FormField;
  label: string;
  placeholder?: string;
  type?: string;
}

interface FormStep {
  title: string;
  hint: string;
  fields: StepField[];
}

const FORM_STEPS: FormStep[] = [
  {
    title: "Informasi Pribadi",
    hint: "Masukkan data identitas dasar Anda.",
    fields: [
      { field: "fullName", label: "Nama Lengkap", placeholder: "Masukkan nama lengkap sesuai identitas" },
      { field: "dateOfBirth", label: "Tanggal Lahir", type: "date" },
      { field: "gender", label: "Jenis Kelamin" },
    ],
  },
  {
    title: "Informasi Kontak",
    hint: "Data untuk komunikasi dan tindak lanjut.",
    fields: [
      { field: "email", label: "Alamat Email", placeholder: "email@contoh.com", type: "email" },
      { field: "phone", label: "Nomor Telepon", placeholder: "Nomor WhatsApp yang aktif" },
    ],
  },
  {
    title: "Informasi Profesi",
    hint: "Data pekerjaan atau profesi saat ini.",
    fields: [
      { field: "occupation", label: "Pekerjaan", placeholder: "Isi pekerjaan atau profesi saat ini" },
    ],
  },
  {
    title: "Informasi Lokasi",
    hint: "Alamat lengkap tempat tinggal Anda.",
    fields: [
      { field: "address", label: "Alamat Lengkap", placeholder: "Nama jalan, kecamatan, dan patokan" },
      { field: "city", label: "Kota", placeholder: "Kota domisili" },
      { field: "province", label: "Provinsi", placeholder: "Pilih provinsi" },
    ],
  },
  {
    title: "Catatan Tambahan",
    hint: "Sampaikan konteks medis atau permintaan layanan.",
    fields: [
      { field: "notes", label: "Catatan", placeholder: "Tulis detail permintaan atau kebutuhan Anda" },
    ],
  },
];

const initialFormState: FormEntryInput = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  occupation: "",
  address: "",
  city: "",
  province: "",
  notes: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HomePage = () => {
  const { addEntry } = useFormData();
  const [colorMode, setColorMode] = useColorMode();

  const [formData, setFormData] = useState<FormEntryInput>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = FORM_STEPS[stepIndex];
  const isLastStep = stepIndex === FORM_STEPS.length - 1;

  const progress = useMemo(() => {
    return Math.round(((stepIndex + 1) / FORM_STEPS.length) * 100);
  }, [stepIndex]);

  const validateField = (field: FormField, value: string) => {
    const safeValue = value.trim();

    if (!safeValue) return "Kolom ini wajib diisi.";

    if (field === "email" && !emailRegex.test(safeValue)) {
      return "Gunakan format email yang valid.";
    }

    if (field === "phone" && safeValue.replace(/\D/g, "").length < 9) {
      return "Gunakan nomor telepon yang valid.";
    }

    return undefined;
  };

  const validateCurrentStep = () => {
    const stepErrors: FormErrors = {};
    let hasError = false;

    currentStep.fields.forEach((stepField) => {
      const field = stepField.field;
      const message = validateField(field, formData[field]);
      if (message) {
        stepErrors[field] = message;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return false;
    }

    return true;
  };

  const handleChange = (key: keyof FormEntryInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStepIndex((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    FORM_STEPS.forEach((step) => {
      step.fields.forEach((stepField) => {
        const field = stepField.field;
        const validationMessage = validateField(field, formData[field]);
        if (validationMessage) {
          nextErrors[field] = validationMessage;
        }
      });
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstErrorStep = FORM_STEPS.findIndex((step) =>
        step.fields.some((stepField) => nextErrors[stepField.field]),
      );
      if (firstErrorStep >= 0) {
        setStepIndex(firstErrorStep);
      }
      return;
    }

    addEntry({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender.trim(),
      occupation: formData.occupation.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      province: formData.province.trim(),
      notes: formData.notes.trim(),
    });

    setFormData(initialFormState);
    setStepIndex(0);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 2500);
  };

  const renderGenderField = (label: string) => {
    const options = ["Laki-laki", "Perempuan", "Tidak ingin menyebutkan"];

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700 dark:text-lime-100">
          {label}
          <span className="text-red-500"> *</span>
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => handleChange("gender", option)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                formData.gender === option
                  ? "border-lime-500 bg-lime-100 text-lime-800 dark:border-lime-500 dark:bg-lime-900/35 dark:text-lime-100"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-kdark-border dark:bg-kdark-elevated dark:text-lime-100 dark:hover:bg-kdark-border",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {errors.gender ? (
          <p className="text-xs text-red-500">{errors.gender}</p>
        ) : null}
      </div>
    );
  };

  const renderStepFields = () => {
    return (
      <div className="space-y-5">
        {currentStep.fields.map((stepField) => {
          const field = stepField.field;

          if (field === "notes") {
            return (
              <TextArea
                key={field}
                label={stepField.label}
                requiredLabel
                rows={6}
                placeholder={stepField.placeholder}
                value={formData.notes}
                onChange={(event) => handleChange("notes", event.target.value)}
                error={errors.notes}
              />
            );
          }

          if (field === "address") {
            return (
              <TextArea
                key={field}
                label={stepField.label}
                requiredLabel
                rows={5}
                placeholder={stepField.placeholder}
                value={formData.address}
                onChange={(event) => handleChange("address", event.target.value)}
                error={errors.address}
              />
            );
          }

          if (field === "gender") {
            return <div key={field}>{renderGenderField(stepField.label)}</div>;
          }

          const inputType =
            field === "email" ? "email" : field === "dateOfBirth" ? "date" : "text";

          return (
            <Input
              key={field}
              label={stepField.label}
              requiredLabel
              type={inputType}
              placeholder={stepField.placeholder}
              value={formData[field]}
              onChange={(event) => handleChange(field, event.target.value)}
              error={errors[field]}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-linear-to-b from-slate-50 to-slate-100 text-slate-900 transition-colors dark:from-kdark-bg dark:to-kdark-bg dark:text-lime-100">
      <main className="min-h-screen mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-5 sticky top-4 z-20">
            <Card className="border-lime-100min-h-screen /80 bg-white/92 p-4 backdrop-blur-md sm:p-5 dark:border-kdark-border-subtle dark:bg-kdark-surface/92">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h1 className="inline-flex items-center gap-2.5 rounded-2xl px-3 py-1.5 font-bold text-slate-800 transition-colors hover:bg-slate-100/70 dark:text-lime-100 dark:hover:bg-kdark-elevated">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-white dark:text-kdark-bg">
                    <ClipboardPenLine size={18} />
                  </span>
                  Formulir Simedika
                </h1>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-kdark-elevated dark:text-lime-200/85">
                  Langkah {stepIndex + 1} / {FORM_STEPS.length}
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-kdark-elevated">
                <div
                  className="h-full rounded-full bg-linear-to-r from-lime-400 to-lime-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Card>
          </div>

          <Card className="mb-5 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-lime-100">
              {currentStep.title}
            </h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-lime-100/85">
              {currentStep.hint}
            </p>
          </Card>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Card className="p-6 sm:p-8 space-y-3">
              {renderStepFields()}

              {isSubmitted ? (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-900/20 dark:text-green-300">
                  <CheckCircle2 size={16} />
                  Formulir berhasil dikirim. Anda dapat membuat entri baru.
                </div>
              ) : null}
            </Card>

            <div className="sticky bottom-3 z-30 sm:bottom-4">
              <Card className="bg-white/95 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4 dark:bg-kdark-surface/95">
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrev}
                    disabled={stepIndex === 0}
                  >
                    Sebelumnya
                  </Button>

                  {isLastStep ? (
                    <Button type="submit" className="min-w-36">
                      Kirim Formulir
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="min-w-36"
                    >
                      Selanjutnya
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </form>
        </div>
      </main>
      <div className="py-6 flex items-center justify-center">
        <ThemeToggle colorMode={colorMode} setColorMode={setColorMode} />
      </div>
    </div>
  );
};

export default HomePage;
