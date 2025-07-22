"use client"
import type { CVData } from "@/types/cv-types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalDetailsEditor } from "@/components/editors/personal-details-editor"
import { ExperienceEditor } from "@/components/editors/experience-editor"
import { EducationEditor } from "@/components/editors/education-editor"
import { SkillsEditor } from "@/components/editors/skills-editor"
import { LanguagesEditor } from "@/components/editors/languages-editor"
import { ReferencesEditor } from "@/components/editors/references-editor"
import { TrainingEditor } from "@/components/editors/training-editor"
import { CustomSectionsEditor } from "@/components/editors/custom-sections-editor"
import { SectionOrderEditor } from "@/components/editors/section-order-editor"

interface CVEditorProps {
  cvData: CVData
  onChange: (data: CVData) => void
}

export function CVEditor({ cvData, onChange }: CVEditorProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="sections">Sections</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
      </TabsList>

      <TabsList className="grid w-full grid-cols-6 mb-6">
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="languages">Languages</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
        <TabsTrigger value="references">References</TabsTrigger>
        <TabsTrigger value="custom">Custom</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalDetailsEditor
          data={cvData.personalDetails}
          onChange={(personalDetails) => onChange({ ...cvData, personalDetails })}
        />
      </TabsContent>

      <TabsContent value="sections">
        <SectionOrderEditor cvData={cvData} onChange={onChange} />
      </TabsContent>

      <TabsContent value="experience">
        <ExperienceEditor data={cvData.experience} onChange={(experience) => onChange({ ...cvData, experience })} />
      </TabsContent>

      <TabsContent value="education">
        <EducationEditor data={cvData.education} onChange={(education) => onChange({ ...cvData, education })} />
      </TabsContent>

      <TabsContent value="skills">
        <SkillsEditor data={cvData.skills} onChange={(skills) => onChange({ ...cvData, skills })} />
      </TabsContent>

      <TabsContent value="languages">
        <LanguagesEditor data={cvData.languages} onChange={(languages) => onChange({ ...cvData, languages })} />
      </TabsContent>

      <TabsContent value="training">
        <TrainingEditor data={cvData.training} onChange={(training) => onChange({ ...cvData, training })} />
      </TabsContent>

      <TabsContent value="references">
        <ReferencesEditor data={cvData.references} onChange={(references) => onChange({ ...cvData, references })} />
      </TabsContent>

      <TabsContent value="custom">
        <CustomSectionsEditor
          data={cvData.customSections}
          onChange={(customSections) => onChange({ ...cvData, customSections })}
          cvData={cvData}
          onSectionOrderChange={(sectionOrder) => onChange({ ...cvData, sectionOrder })}
        />
      </TabsContent>
    </Tabs>
  )
}
