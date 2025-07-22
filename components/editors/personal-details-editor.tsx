"use client"

import type { PersonalDetails } from "@/types/cv-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"

interface PersonalDetailsEditorProps {
  data: PersonalDetails
  onChange: (data: PersonalDetails) => void
}

export function PersonalDetailsEditor({ data, onChange }: PersonalDetailsEditorProps) {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={data.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Input id="position" value={data.position} onChange={(e) => handleChange("position", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="aboutMe">About Me</Label>
        <Textarea
          id="aboutMe"
          value={data.aboutMe}
          onChange={(e) => handleChange("aboutMe", e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <ImageUpload value={data.profileImage} onChange={(imageUrl) => handleChange("profileImage", imageUrl)} />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={data.email} onChange={(e) => handleChange("email", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="github">GitHub</Label>
        <Input id="github" value={data.github || ""} onChange={(e) => handleChange("github", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" value={data.linkedin || ""} onChange={(e) => handleChange("linkedin", e.target.value)} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={data.location} onChange={(e) => handleChange("location", e.target.value)} />
      </div>
    </div>
  )
}
