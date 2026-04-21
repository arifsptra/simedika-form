import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Card } from "../../components/general/Card";
import { Input } from "../../components/general/inputs/Input";
import { Button } from "../../components/general/Button";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const success = login(email, password);
    if (!success) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/60 dark:shadow-black/30">
      <div className="bg-linear-to-r from-lime-500 to-lime-600 p-6 text-white dark:from-lime-700 dark:to-lime-900">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
          <LockKeyhole size={20} />
        </div>
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="mt-1 text-sm text-lime-50/90">
          Akses dashboard untuk meninjau, mengekspor, dan mengelola data
          formulir.
        </p>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            requiredLabel
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Kata Sandi"
            requiredLabel
            type="password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth className="py-2.5">
            Masuk
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default LoginPage;
