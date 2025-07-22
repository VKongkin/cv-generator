"use client"

import type { CustomSection, CustomSectionItem, CVData, CVSection } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, Clock, Users } from "lucide-react"
import { useState } from "react"

interface CustomSectionsEditorProps {
  data: CustomSection[]
  onChange: (data: CustomSection[]) => void
  cvData?: CVData
  onSectionOrderChange?: (sectionOrder: CVSection[]) => void
}

export function CustomSectionsEditor({ data, onChange, cvData, onSectionOrderChange }: CustomSectionsEditorProps) {
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)

  const addSection = (sectionType: "timeline" | "reference" = "timeline") => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: sectionType === "timeline" ? "New Timeline Section" : "New Reference Section",
      sectionType,
      items: [],
    }

    // Create corresponding section order entry
    const newSectionOrder: CVSection = {
      id: newSection.id,
      type: "custom",
      title: newSection.title,
      order: (cvData?.sectionOrder?.length || 0) + 1,
      enabled: true,
      sectionType,
    }

    onChange([...data, newSection])

    // Also update the section order if cvData is available
    if (onSectionOrderChange) {
      onSectionOrderChange([...(cvData?.sectionOrder || []), newSectionOrder])
    }
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    const updated = data.map((section) => (section.id === sectionId ? { ...section, title } : section))
    onChange(updated)

    // Also update section order title
    if (onSectionOrderChange && cvData) {
      const updatedSectionOrder = cvData.sectionOrder.map((section) =>
        section.id === sectionId ? { ...section, title } : section,
      )
      onSectionOrderChange(updatedSectionOrder)
    }
  }

  const updateSectionType = (sectionId: string, sectionType: "timeline" | "reference") => {
    const updated = data.map((section) => (section.id === sectionId ? { ...section, sectionType } : section))
    onChange(updated)

    // Also update section order type
    if (onSectionOrderChange && cvData) {
      const updatedSectionOrder = cvData.sectionOrder.map((section) =>
        section.id === sectionId ? { ...section, sectionType } : section,
      )
      onSectionOrderChange(updatedSectionOrder)
    }
  }

  const removeSection = (sectionId: string) => {
    onChange(data.filter((section) => section.id !== sectionId))

    // Also remove from section order
    if (onSectionOrderChange && cvData) {
      onSectionOrderChange(cvData.sectionOrder.filter((section) => section.id !== sectionId))
    }
  }

  const addItem = (sectionId: string) => {
    const section = data.find((s) => s.id === sectionId)
    const newItem: CustomSectionItem = {
      id: Date.now().toString(),
      title: "",
      subtitle: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      // Add reference fields if it's a reference section
      ...(section?.sectionType === "reference" && { phone: "", email: "" }),
    }
    const updated = data.map((section) =>
      section.id === sectionId ? { ...section, items: [...section.items, newItem] } : section,
    )
    onChange(updated)
  }

  const updateItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    const updated = data.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
          }
        : section,
    )
    onChange(updated)
  }

  const removeItem = (sectionId: string, itemId: string) => {
    const updated = data.map((section) =>
      section.id === sectionId ? { ...section, items: section.items.filter((item) => item.id !== itemId) } : section,
    )
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Sections</h3>
        <div className="flex gap-2">
          <Button onClick={() => addSection("timeline")} size="sm" variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Add Timeline Section
          </Button>
          <Button onClick={() => addSection("reference")} size="sm">
            <Users className="w-4 h-4 mr-2" />
            Add Reference Section
          </Button>
        </div>
      </div>

      {data.map((section) => (
        <Card key={section.id} className="border-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {section.sectionType === "reference" ? (
                  <Users className="w-5 h-5 text-blue-500" />
                ) : (
                  <Clock className="w-5 h-5 text-green-500" />
                )}
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
                    <Button variant="ghost" size="sm" onClick={() => setEditingTitleId(section.id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={section.sectionType}
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
                <Button variant="destructive" size="sm" onClick={() => removeSection(section.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => addItem(section.id)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add {section.sectionType === "reference" ? "Reference" : "Item"}
            </Button>

            {section.items.map((item, itemIndex) => (
              <Card key={item.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      {section.sectionType === "reference" ? "Reference" : "Item"} {itemIndex + 1}
                    </CardTitle>
                    <Button variant="destructive" size="sm" onClick={() => removeItem(section.id, item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>{section.sectionType === "reference" ? "Name" : "Title"}</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(section.id, item.id, "title", e.target.value)}
                    />
                  </div>

                  {section.sectionType === "reference" ? (
                    // Reference-specific fields
                    <>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={item.subtitle || ""}
                          onChange={(e) => updateItem(section.id, item.id, "subtitle", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={item.phone || ""}
                          onChange={(e) => updateItem(section.id, item.id, "phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={item.email || ""}
                          onChange={(e) => updateItem(section.id, item.id, "email", e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    // Timeline-specific fields
                    <>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={item.subtitle || ""}
                          onChange={(e) => updateItem(section.id, item.id, "subtitle", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={item.location || ""}
                          onChange={(e) => updateItem(section.id, item.id, "location", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={item.startDate || ""}
                            onChange={(e) => updateItem(section.id, item.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={item.endDate || ""}
                            onChange={(e) => updateItem(section.id, item.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) => updateItem(section.id, item.id, "description", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
