import * as XLSX from "xlsx";

export type ExportRow = Record<
  string,
  string | number | boolean | null | undefined
>;

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const toCsvValue = (value: ExportRow[string]) => {
  const safe = String(value ?? "").replace(/"/g, '""');
  return `"${safe}"`;
};

export const downloadCsv = (fileName: string, rows: ExportRow[]) => {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map((header) => toCsvValue(header)).join(","),
    ...rows.map((row) =>
      headers.map((header) => toCsvValue(row[header])).join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  triggerDownload(blob, `${fileName}.csv`);
};

export const downloadXlsx = (
  fileName: string,
  rows: ExportRow[],
  sheetName = "FormData",
) => {
  if (rows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFileXLSX(workbook, `${fileName}.xlsx`, { compression: true });
};
