import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Download,
  FileSpreadsheet,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../../components/general/Card";
import { Button } from "../../components/general/Button";
import { useFormData } from "../../contexts/FormDataContext";
import { downloadCsv, downloadXlsx } from "../../utils/export";

const formatDate = (iso: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

const DashboardPage = () => {
  const { entries, deleteEntry, toggleReviewed } = useFormData();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredEntries = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return entries;

    return entries.filter((entry) => {
      return [
        entry.fullName,
        entry.email,
        entry.phone,
        entry.dateOfBirth,
        entry.gender,
        entry.occupation,
        entry.address,
        entry.city,
        entry.province,
        entry.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [entries, search]);

  const stats = useMemo(() => {
    const newCount = entries.filter((entry) => entry.status === "new").length;
    const reviewedCount = entries.length - newCount;
    return { total: entries.length, newCount, reviewedCount };
  }, [entries]);

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredEntries.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredEntries, currentPage, entriesPerPage]);

  const paginationInfo = useMemo(() => {
    const total = filteredEntries.length;
    const startIndex = (currentPage - 1) * entriesPerPage + 1;
    const endIndex = Math.min(currentPage * entriesPerPage, total);
    return { startIndex, endIndex, total };
  }, [filteredEntries.length, currentPage, entriesPerPage]);

  const exportRows = useMemo(() => {
    return filteredEntries.map((entry, index) => ({
      No: index + 1,
      Nama: entry.fullName,
      Email: entry.email,
      Telepon: entry.phone,
      TanggalLahir: entry.dateOfBirth,
      JenisKelamin: entry.gender,
      Pekerjaan: entry.occupation,
      Alamat: entry.address,
      Kota: entry.city,
      Provinsi: entry.province,
      Catatan: entry.notes,
      Status: entry.status,
      DibuatPada: entry.createdAt,
    }));
  }, [filteredEntries]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEntriesPerPageChange = (newPerPage: number) => {
    setEntriesPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    downloadCsv("simedika_form_entries", exportRows);
  };

  const handleExportXlsx = () => {
    downloadXlsx("simedika_form_entries", exportRows, "DataFormulir");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-lime-200/70">
            Total Entri
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-lime-100">
            {stats.total}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-lime-300/60">
            Semua data yang masuk
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-300/80">
            Entri Baru
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-300">
            {stats.newCount}
          </p>
          <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-200/60">
            Menunggu ditinjau
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300/80">
            Ditinjau
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
            {stats.reviewedCount}
          </p>
          <p className="mt-1 text-xs text-emerald-600/70 dark:text-emerald-200/60">
            Sudah diproses
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari berdasarkan kolom apa pun"
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 dark:border-kdark-border dark:bg-kdark-elevated dark:text-lime-100 dark:placeholder:text-lime-300/45 dark:focus:border-lime-500 dark:focus:ring-lime-900/60 lg:max-w-md"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Download size={16} />}
              onClick={handleExportCsv}
              disabled={exportRows.length === 0}
            >
              Ekspor CSV
            </Button>
            <Button
              leftIcon={<FileSpreadsheet size={16} />}
              onClick={handleExportXlsx}
              disabled={exportRows.length === 0}
            >
              Ekspor XLSX
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-600 dark:text-lime-200/75">
            Data formulir tidak ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-kdark-border-subtle">
              <thead className="bg-slate-100 dark:bg-kdark-elevated">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Telepon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Tanggal Lahir
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Jenis Kelamin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Pekerjaan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Alamat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Kota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Provinsi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Catatan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Dibuat
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-lime-200/80">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white dark:divide-kdark-border-subtle dark:bg-kdark-surface">
                {paginatedEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-lime-100">
                      {entry.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-lime-200/80">
                      {entry.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90 max-w-xs">
                      {entry.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90">
                      {entry.dateOfBirth}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90">
                      {entry.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90">
                      {entry.occupation}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90 max-w-sm">
                      {entry.address}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90">
                      {entry.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90">
                      {entry.province}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-lime-100/90 max-w-sm">
                      {entry.notes}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          entry.status === "reviewed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {entry.status === "reviewed" ? "Ditinjau" : "Baru"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-lime-200/80">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleReviewed(entry.id)}
                          leftIcon={
                            entry.status === "reviewed" ? (
                              <Circle size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )
                          }
                        >
                          {entry.status === "reviewed"
                            ? "Tandai Baru"
                            : "Tandai Ditinjau"}
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<Trash2 size={14} />}
                          onClick={() => deleteEntry(entry.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {filteredEntries.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-lime-200/80">
                Tampilkan
              </span>
              <select
                value={entriesPerPage}
                onChange={(e) =>
                  handleEntriesPerPageChange(Number(e.target.value))
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 dark:border-kdark-border dark:bg-kdark-elevated dark:text-lime-100 dark:focus:border-lime-500 dark:focus:ring-lime-900/60"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={filteredEntries.length}>Semua</option>
              </select>
              <span className="text-sm text-slate-600 dark:text-lime-200/80">
                entri per halaman
              </span>
            </div>

            <div className="text-sm text-slate-600 dark:text-lime-200/80">
              Menampilkan {paginationInfo.startIndex}-{paginationInfo.endIndex}{" "}
              dari {paginationInfo.total} data
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ChevronLeft size={14} />}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-8 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-lime-400 text-black dark:bg-lime-500"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-kdark-border dark:text-lime-200/80 dark:hover:bg-kdark-elevated"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ChevronRight size={14} />}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>

            <div className="text-xs text-slate-500 dark:text-lime-200/60">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
