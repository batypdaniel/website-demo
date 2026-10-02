---
title: Business Analytics Dashboard # TODO: your app's name
url: business-analytics-dashboard # TODO
description: An interactive Streamlit dashboard that turns raw business data into clear KPIs and trends. # TODO
kind: Live demo
order: 3
featured: true
draft: false # TODO: set to false (or delete this line) when the write-up is ready
relatedServices:
    - data-analytics
stack:
    - Python
    - Streamlit
    - SQL
    - Plotly
image: /assets/images/work/local-grind-dashboard.jpg
imageAlt: The Local Grind Coffee Co. sales dashboard, showing date, region, store and category filters, KPI cards for revenue, profit and margin, and a revenue-over-time chart
demoUrl: "https://dashboard-demo-batypdaniel.streamlit.app/" 
demoEmbed: true
demoAutoload: true
repoUrl: ""
---

## The Problem

Local Grind Coffee Co. is a fictional coffee shop chain with eight locations across the Memphis and Nashville metro areas and Mississippi. Every sale is recorded by a point-of-sale system, but that data sits in exports and spreadsheets on different systems that nobody has time to dig through. Owners and managers end up running the business on gut feel, without a clear picture of how each location is performing, which menu items are pulling their weight, or who their customers actually are. Ultimately, this business needs quick answers to the following questions:

- How is revenue trending at each location, and which stores are over- or under-performing?
- Which items sell best, and how much do seasonal menu items contribute while they're available?
- How do new customers, returning customers, and rewards members differ in how much and how they spend?

## The Approach

This demo is an interactive dashboard that turns a year of raw sales transactions into clear KPIs and charts. Filters for date range, region, store, and product category at the top of the page update every number and chart at once, so the same dashboard answers questions for the whole company or for a single location. Headline figures such as revenue, gross profit, margin, transaction count, average ticket, and items sold are always visible at the top.

Each tab of the dashboard displays the following:

**Overview**: Daily revenue over time with a 7-day average, and revenue broken down by product category and by region, plus how the category mix shifts month to month.

**Time patterns**: Busiest days and hours of the week, showing when to staff up and how weekday rushes at urban stores differ from weekend traffic at suburban ones.

**Products**: Revenue and a scorecard for every item on the menu, and weekly sales of seasonal items like the Pumpkin Spice Latte and Peppermint Mocha across their run.

**Stores**: Revenue and a scorecard for each location, and monthly revenue by store, including how a newly opened location ramps up.

**Customers & payments**: Revenue and average ticket by customer type (new, returning, and rewards member), and how each group pays (card, mobile app, mobile wallet, cash, or gift card).

**Raw data**: The underlying transactions for the current filters, available to download as a CSV.

## The Results

This dashboard gives owners and store managers a single place to see how the business is doing, without waiting on someone to build a report or needing to pull data together from different systems for different stores. It makes it easy to spot a location that's falling behind, see whether a seasonal item is worth bringing back next year, schedule staff around the busiest hours, and judge whether the rewards program is bringing in customers who spend more per visit.

In an actual client use case, this dashboard could be connected directly to a business's point-of-sale system so it refreshes automatically, and its charts and filters would be tailored to the questions that matter most to that business.

This dashboard turns thousands of individual transactions into answers a business owner can act on, putting the health of every location, product, and customer group in one view.
