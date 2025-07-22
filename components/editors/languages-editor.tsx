"use client"

import type { Language } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface LanguagesEditorProps {
  data: Language[]
  onChange: (data: Language[]) => void
}

export function LanguagesEditor({ data, onChange }: LanguagesEditorProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      name: "",
      level: 50,
    }
    onChange([...data, newLanguage])
  }

  const updateLanguage = (index: number, field: keyof Language, value: string | number) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeLanguage = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {data.map((language, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Language {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeLanguage(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Language</Label>
              <Input value={language.name} onChange={(e) => updateLanguage(index, "name", e.target.value)} />
            </div>
            <div>
              <Label>Proficiency Level (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={language.level}
                onChange={(e) => updateLanguage(index, "level", Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
