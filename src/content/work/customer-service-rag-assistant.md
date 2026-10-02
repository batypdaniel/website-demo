---
# ── Card & page details ──────────────────────────────────────────────────────
title: AI Customer Service Assistant
url: customer-service-assistant
description: A retrieval-augmented (RAG) assistant that answers customer questions from a business's own policies and help articles, with sources for every answer.
kind: Interactive demo # "Live demo", "Interactive demo" or "Case study" - shown as a tag on the card
order: 1 # lower numbers are listed first
featured: true # show on the home page (up to 3)
draft: false
# Slugs from src/_data/services.js - the demo appears on these service pages
relatedServices:
    - ai-solutions
    - automation
    - software-development
stack:
    - Python
    - LLM
    - Vector search
    - RAG
image: /assets/images/work/customer-service-assistant.jpg
imageAlt: The assistant answering "Can I return a bike after I've ridden it?", showing the passages it retrieved with relevance scores, a cited answer, and the matching passage highlighted in the bike shop's returns policy
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

## The Problem

For the small team at the fictional Midtown Cycle Co., it can be difficult to respond to every customer's question over email in a timely fashion, leading to customers being confused about company policies and service agreements and potentially losing interest in purchasing from the store.  Midtown Cycle Co. has a set of documents that outline their company policy, but the documents are too large to ask customers to scour over them each time they have a question.  They need a way for customers to be directed to the correct information on their questions, without having to spend hours responding to emails.

## The Approach

This kind of problem is perfect for a retrieval-augmented generation (RAG) pipeline, an AI workflow which answers questions using the following steps:

- Ingests the business's own documents (policies, FAQs, product info) and splits them into searchable chunks
- Retrieves the most relevant passages for each question and has a language model answer **only** from those sources
- Cites the source for every answer and hands off to a person when it isn't confident

All together, the pipeline can successfully answer questions whose answers are written in the documentation, without inventing answers when the question is off-topic or information isn't present.  This AI customer service assistant takes all the easy-to-answer questions off the business owner's plate, gives customers immediate, correct answers, but still lets the business owner handle more complex questions with customers directly.

## The Results

A tool like this AI customer service assistant could save business owners and managers hours each week, leaving them time to run the rest of their business effectively, while still getting customers the information they need.  This model can be used over email, website chatbot, or a dedicated web application.

In general, RAG pipelines like this one can be used for any task that requires quick location of specific information out of a large set of documentation.  Other than customer service, a similar setup could be used for an internal employee search engine over HR policies, a legal assistant that can answer questions about specific clauses in leases or contracts, and many other applications.
