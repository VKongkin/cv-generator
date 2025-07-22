import React from "react";

interface DownloadInvoicePDFButtonProps {
  invoiceId: string | number;
  children?: React.ReactNode;
}

export function DownloadInvoicePDFButton({
  invoiceId,
  children,
}: DownloadInvoicePDFButtonProps) {
  const handleDownload = async () => {
    const url = `/api/generate-pdf?url=${encodeURIComponent(
      window.location.origin + "/invoice/" + invoiceId
    )}`;
    const res = await fetch(url);
    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} type="button">
      {children || "Download PDF"}
    </button>
  );
}
