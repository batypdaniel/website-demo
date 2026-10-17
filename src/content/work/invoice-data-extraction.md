---
# ── Card & page details ──────────────────────────────────────────────────────
title: Invoice Data Extraction
url: invoice-data-extraction
description: An AI pipeline that reads supplier invoices - clean PDFs or messy scans - and pulls out the key fields and line items, with a confidence score for every value.
kind: Interactive demo # "Live demo", "Interactive demo" or "Case study" - shown as a tag on the card
order: 4 # lower numbers are listed first
featured: false # the home page already shows 3 featured demos
draft: true # TODO: set to false once the recorded invoices/outputs and write-up are in
# Slugs from src/_data/services.js - the demo appears on these service pages
relatedServices:
    - ai-solutions
    - automation
stack:
    - Python
    - OCR
image: /assets/images/work/invoice-extraction.jpg # TODO: replace with a screenshot of the finished demo
imageAlt: The invoice extraction demo showing a supplier invoice with extracted fields boxed on the page, next to a table of values and confidence scores
# ── Demo ─────────────────────────────────────────────────────────────────────
# interactiveDemo: invoice replays pre-recorded pipeline outputs from src/_data/invoiceDemo.json
# (no API calls). Invoice page images live in src/assets/images/invoice-demo/.
interactiveDemo: invoice
demoUrl: ""
demoEmbed: true
repoUrl: "" # optional: public GitHub link
---


## The Problem

This fictional plumbing/HVAC company, Ironwood Plumbing and Heating, has to manually handle every invoice from suppliers and vendors they use, including scanning through emails, making payments, and keeping records for every invoice they receive.  The owner at Ironwood spends several hours each week handling these invoices, rather than managing employees and helping customers.  This owner would greatly benefit from automating as much of the invoice handling process as possible, in such a way that saves time, ensures accuracy of company records, and still allows for the owner's continued oversight of the company's finances.

## The Approach

This demo shows a tool that takes in an image or PDF of an invoice, extracts all the key fields, and saves them in an organized table.  Additionally, low-confidence extractions on lower-quality images are marked for review.  This way, the company owner can automate as much as possible but still make corrections where necessary.

## The Results

In an actual client use case, this could connected to an email address, where PDF attachments are automatically detected or uploaded as a photo from a mobile phone.  Also, an application can be built around this functionality to be reviewed by a manager and trigger different actions:  save to company records, send a payment to the issuer of the invoice, or defer until later.

This setup for invoice handling allows most of the invoice collection, handling, and payment processes to be automated, opening up more time for the company owner to do other, more important tasks.