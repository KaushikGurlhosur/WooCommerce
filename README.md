# 🧠 WooCommerce Backend API (Node.js + Express + MongoDB)

This is the **backend** for the WooCommerce Product Segmentation and Ingestion System — built using **Node.js**, **Express**, and **MongoDB**.

It periodically ingests product data from the **WooCommerce REST API**, stores it in MongoDB, and provides endpoints to:
- Fetch paginated products.
- Dynamically evaluate product segments using rule-based queries.

---

## 🌐 Live API

**Deployed on Render:**  
🔗 https://woocommerce-eprk.onrender.com/api/products

**GitHub Repository:**  
🔗 [https://github.com/KaushikGurlhosur/WooCommerce](https://github.com/KaushikGurlhosur/WooCommerce)

---

## ⚙️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Security:** Helmet  
- **CORS:** Enabled for frontend access  
- **Scheduling:** Node-Cron (for periodic ingestion)  
- **Environment Management:** dotenv

---

## 🧩 Key Features

- ✅ **WooCommerce Product Ingestion:**  
  Fetches all products from WooCommerce REST API using basic auth and stores them in MongoDB.  
  Runs automatically **every 6 hours** via a cron job.

- ✅ **Pagination Support:**  
  `/api/products` returns paginated products with metadata like total count and current page.

- ✅ **Dynamic Segmentation Engine:**  
  Accepts human-readable rules (e.g. `price > 100`, `on_sale = true`)  
  → Converts them into MongoDB queries → Returns matched products.

- ✅ **Error Handling Middleware:**  
  Custom middlewares handle invalid routes and global errors cleanly.

- ✅ **CORS + Helmet:**  
  Secured setup allowing frontend communication from trusted origins.


---

## 🧪 API Endpoints

### **Product Routes**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/products` | Get all products (paginated) |
| `POST` | `/api/ingest` | Manually ingest products from WooCommerce API |

### **Segment Routes**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/segments/evaluate` | Evaluate rule-based product queries |

**Example request body:**
```json
{
  "rules": "price > 100\nstock_status = instock\non_sale = true"
}


🔧 Setup & Run Locally

1. Clone the repo:
      git clone https://github.com/KaushikGurlhosur/WooCommerce.git
      cd WooCommerce

2. Install dependencies:
      npm install

3. Create a .env file
      PORT=3001
      MONGODB_URI=<your-mongodb-uri>
      WOOCOMMERCE_BASE_URL=https://yourstore.com/wp-json/wc/v3
      WOOCOMMERCE_CONSUMER_KEY=<your-consumer-key>
      WOOCOMMERCE_CONSUMER_SECRET=<your-consumer-secret>

4. Start the Server:
      npm run dev



🕒 Cron Job

Runs every 6 hours to fetch the latest products from WooCommerce.

Uses the same logic as the /api/ingest route.

  
