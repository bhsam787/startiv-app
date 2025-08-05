# Shopify Embedded App – Product Status Toggle

## 📌 Shopify Embedded App Task

**Goal**: Build a minimal app that performs a product update.

**Requirements**:
- Authenticate with the Shopify store properly (embedded app structure).
- List the latest 10 products (title, price, published date).
- Add a Toggle Button next to each product:
  - When clicked, the product’s status should be switched between Active and Draft.
- Use the GraphQL Admin API mutation (`productUpdate`) to perform this action.
- Implement simple error handling (toast message or alert if API call fails).

---

I completed the entire task by reading documentation and revisiting some React fundamentals through tutorials by Jonas Schmedtmann. His videos helped me refresh my understanding of core React concepts, and I supplemented that by exploring various online resources and official documentation.

Although I’m more familiar with Laravel for developing Shopify apps, I chose to build this project using Remix and React as a personal challenge. This approach allowed me to deepen my knowledge of Shopify's modern app stack, even though it slowed me down a bit due to the learning curve.

For the UI, I relied on the Shopify Polaris documentation to guide the design and component usage. I also used ChatGPT for learning and clarification while working with React.  
For GraphQL operations, I closely followed the Shopify GraphQL Admin API documentation to understand how to fetch and update product data correctly.

---

## 🧪 How to Test the App

Navigate to the **App Dashboard** inside your Shopify store.

From there, go to the **Products** section to see the functionality in action.

---

## ⚙️ How to Run the Project Locally

1. Clone the repository.

2. Install dependencies:
   ```bash
   npm install
3. ```bash
    npm run dev
