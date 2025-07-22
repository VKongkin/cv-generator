"use client";

import { useRef, useState, useEffect } from "react";
import { CVEditor } from "@/components/cv-editor";
import { CVPreview } from "@/components/cv-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Eye, AlertCircle } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { type CVData, defaultCVData, type CVSection } from "@/types/cv-types";

export default function CVBuilderApp() {
  const syncCustomSections = (data: CVData): CVData => {
    const existingCustomSectionIds = data.sectionOrder
      .filter((section) => section.type === "custom")
      .map((section) => section.id);

    const missingCustomSections = data.customSections.filter(
      (customSection) => !existingCustomSectionIds.includes(customSection.id)
    );

    if (missingCustomSections.length > 0) {
      const newSectionOrders: CVSection[] = missingCustomSections.map(
        (customSection, index) => ({
          id: customSection.id,
          type: "custom",
          title: customSection.title,
          order: data.sectionOrder.length + index + 1,
          enabled: true,
          sectionType: customSection.sectionType,
        })
      );

      return {
        ...data,
        sectionOrder: [...data.sectionOrder, ...newSectionOrders].sort(
          (a, b) => a.order - b.order
        ),
      };
    }

    return data;
  };

  const [cvData, setCvData] = useState<CVData>(() =>
    syncCustomSections(defaultCVData)
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isHtml2pdfLoaded, setIsHtml2pdfLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  // Remove useLivePreview state

  // Save cvData to localStorage on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cvData", JSON.stringify(cvData));
      } catch {}
    }
  }, [cvData]);

  // Check if html2pdf is loaded
  useEffect(() => {
    const checkHtml2pdf = () => {
      if ((window as any).html2pdf) {
        setIsHtml2pdfLoaded(true);
      } else {
        // Try again after a short delay
        setTimeout(checkHtml2pdf, 100);
      }
    };

    checkHtml2pdf();
  }, []);

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);

    try {
      if (previewRef.current) {
        await generatePDF(previewRef.current); // pass DOM node
      } else {
        setPdfError("Preview not found.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setPdfError(errorMessage);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadCVPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    try {
      // 1. Store CV data in cache and get an id
      const cacheRes = await fetch("/api/cv-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      });
      if (!cacheRes.ok) {
        setPdfError("Failed to cache CV data");
        setIsGeneratingPDF(false);
        return;
      }
      const { id } = await cacheRes.json();
      // 2. Request PDF generation by id
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setPdfError("Failed to generate PDF");
        setIsGeneratingPDF(false);
        return;
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cv.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setPdfError("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CV Builder</h1>
          <p className="text-gray-600">
            Create and customize your professional CV
          </p>
        </div>

        <div className="flex gap-6">
          {/* Editor Panel */}
          <div className="w-1/3">
            <Card className="p-6 h-fit sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit CV</h2>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleExportPDF}
                      disabled={!isHtml2pdfLoaded || isGeneratingPDF}
                      variant="outline"
                      title="Generate PDF directly in your browser. Fast, but may have slight rendering differences."
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF (Client)
                    </Button>
                    <Button
                      onClick={downloadCVPDF}
                      disabled={isGeneratingPDF}
                      className="bg-[#149ac5] hover:bg-[#0f7a9c]"
                      title="Generate PDF on the server. More accurate, but requires a network connection."
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF (Server)
                    </Button>
                  </div>

                  {!isHtml2pdfLoaded && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      Loading PDF library...
                    </div>
                  )}

                  {pdfError && (
                    <div className="text-xs text-red-600 max-w-48 text-right">
                      {pdfError}
                    </div>
                  )}
                </div>
              </div>
              <CVEditor cvData={cvData} onChange={setCvData} />
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="flex-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">A4 Preview</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  Live Preview
                </div>
              </div>
              <div className="bg-white shadow-lg overflow-auto">
                <div
                  className="transform scale-75 origin-top-left"
                  ref={previewRef}
                >
                  <CVPreview cvData={cvData} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
