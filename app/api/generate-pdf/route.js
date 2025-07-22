import puppeteer from "puppeteer";

export async function POST(req) {
  let cvData = null;
  let useLivePreview = false;
  try {
    const body = await req.text();
    console.log("[API] Raw POST body:", body);
    const parsed = JSON.parse(body);
    cvData = parsed.cvData;
    useLivePreview = !!parsed.useLivePreview;
    console.log("[API] Received cvData from client:", cvData);
  } catch (e) {
    console.log("[API] Error parsing POST body:", e);
    cvData = null;
  }

  let previewUrl = `http://localhost:3000/cv/preview${
    useLivePreview ? "" : "/pdf"
  }`;
  if (cvData) {
    const encoded = encodeURIComponent(
      typeof cvData === "string" ? cvData : JSON.stringify(cvData)
    );
    previewUrl += `?cvData=${encoded}`;
  }
  console.log("[API] Puppeteer previewUrl:", previewUrl);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(previewUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector(".cv-template", { timeout: 30000 });
  // Wait for all images to load
  await page.evaluate(async () => {
    const selectors = Array.from(document.images)
      .map((img) => {
        if (img.complete) return null;
        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve);
        });
      })
      .filter(Boolean);
    await Promise.all(selectors);
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=cv.pdf",
    },
  });
}
