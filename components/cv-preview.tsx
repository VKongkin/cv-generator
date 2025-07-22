"use client";

import type { CVData } from "@/types/cv-types";
import { Phone, Mail, Github, Linkedin, MapPin } from "lucide-react";

interface CVPreviewProps {
  cvData: CVData;
}

export function CVPreview({ cvData }: CVPreviewProps) {
  const renderSection = (
    sectionId: string,
    sectionTitle: string,
    sectionType?: "timeline" | "reference"
  ) => {
    if (sectionId === "experience" && cvData.experience.length > 0) {
      return renderTimelineSection(
        sectionTitle,
        cvData.experience.map((exp) => ({
          title: exp.title,
          subtitle: `${exp.company} | ${exp.location}`,
          dates: `${exp.startDate} - ${exp.endDate}`,
          details: `${exp.level} | ${exp.type}`,
          description: exp.description,
        }))
      );
    }

    if (sectionId === "education" && cvData.education.length > 0) {
      return renderTimelineSection(
        sectionTitle,
        cvData.education.map((edu) => ({
          title: edu.degree,
          subtitle: `${edu.institution} | ${edu.location}`,
          dates: `${edu.startDate} - ${edu.endDate}`,
          description: edu.description,
        }))
      );
    }

    if (sectionId === "references" && cvData.references.length > 0) {
      return renderReferenceSection(
        sectionTitle,
        cvData.references.map((ref) => ({
          name: ref.name,
          position: ref.position,
          phone: ref.phone,
          email: ref.email,
        }))
      );
    }

    // Handle custom sections
    const customSection = cvData.customSections.find(
      (cs) => cs.id === sectionId
    );
    if (customSection && customSection.items.length > 0) {
      if (customSection.sectionType === "reference") {
        return renderReferenceSection(
          sectionTitle,
          customSection.items.map((item) => ({
            name: item.title,
            position: item.subtitle || "",
            phone: item.phone || "",
            email: item.email || "",
          }))
        );
      } else {
        return renderTimelineSection(
          sectionTitle,
          customSection.items.map((item) => ({
            title: item.title,
            subtitle:
              item.subtitle && item.location
                ? `${item.subtitle} | ${item.location}`
                : item.subtitle || item.location || "",
            dates:
              item.startDate && item.endDate
                ? `${item.startDate} - ${item.endDate}`
                : item.startDate || item.endDate || "",
            description: item.description,
          }))
        );
      }
    }

    return null;
  };

  const renderTimelineSection = (
    title: string,
    items: Array<{
      title: string;
      subtitle?: string;
      dates?: string;
      details?: string;
      description?: string;
    }>
  ) => (
    <div className="mb-8">
      <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
        {title}
      </h2>
      <div className="relative">
        <ul className="list-none pl-0">
          {items.map((item, index) => (
            <li
              key={item.title + item.subtitle + item.dates + index}
              className="overflow-hidden pl-11 relative mb-9 after:content-[''] after:absolute after:w-0.5 after:h-full after:bg-[#149ac5] after:top-0 after:bottom-0 after:left-2 after:z-10 before:content-[''] before:absolute before:h-4.5 before:w-4.5 before:left-0 before:top-0 before:rounded-full before:z-2 before:bg-[#149ac5]"
            >
              <div className="w-full float-left">
                <h3 className="text-base leading-5 text-[#149ac5] uppercase mb-1">
                  {item.title}
                </h3>
                {(item.subtitle || item.dates || item.details) && (
                  <p className="text-base leading-5 pb-2">
                    {item.subtitle && item.subtitle}
                    {item.dates && (
                      <>
                        <br />
                        {item.dates}
                      </>
                    )}
                    {item.details && (
                      <>
                        <br />
                        {item.details}
                      </>
                    )}
                  </p>
                )}
                {item.description && (
                  <div className="text-base leading-5">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderReferenceSection = (
    title: string,
    items: Array<{
      name: string;
      position: string;
      phone: string;
      email: string;
    }>
  ) => (
    <div className="mb-8">
      <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
        {title}
      </h2>
      {items.map((item, index) => (
        <div
          key={item.name + item.email + index}
          className="inline-block w-full relative mb-6"
        >
          <h3 className="text-base font-bold text-[#149ac5] uppercase mb-1">
            {item.name}
          </h3>
          <p className="text-base mb-2">{item.position}</p>
          {item.phone && (
            <div className="mb-1">
              <span className="text-base"> Phone: </span>
              <a
                href={`tel:${item.phone}`}
                className="text-base no-underline text-[#333333]"
              >
                {item.phone}
              </a>
            </div>
          )}
          {item.email && (
            <div>
              <span className="text-base"> Email: </span>
              <a
                href={`mailto:${item.email}`}
                className="text-base no-underline text-[#333333]"
              >
                {item.email}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const enabledSections = cvData.sectionOrder
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="cv-template w-[210mm] h-[297mm] mx-auto bg-white text-[#333333] flex text-sm leading-tight overflow-hidden">
      {/* Left Column */}
      <div className="w-[35%] min-h-full bg-[#eeeeee]">
        <div className="p-5">
          {/* Profile Section */}
          <div className="text-center mb-11">
            <div className="w-[175px] h-[175px] mx-auto mb-2 overflow-hidden rounded-full border-3 border-[#149ac5] flex items-center justify-center bg-white">
              {cvData.personalDetails.profileImage ? (
                <img
                  src={
                    cvData.personalDetails.profileImage || "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  Photo
                </div>
              )}
            </div>
            <h2 className="font-bold text-2xl leading-7 uppercase text-[#149ac5] mb-1">
              {cvData.personalDetails.fullName}
            </h2>
            <span className="text-base leading-5 uppercase text-black">
              {cvData.personalDetails.position}
            </span>
          </div>

          {/* About Me */}
          <div className="mb-8">
            <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
              About me
            </h2>
            <div className="text-base leading-5">
              {cvData.personalDetails.aboutMe}
            </div>
          </div>

          {/* Training */}
          {cvData.training.length > 0 && (
            <div className="mb-8">
              <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
                Training
              </h2>
              {cvData.training.map((training, index) => (
                <div
                  key={training.title + training.date + index}
                  className="mb-4"
                >
                  <h3 className="text-base font-bold leading-5 uppercase text-[#149ac5]">
                    {training.title}
                  </h3>
                  <p className="text-base leading-5 mb-1">{training.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
                Skill
              </h2>
              {cvData.skills.map((skill, index) => (
                <div key={skill.name + index} className="mb-2">
                  <span className="text-base leading-8">
                    {skill.name} ({skill.level}%)
                  </span>
                  <div className="w-full bg-[#333333] h-4">
                    <div
                      className="h-4 bg-[#149ac5]"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {cvData.languages.length > 0 && (
            <div className="mb-8">
              <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
                Language
              </h2>
              {cvData.languages.map((language, index) => (
                <div key={language.name + index} className="mb-2">
                  <span className="text-base leading-8">{language.name}</span>
                  <div className="w-full bg-[#333333] h-4">
                    <div
                      className="h-4 bg-[#149ac5]"
                      style={{ width: `${language.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          <div className="mb-8">
            <h2 className="relative font-bold text-lg leading-5 uppercase text-[#149ac5] mb-4 border border-[#149ac5] pt-1.5 pb-1.5 pl-11 pr-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-[34px] before:h-[34px] before:bg-[#149ac5]">
              Contact me
            </h2>
            <ul className="pl-0">
              {cvData.personalDetails.phone && (
                <li className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-[#149ac5] flex items-center justify-center mr-2">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base">
                    <a
                      href={`tel:${cvData.personalDetails.phone}`}
                      className="text-[#333333] no-underline"
                    >
                      {cvData.personalDetails.phone}
                    </a>
                  </span>
                </li>
              )}
              {cvData.personalDetails.email && (
                <li className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-[#149ac5] flex items-center justify-center mr-2">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base">
                    <a
                      href={`mailto:${cvData.personalDetails.email}`}
                      className="text-[#333333] no-underline"
                    >
                      {cvData.personalDetails.email}
                    </a>
                  </span>
                </li>
              )}
              {cvData.personalDetails.github && (
                <li className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-[#149ac5] flex items-center justify-center mr-2">
                    <Github className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base">
                    <a
                      href={cvData.personalDetails.github}
                      className="text-[#333333] no-underline"
                    >
                      {cvData.personalDetails.github.replace(
                        "https://github.com/",
                        ""
                      )}
                    </a>
                  </span>
                </li>
              )}
              {cvData.personalDetails.linkedin && (
                <li className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-[#149ac5] flex items-center justify-center mr-2">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base">
                    <a
                      href={cvData.personalDetails.linkedin}
                      className="text-[#333333] no-underline"
                    >
                      {cvData.personalDetails.fullName}
                    </a>
                  </span>
                </li>
              )}
              {cvData.personalDetails.location && (
                <li className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-[#149ac5] flex items-center justify-center mr-2">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base">
                    {cvData.personalDetails.location}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[65%] h-full min-h-full bg-white">
        <div className="p-5">
          {/* Render sections in order */}
          {enabledSections.map((section) =>
            renderSection(section.id, section.title, section.sectionType)
          )}
        </div>
      </div>
    </div>
  );
}
