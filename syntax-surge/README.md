# Syntax Surge

A futuristic AI vision experimentation platform built entirely in the browser.
**Created by Aditya.**

## Overview

Syntax Surge is a premium cyberpunk-themed developer tool that bundles six AI-powered visual analysis modules into a single, fast, client-side web application. No backend, no subscriptions, no data ever leaves your device.

## Features

| Module | File | Description |
|---|---|---|
| AI Lens Scanner | `lens.html` | Google Lens-style image analysis with semantic tagging |
| OCR Text Extraction | `ocr.html` | Tesseract.js-powered text extraction from images |
| Scan to PDF | `pdf.html` | jsPDF-powered image-to-PDF converter |
| Object Detection | `object-detect.html` | Canvas-rendered bounding box detection |
| Species ID | `species-id.html` | Plant and animal identification with confidence ring |
| Landmark Recognition | `landmark.html` | World landmark identification with geo context |

## Tech Stack

- **HTML / CSS / JavaScript** — zero frameworks
- **Tesseract.js** — OCR engine
- **jsPDF** — PDF generation
- **Canvas API** — drawing and object detection rendering
- **MediaDevices API** — live camera support on mobile

## Design

- Dark cyberpunk UI with neon green (#00ff88) accents
- Glassmorphism surfaces and depth
- Floating particle system with mouse interaction
- Custom cursor with trail effect
- Scan-line animation overlay
- Animated terminal on the home page
- Smooth reveal-on-scroll throughout
- Fully responsive — mobile first

## Project Structure

```
syntax-surge/
├── index.html          — Landing page + terminal
├── lens.html           — AI Lens scanner
├── ocr.html            — OCR text extraction
├── pdf.html            — Scan to PDF
├── object-detect.html  — Object detection
├── species-id.html     — Species identification
├── landmark.html       — Landmark recognition
├── about.html          — About + tech info
├── css/
│   └── style.css       — All styles
├── js/
│   └── script.js       — All JavaScript
└── assets/             — (for any future static assets)
```

## Running Locally

No build step required. Simply open `index.html` in a browser, or serve from any static file server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Notes on AI Modules

- **OCR**: Uses Tesseract.js loaded from CDN on demand. Works best with high-contrast images. Accuracy depends on image clarity.
- **PDF**: Uses jsPDF loaded from CDN. Image is fitted to A4 with a Syntax Surge watermark footer.
- **Object Detection / Lens / Species / Landmark**: These use a simulated inference pipeline for the UI demonstration. In a production build, these would connect to a real ML model (e.g., TensorFlow.js COCO-SSD for objects, a classification model for species/landmark).

---

*Syntax Surge — see what machines see.*
