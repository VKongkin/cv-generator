"use client"

import type { Reference } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface ReferencesEditorProps {
  data: Reference[]
  onChange: (data: Reference[]) => void
}

export function ReferencesEditor({ data, onChange }: ReferencesEditorProps) {
  const addReference = () => {
    const newReference: Reference = {
      name: "",
      position: "",
      phone: "",
      email: "",
    }
    onChange([...data, newReference])
  }

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeReference = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">References</h3>
        <Button onClick={addReference} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </div>

      {data.map((reference, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Reference {index + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => removeReference(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={reference.name} onChange={(e) => updateReference(index, "name", e.target.value)} />
            </div>
            <div>
              <Label>Position</Label>
              <Input value={reference.position} onChange={(e) => updateReference(index, "position", e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={reference.phone} onChange={(e) => updateReference(index, "phone", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={reference.email}
                onChange={(e) => updateReference(index, "email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
