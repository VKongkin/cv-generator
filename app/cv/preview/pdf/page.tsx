import { CVPreview } from "@/components/cv-preview";
import { defaultCVData } from "@/types/cv-types";

async function fetchCVDataById(id: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cv-cache?id=${id}`);
  if (!res.ok) return null;
  return await res.json();
}

export default async function PDFPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let cvData = defaultCVData;
  const params = await searchParams;
  if (params.id && typeof params.id === "string") {
    const data = await fetchCVDataById(params.id);
    if (data) cvData = data;
  } else if (params.cvData && typeof params.cvData === "string") {
    try {
      cvData = JSON.parse(decodeURIComponent(params.cvData));
    } catch {}
  }
  return <CVPreview cvData={cvData} />;
}
