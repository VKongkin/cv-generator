"use client";
import { useEffect, useState } from "react";
import { CVPreview } from "@/components/cv-preview";
import { defaultCVData } from "@/types/cv-types";

export default function CVLivePreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const [cvData, setCvData] = useState(defaultCVData);

  useEffect(() => {
    // Try to load from localStorage first
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("cvData") : null;
    if (stored) {
      try {
        setCvData(JSON.parse(stored));
        return;
      } catch {}
    }
    // Fallback: try to load from query param
    if (searchParams?.cvData) {
      try {
        setCvData(JSON.parse(decodeURIComponent(searchParams.cvData)));
        return;
      } catch {}
    }
    // Fallback: use default
    setCvData(defaultCVData);
  }, [searchParams]);

  return <CVPreview cvData={cvData} />;
}
