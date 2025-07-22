"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CVPreview } from "@/components/cv-preview";
import { defaultCVData } from "@/types/cv-types";

export default function CVLivePreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const [cvData, setCvData] = useState(defaultCVData);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cv")
        .then((res) => res.json())
        .then((data) => {
          if (data.cv && data.cv.data) setCvData(data.cv.data);
        });
    } else {
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
    }
  }, [searchParams, status]);

  return <CVPreview cvData={cvData} />;
}
