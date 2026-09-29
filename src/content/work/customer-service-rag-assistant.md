---
# ── Card & page details ──────────────────────────────────────────────────────
title: AI Customer Service Assistant
url: customer-service-assistant
description: A retrieval-augmented (RAG) assistant that answers customer questions from a business's own policies and help articles, with sources for every answer.
kind: Interactive demo # "Live demo", "Interactive demo" or "Case study" - shown as a tag on the card
order: 1 # lower numbers are listed first
featured: true # show on the home page (up to 3)
draft: true # TODO: set to false (or delete this line) when the write-up is ready
# Slugs from src/_data/services.js - the demo appears on these service pages
relatedServices:
    - ai-solutions
    - software-development
stack:
    - Python
    - LLM
    - Vector search
    - RAG
image: /assets/images/work/customer-service-assistant.jpg # TODO: replace with a screenshot (1600x900 works well)
imageAlt: Illustration of an AI assistant answering a customer question
# ── Demo ─────────────────────────────────────────────────────────────────────
# interactiveDemo: rag replays pre-recorded pipeline outputs from src/_data/ragDemo.json
# (no API calls). Remove it to use demoUrl below instead.
interactiveDemo: rag
# demoUrl: link to the running app. Leave "" and the page shows "Demo coming soon".
# demoEmbed: true shows the app inside the page (Streamlit, Hugging Face Spaces, Gradio...);
#            false shows a button that opens it in a new tab.
demoUrl: "" # optional: a live version, if you ever deploy one
demoEmbed: true
repoUrl: "" # optional: public GitHub link
---

<!-- TODO: replace the placeholder text below with your write-up. Keep the three headings - they make the page easy to scan. -->

## The problem

Small teams answer the same customer questions every day - return policies, shipping times, hours, how-to steps. Answers live in PDFs, help pages and people's heads, so responses are slow and inconsistent.

## The approach

- Ingests the business's own documents (policies, FAQs, product info) and splits them into searchable chunks
- Retrieves the most relevant passages for each question and has a language model answer **only** from those sources
- Cites the source for every answer and hands off to a person when it isn't confident

## Results & takeaways

Describe what the demo shows: example questions, accuracy you measured, response time, and how a business would roll it out (website chat widget, internal help desk tool, email drafting).
