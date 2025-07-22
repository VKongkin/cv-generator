"use client"

import type { Skill } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface SkillsEditorProps {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

export function SkillsEditor({ data, onChange }: SkillsEditorProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      name: "",
      level: 50,
    }
    onChange([...data, newSkill])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Skills</h3>
        <Button onClick={addSkill} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {data.map((skill, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Skill {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeSkill(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Skill Name</Label>
              <Input value={skill.name} onChange={(e) => updateSkill(index, "name", e.target.value)} />
            </div>
            <div>
              <Label>Level (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkill(index, "level", Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
