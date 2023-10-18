import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();
const {
  STORE_FRONT_API,
  CORS_ORIGIN,
  SEAL_APP_TOKEN,
  PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
} = process.env;
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
const freeShippingGiftId = "47056807231771";
const secretGiftId = "47056804577563";
const antiInflamatoryGiftId = "47056802873627";
const eBookGiftId = "47056796746011";

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
                lineItems: [
                  {
                    variantId: "gid://shopify/ProductVariant/${variantId}",
                    quantity: ${quantity}
                  },
                  {
                    variantId: "gid://shopify/ProductVariant/${freeShippingGiftId}",
                    quantity: 1
                  },
                  {
                    variantId: "gid://shopify/ProductVariant/${secretGiftId}",
                    quantity: 1
                  },
                  {
                    variantId: "gid://shopify/ProductVariant/${antiInflamatoryGiftId}",
                    quantity: 1
                  },
                  {
                    variantId: "gid://shopify/ProductVariant/${eBookGiftId}",
                    quantity: 1
                  }
                ]
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

app.get("/api/send-email", async (req, res) => {
  const { email } = req.query;
  const validateEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
    email
  );

  if (validateEmail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // ssl - port 465 || tls - port 587
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    try {
      await transporter
        .sendMail({
          from: '"Bala Nutrition" <info@balaxk.com>',
          to: email,
          subject: "Test Email",
          text: "Hello world?",
          html: "<b>Hello world?</b>",
        })
        .then(res.sendStatus(200));
    } catch (error) {
      console.error(error);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
