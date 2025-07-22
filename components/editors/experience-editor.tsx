"use client"

import type { Experience } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface ExperienceEditorProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export function ExperienceEditor({ data, onChange }: ExperienceEditorProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      level: "",
      type: "",
      description: "",
    }
    onChange([...data, newExperience])
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.map((experience, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Experience {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Job Title</Label>
              <Input value={experience.title} onChange={(e) => updateExperience(index, "title", e.target.value)} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={experience.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={experience.location}
                onChange={(e) => updateExperience(index, "location", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Level</Label>
                <Input value={experience.level} onChange={(e) => updateExperience(index, "level", e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Input value={experience.type} onChange={(e) => updateExperience(index, "type", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={experience.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
