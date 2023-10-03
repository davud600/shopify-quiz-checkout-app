import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const { STORE_FRONT_API, CORS_ORIGIN, SEAL_APP_TOKEN, PORT } = process.env;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

const shopifyApiUrl = "https://balanutritions.com/api/2023-01/graphql.json";
const sealApiUrl =
  "https://app.sealsubscriptions.com/shopify/merchant/api/quick-checkout-url";

app.get("/api/create-checkout", async (req, res) => {
  const { quantity, variantId, sellingPlanId } = req.query;

  if (!!sellingPlanId) {
    fetch(sealApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Seal-Token": `${SEAL_APP_TOKEN}`,
      },
      body: JSON.stringify({
        action: "create",
        items: [
          {
            variant_id: variantId,
            quantity: quantity,
            selling_plan: sellingPlanId,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        res.send({ data: data.payload.quick_checkout_url });
        return;
      })
      .catch((error) => {
        console.error("Error:", error);
        return;
      });
  }

  fetch(shopifyApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": `${STORE_FRONT_API}`,
    },
    body: JSON.stringify({
      query: `
            mutation {
              checkoutCreate(input: {
                lineItems: [{
                  variantId: "gid://shopify/ProductVariant/${variantId}",
                  quantity: ${quantity}
                }]
              }) {
                checkout {
                  webUrl
                }
              }
            }
          `,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.send({ data: data.data.checkoutCreate.checkout.webUrl });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
