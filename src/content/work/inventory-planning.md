---
title: Inventory Planning & Demand Forecasting
url: inventory-planning-demand-forecasting
description: An inventory planning app that forecasts demand from sales history and turns it into reorder points, so owners know what to order and when.
kind: Live demo
order: 2
featured: true
draft: false
relatedServices:
    - data-science
    - data-analytics
stack:
    - Python
    - FastAPI
    - SQL
    - scikit-learn
    - React
    - TypeScript
image: /assets/images/work/inventory-planning-app.jpg
imageAlt: The inventory app's Forecasting page, showing a weekly demand forecast with its likely range and what to order
demoUrl: /assets/demos/inventory-demo.html # static export from the inventory-management-demo repo (demo/inventory-demo.html)
demoEmbed: true
demoAutoload: true # show the app as soon as the page loads, instead of a "Launch live demo" button
repoUrl: ""
---

<!-- TODO: replace the placeholder text below with your write-up. -->

## The Problem

This fictional outdoor clothing/equipment retailer Cedar & Summit Outfitters struggles with maintaining up-to-date inventory manifests for its two points of sale (their Downtown store and orders through their website) and deals with frequent stock-outs and over-orders as a result.  As the weather changes throughout the year, some items sell depending on the season, so ramping their inventory up or down depending on demand for specific items can be a challenge.  Ultimately, this retailer needs quick answers to the following questions:

- What is our current stock at both of our locations?
- What quantity of each item is needed in stock to adequately serve our customers?
- When should I place another order for a specific item, and for how much?

## The Approach

The demo above is an application that acts as a single source of truth for inventory management for Cedar & Summit.  This application monitors and stores sale order data, purchase order data, and current inventory, forecasts future sales based on previous sales figures and seasonal trends, and estimates a date and quantity for a reorder for each item.

Each tab of the application displays the following:

**Dashboard**:  A general overview of inventory, items on order, recent revenue, and low-stock items needing your attention.

**Inventory**:  An itemized list of your stock, incoming/outgoing orders, time covered by current stock, reorder status, and overall retail value of your stock.

**Forecasting**:  The forecasted demand for each item, the calculation of the amount in stock that should trigger a reorder ("reorder point") based on the demand forecast and lead time for purchase orders.

**Purchasing**:  History and status of previous purchase orders to suppliers.

**Sales**:  History and status of previous sale orders to customers.

**Adjustments & Transfers**:  Manually recorded adjustments to stock numbers based on returns, damaged or lost goods, and corrections after inventory counts.


## The Results

In the end, this application would keep store managers ahead of inventory issues, prevent waste and over-ordering, and prepare for surges in demand, all without needing to manually count their inventory more frequently.

In an actual client use case, if applicable, this app could be connected to real point of sales and supplier platforms to place purchase orders directly or update data and forecasts automatically.  The application also leaves open the ability to provide adjustments for unrecorded inventory changes or add/discontinue specific items.

This application brings together disparate pieces of information from multiple sources into one location, giving a store owner/manager full control and knowledge of their business's inventory from one place.
