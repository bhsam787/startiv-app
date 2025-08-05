# Shopify Embedded App – Product Status Toggle

## 🧩 Overview

This is a minimal Shopify embedded app built to demonstrate how to update product status using the Shopify Admin GraphQL API. The app connects to a store, lists the 10 most recent products, and allows the merchant to toggle their status between `ACTIVE` and `DRAFT` using a simple UI and GraphQL mutation.

---

## 🎯 Goal

Build a lightweight Shopify embedded app that:

- Authenticates with the store (using Shopify’s Embedded App SDK).
- Lists the latest 10 products (showing title, price, and published date).
- Adds a toggle switch next to each product to change its status between `ACTIVE` and `DRAFT`.
- Uses the `productUpdate` GraphQL mutation to perform the update.
- Handles errors gracefully with toasts or alert messages.

---

## ⚙️ Setup & Installation

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/shopify-product-toggle-app.git
cd shopify-product-toggle-app
