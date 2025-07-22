import { CVPreview } from "@/components/cv-preview";
import { defaultCVData } from "@/types/cv-types";

export default async function PDFPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let cvData = defaultCVData;
  const params = await searchParams;
  const cvDataParam = params.cvData;
  if (cvDataParam && typeof cvDataParam === "string") {
    try {
      cvData = JSON.parse(decodeURIComponent(cvDataParam));
    } catch {}
  }
  return <CVPreview cvData={cvData} />;
}
