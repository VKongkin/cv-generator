import type { CVData } from "@/types/cv-types";

/**
 * Generate a real A4 PDF using html2pdf library
 */
export async function generatePDF(domNode: HTMLElement) {
  // Wait for html2pdf to be available
  const html2pdf = await waitForHtml2pdf();

  if (!html2pdf) {
    throw new Error(
      "html2pdf library failed to load. Please check your internet connection and try again."
    );
  }

  // Clone the node to avoid side effects
  const clone = domNode.cloneNode(true) as HTMLElement;
  clone.style.background = "#fff"; // ensure white background
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  document.body.appendChild(clone);

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: "CV.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(clone)
      .save();
  } finally {
    // Clean up
    document.body.removeChild(clone);
  }
}

/**
 * Wait for html2pdf to be available on the window object
 */
function waitForHtml2pdf(): Promise<any> {
  return new Promise((resolve) => {
    // Check if html2pdf is already available
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf);
      return;
    }

    // Wait for the script to load
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait time

    const checkForHtml2pdf = () => {
      attempts++;

      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
      } else if (attempts >= maxAttempts) {
        resolve(null);
      } else {
        setTimeout(checkForHtml2pdf, 100);
      }
    };

    checkForHtml2pdf();
  });
}

function generateTimelineSection(
  cvData: CVData,
  sectionId: string,
  sectionTitle: string,
  sectionType?: "timeline" | "reference"
): string {
  if (sectionId === "experience" && cvData.experience.length > 0) {
    return `
      <div class="section">
        <h2 class="heading">${sectionTitle}</h2>
        <ul class="timeline">
          ${cvData.experience
            .map(
              (exp) => `
            <li>
              <div>
                <h3 class="timeline-ttl">${exp.title}</h3>
                <p class="timeline-location">
                  ${exp.company} | ${exp.location}<br>
                  ${exp.startDate} - ${exp.endDate}<br>
                  ${exp.level} | ${exp.type}
                </p>
                <div class="timeline-content">${exp.description}</div>
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  if (sectionId === "education" && cvData.education.length > 0) {
    return `
      <div class="section">
        <h2 class="heading">${sectionTitle}</h2>
        <ul class="timeline">
          ${cvData.education
            .map(
              (edu) => `
            <li>
              <div>
                <h3 class="timeline-ttl">${edu.degree}</h3>
                <p class="timeline-location">
                  ${edu.institution} | ${edu.location}<br>
                  ${edu.startDate} - ${edu.endDate}
                </p>
                ${
                  edu.description
                    ? `<div class="timeline-content">${edu.description}</div>`
                    : ""
                }
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  if (sectionId === "references" && cvData.references.length > 0) {
    return `
      <div class="section">
        <h2 class="heading">${sectionTitle}</h2>
        ${cvData.references
          .map(
            (ref) => `
          <div class="reference__item">
            <h3 class="reference__name">${ref.name}</h3>
            <p class="reference__position">${ref.position}</p>
            ${
              ref.phone
                ? `<div class="reference__contact">
              <span>Phone: </span>
              <a href="tel:${ref.phone}">${ref.phone}</a>
            </div>`
                : ""
            }
            ${
              ref.email
                ? `<div class="reference__contact">
              <span>Email: </span>
              <a href="mailto:${ref.email}">${ref.email}</a>
            </div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Handle custom sections
  const customSection = cvData.customSections.find((cs) => cs.id === sectionId);
  if (customSection && customSection.items.length > 0) {
    if (customSection.sectionType === "reference") {
      return `
        <div class="section">
          <h2 class="heading">${sectionTitle}</h2>
          ${customSection.items
            .map(
              (item) => `
            <div class="reference__item">
              <h3 class="reference__name">${item.title}</h3>
              <p class="reference__position">${item.subtitle || ""}</p>
              ${
                item.phone
                  ? `<div class="reference__contact">
                <span>Phone: </span>
                <a href="tel:${item.phone}">${item.phone}</a>
              </div>`
                  : ""
              }
              ${
                item.email
                  ? `<div class="reference__contact">
                <span>Email: </span>
                <a href="mailto:${item.email}">${item.email}</a>
              </div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else {
      return `
        <div class="section">
          <h2 class="heading">${sectionTitle}</h2>
          <ul class="timeline">
            ${customSection.items
              .map(
                (item) => `
              <li>
                <div>
                  <h3 class="timeline-ttl">${item.title}</h3>
                  ${
                    item.subtitle ||
                    item.location ||
                    item.startDate ||
                    item.endDate
                      ? `
                  <p class="timeline-location">
                    ${item.subtitle ? item.subtitle : ""}${
                          item.location ? ` | ${item.location}` : ""
                        }
                    ${
                      item.startDate || item.endDate
                        ? `<br>${item.startDate || ""} ${
                            item.endDate ? `- ${item.endDate}` : ""
                          }`
                        : ""
                    }
                  </p>
                  `
                      : ""
                  }
                  ${
                    item.description
                      ? `<div class="timeline-content">${item.description}</div>`
                      : ""
                  }
                </div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    }
  }

  return "";
}

function generatePrintHTML(cvData: CVData): string {
  const enabledSections = cvData.sectionOrder
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CV - ${cvData.personalDetails.fullName}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          border: 0;
          vertical-align: baseline;
          line-height: 1.1;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          width: 210mm;
          height: 297mm;
          display: flex;
          color: #333333;
          word-break: break-word;
          font-size: 14px;
          overflow: hidden;
        }
        
        .left {
          width: 35%;
          min-height: 297mm;
          background-color: #eeeeee;
        }
        
        .left__inner {
          padding: 20px;
        }
        
        .profile {
          padding: 0;
          margin-bottom: 44px;
          text-align: center;
        }
        
        .profile__img-container {
          width: 175px;
          height: 175px;
          margin: 0 auto 8px auto;
          overflow: hidden;
          border-radius: 50%;
          border: 3px solid #149ac5;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        
        .profile__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .full-name {
          font-weight: bold;
          font-size: 24px;
          line-height: 28px;
          text-transform: uppercase;
          color: #149ac5 !important;
          margin-bottom: 4px;
        }
        
        .position {
          font-size: 16px;
          line-height: 19px;
          text-transform: uppercase;
          color: #000000;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .heading {
          position: relative;
          font-weight: bold;
          font-size: 18px;
          line-height: 21px;
          text-transform: uppercase;
          color: #149ac5 !important;
          margin-bottom: 16px;
          border: 1px solid #149ac5;
          padding: 6px 16px 6px 45px;
        }
        
        .heading:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 34px;
          height: 34px;
          background-color: #149ac5;
        }
        
        .about-me__txt {
          font-size: 16px;
          line-height: 19px;
        }
        
        .ach {
          margin-bottom: 15px;
        }
        
        .ach__ttl {
          font-size: 16px;
          font-weight: bold;
          line-height: 19px;
          text-transform: uppercase;
          color: #149ac5 !important;
        }
        
        .ach__date {
          font-size: 16px;
          line-height: 19px;
          margin-bottom: 5px;
        }
        
        .skill__ttl {
          font-size: 16px;
          line-height: 30px;
        }
        
        .skill__level {
          width: 100%;
          background-color: #333333;
          height: 16px;
          margin-bottom: 8px;
        }
        
        .skill__level-percentage {
          height: 16px;
          background-color: #149ac5;
        }
        
        .contact-info {
          padding-left: 0;
          list-style: none;
        }
        
        .contact-info li {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        
        .contact-icon {
          width: 24px;
          height: 24px;
          background-color: #149ac5;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .contact-info__text {
          font-size: 16px;
        }
        
        .contact-info__text a {
          color: #333333;
          text-decoration: none;
        }
        
        .right {
          width: 65%;
          height: 100%;
          min-height: 297mm;
          background-color: #ffffff;
        }
        
        .right__inner {
          padding: 20px;
        }
        
        .timeline {
          list-style: none;
          padding-left: 0;
        }
        
        .timeline li {
          overflow: hidden;
          padding-left: 45px;
          position: relative;
          margin-bottom: 36px;
        }
        
        .timeline li:after {
          content: "";
          position: absolute;
          width: 2px;
          height: 100%;
          background-color: #149ac5;
          top: 0;
          left: 8px;
          z-index: 10;
        }
        
        .timeline li:before {
          content: "";
          position: absolute;
          height: 18px;
          width: 18px;
          left: 0;
          top: 0;
          border-radius: 50%;
          z-index: 2;
          background-color: #149ac5;
        }
        
        .timeline-ttl {
          font-size: 16px;
          line-height: 19px;
          color: #149ac5;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        
        .timeline-location {
          font-size: 16px;
          line-height: 19px;
          padding-bottom: 10px;
        }
        
        .timeline-content {
          font-size: 16px;
          line-height: 19px;
        }
        
        .timeline-content ul {
          padding-left: 20px;
        }
        
        .timeline-content li {
          margin-bottom: 5px;
        }
        
        .reference__item {
          margin-bottom: 25px;
        }
        
        .reference__name {
          font-size: 16px;
          font-weight: bold;
          color: #149ac5 !important;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .reference__position {
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .reference__contact {
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .reference__contact a {
          text-decoration: none;
          color: #333333;
        }
      </style>
    </head>
    <body>
      <div class="left">
        <div class="left__inner">
          <div class="profile">
            <div class="profile__img-container">
              ${
                cvData.personalDetails.profileImage
                  ? `<img src="${cvData.personalDetails.profileImage}" alt="Profile" class="profile__img">`
                  : '<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">Photo</div>'
              }
            </div>
            <h2 class="full-name">${cvData.personalDetails.fullName}</h2>
            <span class="position">${cvData.personalDetails.position}</span>
          </div>
          <div class="section">
            <h2 class="heading">About me</h2>
            <div class="about-me__txt">${cvData.personalDetails.aboutMe}</div>
          </div>
          ${
            cvData.training.length > 0
              ? `<div class="section">
                <h2 class="heading">Training</h2>
                ${cvData.training
                  .map(
                    (training) => `
                      <div class="ach">
                        <h3 class="ach__ttl">${training.title}</h3>
                        <p class="ach__date">${training.date}</p>
                      </div>
                    `
                  )
                  .join("")}
              </div>`
              : ""
          }
          ${
            cvData.skills.length > 0
              ? `<div class="section">
                <h2 class="heading">Skill</h2>
                ${cvData.skills
                  .map(
                    (skill) => `
                      <div style="margin-bottom: 8px;">
                        <span class="skill__ttl">${skill.name} (${skill.level}%)</span>
                        <div class="skill__level">
                          <div class="skill__level-percentage" style="width: ${skill.level}%;"></div>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>`
              : ""
          }
          ${
            cvData.languages.length > 0
              ? `<div class="section">
                <h2 class="heading">Language</h2>
                ${cvData.languages
                  .map(
                    (language) => `
                      <div style="margin-bottom: 8px;">
                        <span class="skill__ttl">${language.name}</span>
                        <div class="skill__level">
                          <div class="skill__level-percentage" style="width: ${language.level}%;"></div>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>`
              : ""
          }
          <div class="section">
            <h2 class="heading">Contact me</h2>
            <ul class="contact-info">
              ${
                cvData.personalDetails.phone
                  ? `<li><div class="contact-icon"></div><span class="contact-info__text"><a href="tel:${cvData.personalDetails.phone}">${cvData.personalDetails.phone}</a></span></li>`
                  : ""
              }
              ${
                cvData.personalDetails.email
                  ? `<li><div class="contact-icon"></div><span class="contact-info__text"><a href="mailto:${cvData.personalDetails.email}">${cvData.personalDetails.email}</a></span></li>`
                  : ""
              }
              ${
                cvData.personalDetails.github
                  ? `<li><div class="contact-icon"></div><span class="contact-info__text"><a href="${
                      cvData.personalDetails.github
                    }">${cvData.personalDetails.github.replace(
                      "https://github.com/",
                      ""
                    )}</a></span></li>`
                  : ""
              }
              ${
                cvData.personalDetails.linkedin
                  ? `<li><div class="contact-icon"></div><span class="contact-info__text"><a href="${cvData.personalDetails.linkedin}">${cvData.personalDetails.fullName}</a></span></li>`
                  : ""
              }
              ${
                cvData.personalDetails.location
                  ? `<li><div class="contact-icon"></div><span class="contact-info__text">${cvData.personalDetails.location}</span></li>`
                  : ""
              }
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right__inner">
          ${enabledSections
            .map((section) =>
              generateTimelineSection(
                cvData,
                section.id,
                section.title,
                section.sectionType
              )
            )
            .join("")}
        </div>
      </div>
    </body>
    </html>
  `;
}
