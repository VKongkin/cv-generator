"use client"

import type { CVData, CVSection, CustomSection } from "@/types/cv-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ChevronUp, ChevronDown, GripVertical, Edit2, Clock, Users } from "lucide-react"
import { useState } from "react"

interface SectionOrderEditorProps {
  cvData: CVData
  onChange: (data: CVData) => void
}

export function SectionOrderEditor({ cvData, onChange }: SectionOrderEditorProps) {
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)

  const addCustomSection = (sectionType: "timeline" | "reference" = "timeline") => {
    const newCustomSection: CustomSection = {
      id: Date.now().toString(),
      title: sectionType === "timeline" ? "New Timeline Section" : "New Reference Section",
      sectionType,
      items: [],
    }

    const newSection: CVSection = {
      id: newCustomSection.id,
      type: "custom",
      title: newCustomSection.title,
      order: cvData.sectionOrder.length + 1,
      enabled: true,
      sectionType,
    }

    onChange({
      ...cvData,
      customSections: [...cvData.customSections, newCustomSection],
      sectionOrder: [...cvData.sectionOrder, newSection].sort((a, b) => a.order - b.order),
    })
  }

  const removeCustomSection = (sectionId: string) => {
    onChange({
      ...cvData,
      customSections: cvData.customSections.filter((section) => section.id !== sectionId),
      sectionOrder: cvData.sectionOrder.filter((section) => section.id !== sectionId),
    })
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    const updatedSectionOrder = cvData.sectionOrder.map((section) =>
      section.id === sectionId ? { ...section, title } : section,
    )

    const updatedCustomSections = cvData.customSections.map((section) =>
      section.id === sectionId ? { ...section, title } : section,
    )

    onChange({
      ...cvData,
      sectionOrder: updatedSectionOrder,
      customSections: updatedCustomSections,
    })
  }

  const updateSectionType = (sectionId: string, sectionType: "timeline" | "reference") => {
    const updatedSectionOrder = cvData.sectionOrder.map((section) =>
      section.id === sectionId ? { ...section, sectionType } : section,
    )

    const updatedCustomSections = cvData.customSections.map((section) =>
      section.id === sectionId ? { ...section, sectionType } : section,
    )

    onChange({
      ...cvData,
      sectionOrder: updatedSectionOrder,
      customSections: updatedCustomSections,
    })
  }

  const toggleSection = (sectionId: string, enabled: boolean) => {
    const updatedSectionOrder = cvData.sectionOrder.map((section) =>
      section.id === sectionId ? { ...section, enabled } : section,
    )

    onChange({
      ...cvData,
      sectionOrder: updatedSectionOrder,
    })
  }

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sections = [...cvData.sectionOrder].sort((a, b) => a.order - b.order)
    const currentIndex = sections.findIndex((section) => section.id === sectionId)

    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === sections.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    // Swap the sections
    const temp = sections[currentIndex]
    sections[currentIndex] = sections[newIndex]
    sections[newIndex] = temp

    // Update order numbers
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index + 1,
    }))

    onChange({
      ...cvData,
      sectionOrder: updatedSections,
    })
  }

  const getSectionIcon = (section: CVSection) => {
    if (section.type === "custom") {
      return section.sectionType === "reference" ? <Users className="w-4 h-4" /> : <Clock className="w-4 h-4" />
    }
    if (section.type === "references") return <Users className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  const getSectionTypeLabel = (section: CVSection) => {
    if (section.type === "custom") {
      return section.sectionType === "reference" ? "Reference Style" : "Timeline Style"
    }
    if (section.type === "references") return "Reference Style"
    return "Timeline Style"
  }

  const getItemCount = (section: CVSection) => {
    switch (section.type) {
      case "experience":
        return cvData.experience.length
      case "education":
        return cvData.education.length
      case "references":
        return cvData.references.length
      case "custom":
        return cvData.customSections.find((cs) => cs.id === section.id)?.items.length || 0
      default:
        return 0
    }
  }

  const sortedSections = [...cvData.sectionOrder].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Section Management</h3>
          <p className="text-sm text-gray-600">Reorder sections and manage their visibility</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => addCustomSection("timeline")} size="sm" variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Add Timeline Section
          </Button>
          <Button onClick={() => addCustomSection("reference")} size="sm">
            <Users className="w-4 h-4 mr-2" />
            Add Reference Section
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedSections.map((section, index) => (
          <Card
            key={section.id}
            className={`border-2 ${section.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{section.order}</span>
                    {getSectionIcon(section)}
                    {editingTitleId === section.id ? (
                      <Input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        onBlur={() => setEditingTitleId(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingTitleId(null)}
                        className="text-lg font-semibold"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        {(section.type === "custom" || section.type === "references") && (
                          <Button variant="ghost" size="sm" onClick={() => setEditingTitleId(section.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {section.type === "custom" && (
                    <Select
                      value={section.sectionType || "timeline"}
                      onValueChange={(value: "timeline" | "reference") => updateSectionType(section.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timeline">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Timeline
                          </div>
                        </SelectItem>
                        <SelectItem value="reference">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Reference
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`section-${section.id}`} className="text-sm">
                      {section.enabled ? "Visible" : "Hidden"}
                    </Label>
                    <Switch
                      id={`section-${section.id}`}
                      checked={section.enabled}
                      onCheckedChange={(enabled) => toggleSection(section.id, enabled)}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sortedSections.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {section.type === "custom" && (
                    <Button variant="destructive" size="sm" onClick={() => removeCustomSection(section.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{getItemCount(section)} entries</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{getSectionTypeLabel(section)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedSections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No sections available. Add a custom section to get started.</p>
        </div>
      )}
    </div>
  )
}
