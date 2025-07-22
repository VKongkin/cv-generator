"use client"

import type { Education } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface EducationEditorProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationEditor({ data, onChange }: EducationEditorProps) {
  const addEducation = () => {
    const newEducation: Education = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    onChange([...data, newEducation])
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.map((education, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Education {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Degree</Label>
              <Input value={education.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
            </div>
            <div>
              <Label>Institution</Label>
              <Input
                value={education.institution}
                onChange={(e) => updateEducation(index, "institution", e.target.value)}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={education.location} onChange={(e) => updateEducation(index, "location", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={education.startDate}
                  onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input value={education.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={education.description || ""}
                onChange={(e) => updateEducation(index, "description", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
