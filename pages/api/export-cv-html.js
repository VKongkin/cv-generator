export default async function handler(req, res) {
  // TODO: Replace this with your real CV HTML rendering logic
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>CV Export</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #149ac5; }
        </style>
      </head>
      <body>
        <h1>My CV</h1>
        <p>This is a static HTML export of the CV.</p>
        <!-- Insert your real CV HTML here -->
      </body>
    </html>
  `;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
