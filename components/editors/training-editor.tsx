"use client"

import type { Training } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface TrainingEditorProps {
  data: Training[]
  onChange: (data: Training[]) => void
}

export function TrainingEditor({ data, onChange }: TrainingEditorProps) {
  const addTraining = () => {
    const newTraining: Training = {
      title: "",
      date: "",
      details: "",
    }
    onChange([...data, newTraining])
  }

  const updateTraining = (index: number, field: keyof Training, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeTraining = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Training</h3>
        <Button onClick={addTraining} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Training
        </Button>
      </div>

      {data.map((training, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Training {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeTraining(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Training Title</Label>
              <Input value={training.title} onChange={(e) => updateTraining(index, "title", e.target.value)} />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={training.date} onChange={(e) => updateTraining(index, "date", e.target.value)} />
            </div>
            <div>
              <Label>Details</Label>
              <Textarea
                value={training.details || ""}
                onChange={(e) => updateTraining(index, "details", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
