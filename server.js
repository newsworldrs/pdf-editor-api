const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { PDFDocument, rgb } = require("pdf-lib");

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Edit PDF endpoint
app.post("/edit-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Example: Add text
    firstPage.drawText("Hello from Server!", {
      x: 50,
      y: 700,
      size: 24,
      color: rgb(0, 0.53, 0.71),
    });

    const newPdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(newPdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error editing PDF");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
