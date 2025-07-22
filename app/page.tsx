"use client";

import { useRef, useState } from "react";
import { CVEditor } from "@/components/cv-editor";
import { CVPreview } from "@/components/cv-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Eye, AlertCircle, LogOut } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { type CVSection } from "@/types/cv-types";
import { useAuth } from "@/components/auth/auth-provider";
import { LoginForm } from "@/components/auth/login-form";
import { useCVData } from "@/hooks/use-cv-data";

export default function CVBuilderApp() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { cvData, updateCVData, loading: cvLoading, saving, error } = useCVData();

  // Show login form if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

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

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isHtml2pdfLoaded, setIsHtml2pdfLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const handleCVDataChange = (newData: CVData) => {
    const syncedData = syncCustomSections(newData);
    updateCVData(syncedData);
  };

  const handleSignOut = async () => {
    await signOut();
  };
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

  if (cvLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your CV data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">CV Builder</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Create and customize your professional CV
          </p>
          {saving && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Saving...</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 mt-2">
              Error: {error}
            </div>
          )}
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
              <CVEditor cvData={cvData} onChange={handleCVDataChange} />
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
