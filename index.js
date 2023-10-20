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
          {
            variant_id: freeShippingGiftId,
            quantity: 1,
          },
          {
            variant_id: secretGiftId,
            quantity: 1,
          },
          {
            variant_id: antiInflamatoryGiftId,
            quantity: 1,
          },
          {
            variant_id: eBookGiftId,
            quantity: 1,
          },
        ],
      }),
    })
      .then((response) => response.json())
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
          subject: "Thank you for filling the quiz:",
          // text: "Hello world?",
          html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Document</title>
            </head>
            <body>
              <div>
                <div style="word-spacing: normal; background-color: #d2e9e6">
                  <div
                    style="
                      display: none;
                      font-size: 1px;
                      color: #ffffff;
                      line-height: 1px;
                      max-height: 0px;
                      max-width: 0px;
                      opacity: 0;
                      overflow: hidden;
                    "
                  >
                    35% OFF Your Kit + Free Shipping
                  </div>
                  <div
                    id="m_4300470240467077608m_-1938300442615346142bodyTable"
                    style="background-color: #d2e9e6"
                  >
                    <div>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="width: 100%"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <div style="margin: 0px auto; max-width: 600px">
                                <table
                                  align="center"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          direction: ltr;
                                          font-size: 0px;
                                          padding: 0px;
                                          text-align: center;
                                        "
                                      >
                                        <div
                                          style="
                                            background: #f8f1eb;
                                            background-color: #f8f1eb;
                                            margin: 0px auto;
                                            border-radius: 10px 10px 0px 0px;
                                            max-width: 600px;
                                          "
                                        >
                                          <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              background: #f8f1eb;
                                              background-color: #f8f1eb;
                                              width: 100%;
                                              border-radius: 10px 10px 0px 0px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    direction: ltr;
                                                    font-size: 0px;
                                                    padding: 20px 0;
                                                    padding-bottom: 9px;
                                                    padding-left: 18px;
                                                    padding-right: 18px;
                                                    padding-top: 9px;
                                                    text-align: center;
                                                  "
                                                >
                                                  <div>
                                                    <div
                                                      style="
                                                        display: table;
                                                        table-layout: fixed;
                                                        width: 100%;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          display: table-cell;
                                                          vertical-align: top;
                                                          width: 100%;
                                                        "
                                                      >
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                              border-collapse: collapse;
                                                                              border-spacing: 0px;
                                                                            "
                                                                          >
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  style="
                                                                                    border: 0;
                                                                                    padding: 0px
                                                                                      0px
                                                                                      0px
                                                                                      0px;
                                                                                    width: 140px;
                                                                                  "
                                                                                  valign="top"
                                                                                >
                                                                                  <a
                                                                                    style="
                                                                                      color: #15c;
                                                                                      font-style: normal;
                                                                                      font-weight: normal;
                                                                                      text-decoration: none;
                                                                                    "
                                                                                    href="https://balanutritions.com/#quiz-jyHAkz"
                                                                                  >
                                                                                    <img
                                                                                      alt="Bala"
                                                                                      src="https://i.imgur.com/QyeUMCo.png"
                                                                                      style="
                                                                                        display: block;
                                                                                        outline: none;
                                                                                        text-decoration: none;
                                                                                        height: auto;
                                                                                        font-size: 13px;
                                                                                        width: 100%;
                                                                                      "
                                                                                      title="Bala"
                                                                                      width="140"
                                                                                      class="CToWUd"
                                                                                      data-bit="iit"
                                                                                    />
                                                                                  </a>
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="width: 100%"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <div style="margin: 0px auto; max-width: 600px">
                                <table
                                  align="center"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="width: 100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          direction: ltr;
                                          font-size: 0px;
                                          padding: 0px;
                                          text-align: center;
                                        "
                                      >
                                        <div
                                          style="
                                            background: #ffffff;
                                            background-color: #ffffff;
                                            margin: 0px auto;
                                            border-radius: 0px 0px 10px 10px;
                                            max-width: 600px;
                                          "
                                        >
                                          <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              background: #ffffff;
                                              background-color: #ffffff;
                                              width: 100%;
                                              border-radius: 0px 0px 10px 10px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    direction: ltr;
                                                    font-size: 0px;
                                                    padding: 20px 0;
                                                    padding-bottom: 0px;
                                                    padding-left: 0px;
                                                    padding-right: 0px;
                                                    padding-top: 0px;
                                                    text-align: center;
                                                  "
                                                >
                                                  <div>
                                                    <div
                                                      style="
                                                        display: table;
                                                        table-layout: fixed;
                                                        width: 100%;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          display: table-cell;
                                                          vertical-align: top;
                                                          width: 100%;
                                                        "
                                                      >
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 0px;
                                                                            padding-right: 0px;
                                                                            padding-bottom: 0px;
                                                                            padding-left: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <div
                                                                              style="
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  font-weight: 600;
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-size: 26px;
                                                                                "
                                                                                >Your
                                                                                Discount
                                                                                Will
                                                                                Expire
                                                                                Soon! but
                                                                                You Can
                                                                                Still
                                                                                Secure the
                                                                                35%
                                                                                Discount!</span
                                                                              >
                                                                            </div>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                              border-collapse: separate;
                                                                              line-height: 100%;
                                                                            "
                                                                          >
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  align="center"
                                                                                  bgcolor="#2F5854"
                                                                                  role="presentation"
                                                                                  style="
                                                                                    border: none;
                                                                                    border-radius: 50px;
                                                                                    background: #2f5854;
                                                                                  "
                                                                                  valign="middle"
                                                                                >
                                                                                  <a
                                                                                    style="
                                                                                      color: #fff;
                                                                                      font-weight: 500;
                                                                                      text-decoration: none;
                                                                                      display: inline-block;
                                                                                      background: #2f5854;
                                                                                      font-family: 'Lexend',
                                                                                        Arial,
                                                                                        'Helvetica Neue',
                                                                                        Helvetica,
                                                                                        sans-serif;
                                                                                      font-size: 16px;
                                                                                      line-height: 1.3;
                                                                                      letter-spacing: 0;
                                                                                      margin: 0;
                                                                                      text-transform: none;
                                                                                      padding: 15px
                                                                                        100px
                                                                                        15px
                                                                                        100px;
                                                                                      border-radius: 50px;
                                                                                    "
                                                                                    href="https://balanutritions.com/#quiz-jyHAkz"
                                                                                  >
                                                                                    Complete
                                                                                    Order
                                                                                    35%
                                                                                    OFF
                                                                                  </a>
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <p
                                                                            style="
                                                                              padding-bottom: 0;
                                                                              border-top: solid
                                                                                10px
                                                                                #d2e9e6;
                                                                              font-size: 1px;
                                                                              margin: 0
                                                                                auto;
                                                                              width: 100%;
                                                                            "
                                                                          ></p>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 0px;
                                                                            padding-right: 0px;
                                                                            padding-bottom: 0px;
                                                                            padding-left: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <p
                                                                              style="
                                                                                padding-bottom: 0;
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  font-weight: 600;
                                                                                  font-size: 26px;
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                "
                                                                                >One Gut
                                                                                Health
                                                                                Supp to
                                                                                Rule Them
                                                                                All<br
                                                                              /></span>
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 15px;
                                                                            padding-right: 25px;
                                                                            padding-bottom: 9px;
                                                                            padding-left: 25px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <p>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >We don’t
                                                                                believe in
                                                                                half-measures.
                                                                                Get the
                                                                                complete
                                                                                Bala
                                                                                Nutrition
                                                                                Probiotic
                                                                                Gummies
                                                                                package
                                                                                for
                                                                                exceptional
                                                                                gut health
                                                                                and
                                                                                witness
                                                                                the
                                                                                transformation:<br
                                                                              /></span>
                                                                            </p>
                                                                            <p>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                ><strong
                                                                                  >Probiotic
                                                                                  Gummies: </strong
                                                                                >Elevate
                                                                                your gut
                                                                                health
                                                                                with the
                                                                                delicious
                                                                                and
                                                                                effective
                                                                                Bala
                                                                                Nutrition
                                                                                Probiotic
                                                                                Gummies.
                                                                                Say
                                                                                goodbye to
                                                                                digestive
                                                                                discomfort,
                                                                                bloating,
                                                                                and
                                                                                irregular
                                                                                bowel
                                                                                movements.
                                                                                These
                                                                                gummies
                                                                                not only
                                                                                provide
                                                                                your gut
                                                                                with the
                                                                                friendly
                                                                                probiotic
                                                                                bacteria
                                                                                it needs
                                                                                but also
                                                                                taste
                                                                                fantastic.</span
                                                                              >
                                                                            </p>
                                                                            <p>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                ><strong
                                                                                  >Prebiotic
                                                                                  Support: </strong
                                                                                >Nourish
                                                                                your gut
                                                                                microbiome
                                                                                with the
                                                                                prebiotic
                                                                                goodness
                                                                                in every
                                                                                gummy.
                                                                                Prebiotics
                                                                                are like a
                                                                                welcome
                                                                                mat for
                                                                                probiotics,
                                                                                ensuring
                                                                                they
                                                                                thrive in
                                                                                your gut
                                                                                and
                                                                                promote
                                                                                better
                                                                                digestion.</span
                                                                              >
                                                                            </p>
                                                                            <p
                                                                              style="
                                                                                padding-bottom: 0;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                ><strong
                                                                                  >Postbiotic
                                                                                  Benefits: </strong
                                                                                >Experience
                                                                                the unique
                                                                                benefits
                                                                                of a
                                                                                balanced
                                                                                gut
                                                                                microbiome.
                                                                                Bala
                                                                                Nutrition
                                                                                Probiotic
                                                                                Gummies
                                                                                help
                                                                                reduce
                                                                                inflammation,
                                                                                enhance
                                                                                nutrient
                                                                                absorption,
                                                                                and
                                                                                fortify
                                                                                your gut
                                                                                wall for
                                                                                improved
                                                                                overall
                                                                                well-being.</span
                                                                              >
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                              border-collapse: separate;
                                                                              line-height: 100%;
                                                                            "
                                                                          >
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  align="center"
                                                                                  bgcolor="#2F5854"
                                                                                  role="presentation"
                                                                                  style="
                                                                                    border: none;
                                                                                    border-radius: 50px;
                                                                                    background: #2f5854;
                                                                                  "
                                                                                  valign="middle"
                                                                                >
                                                                                  <a
                                                                                    style="
                                                                                      color: #fff;
                                                                                      font-weight: 500;
                                                                                      text-decoration: none;
                                                                                      display: inline-block;
                                                                                      background: #2f5854;
                                                                                      font-family: 'Lexend',
                                                                                        Arial,
                                                                                        'Helvetica Neue',
                                                                                        Helvetica,
                                                                                        sans-serif;
                                                                                      font-size: 15px;
                                                                                      line-height: 1.3;
                                                                                      letter-spacing: 0;
                                                                                      margin: 0;
                                                                                      text-transform: none;
                                                                                      padding: 15px
                                                                                        85px
                                                                                        15px
                                                                                        85px;
                                                                                      border-radius: 50px;
                                                                                    "
                                                                                    href="https://balanutritions.com/#quiz-jyHAkz"
                                                                                  >
                                                                                    Claim
                                                                                    My 35%
                                                                                    Discount
                                                                                    + Free
                                                                                    Shipping
                                                                                  </a>
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          style="
                                                                            font-size: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              height: 20px;
                                                                              line-height: 20px;
                                                                            "
                                                                          >
                                                                             
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <p
                                                                            style="
                                                                              padding-bottom: 0;
                                                                              border-top: solid
                                                                                10px
                                                                                #d2e9e6;
                                                                              font-size: 1px;
                                                                              margin: 0
                                                                                auto;
                                                                              width: 100%;
                                                                            "
                                                                          ></p>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 0px;
                                                                            padding-right: 0px;
                                                                            padding-bottom: 0px;
                                                                            padding-left: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <p
                                                                              style="
                                                                                padding-bottom: 0;
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  font-weight: 600;
                                                                                  font-size: 26px;
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                "
                                                                                >90% of
                                                                                Americans
                                                                                Have
                                                                                Something
                                                                                in Common,
                                                                                Which
                                                                                Is…<br
                                                                              /></span>
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
          
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 9px;
                                                                            padding-right: 25px;
                                                                            padding-bottom: 9px;
                                                                            padding-left: 25px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                  font-size: 16px;
                                                                                "
                                                                                >...lacking
                                                                                the
                                                                                essential
                                                                                support
                                                                                for their
                                                                                gut
                                                                                health.
                                                                                Are you
                                                                                one of
                                                                                them?</span
                                                                              >
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >&nbsp;</span
                                                                              >
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >Have you
                                                                                ever
                                                                                struggled
                                                                                with
                                                                                digestive
                                                                                issues,
                                                                                such as
                                                                                gas,
                                                                                bloating,
                                                                                or
                                                                                discomfort,
                                                                                despite
                                                                                trying
                                                                                various
                                                                                remedies?&nbsp;<br
                                                                              /></span>
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >&nbsp;</span
                                                                              >
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >Chances
                                                                                are, your
                                                                                gut health
                                                                                needs
                                                                                attention.&nbsp;</span
                                                                              >
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >&nbsp;</span
                                                                              >
                                                                            </div>
                                                                            <div>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >Ditch the
                                                                                uncertainty
                                                                                of
                                                                                ordinary
                                                                                probiotic
                                                                                supplements
                                                                                – choose
                                                                                the
                                                                                complete
                                                                                solution
                                                                                that's
                                                                                both
                                                                                convenient
                                                                                and
                                                                                delivers
                                                                                quick
                                                                                results.
                                                                                You
                                                                                deserve
                                                                                it. The
                                                                                longer you
                                                                                stay
                                                                                committed,
                                                                                the
                                                                                greater
                                                                                the
                                                                                rewards.&nbsp;</span
                                                                              ><span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >&nbsp;</span
                                                                              >
                                                                            </div>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
          
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Ubuntu,
                                                                                Helvetica,
                                                                                Arial,
                                                                                sans-serif;
                                                                              font-size: 13px;
                                                                              line-height: 1;
                                                                              text-align: left;
                                                                              color: #000000;
                                                                            "
                                                                          >
                                                                            <div
                                                                              style="
                                                                                display: table;
                                                                                width: 100%;
                                                                              "
                                                                            >
                                                                              <div
                                                                                style="
                                                                                  display: table-cell;
                                                                                  vertical-align: top;
                                                                                  width: 50%;
                                                                                "
                                                                              >
                                                                                <table
                                                                                  border="0"
                                                                                  cellpadding="0"
                                                                                  cellspacing="0"
                                                                                  role="presentation"
                                                                                  width="100%"
                                                                                >
                                                                                  <tbody>
                                                                                    <tr>
                                                                                      <td
                                                                                        style="
                                                                                          padding-left: 0px;
                                                                                          padding-right: 18px;
                                                                                        "
                                                                                      >
                                                                                        <table
                                                                                          border="0"
                                                                                          cellpadding="0"
                                                                                          cellspacing="0"
                                                                                          role="presentation"
                                                                                          width="100%"
                                                                                        >
                                                                                          <tbody>
                                                                                            <tr>
                                                                                              <td>
                                                                                                <div
                                                                                                  style="
                                                                                                    font-family: Arial;
                                                                                                    font-size: 16px;
                                                                                                    font-style: normal;
                                                                                                    font-weight: 400;
                                                                                                    letter-spacing: 0px;
                                                                                                    line-height: 1.5;
                                                                                                    text-align: left;
                                                                                                    color: #222222;
                                                                                                  "
                                                                                                >
                                                                                                  <div>
                                                                                                    <span
                                                                                                      style="
                                                                                                        font-family: Lexend,
                                                                                                          Arial,
                                                                                                          'Helvetica Neue',
                                                                                                          Helvetica,
                                                                                                          sans-serif;
                                                                                                        font-weight: 300;
                                                                                                      "
                                                                                                      >Boosting
                                                                                                      your
                                                                                                      gut
                                                                                                      health
                                                                                                      is
                                                                                                      a
                                                                                                      journey,
                                                                                                      and
                                                                                                      Bala
                                                                                                      Nutrition
                                                                                                      Probiotic
                                                                                                      Gummies
                                                                                                      make
                                                                                                      it
                                                                                                      feel
                                                                                                      like
                                                                                                      a
                                                                                                      breeze.&nbsp;</span
                                                                                                    >
                                                                                                  </div>
                                                                                                  <div>
                                                                                                    <span
                                                                                                      style="
                                                                                                        font-family: Lexend,
                                                                                                          Arial,
                                                                                                          'Helvetica Neue',
                                                                                                          Helvetica,
                                                                                                          sans-serif;
                                                                                                        font-weight: 300;
                                                                                                      "
                                                                                                      >&nbsp;</span
                                                                                                    >
                                                                                                  </div>
                                                                                                  <div>
                                                                                                    <span
                                                                                                      style="
                                                                                                        font-family: Lexend,
                                                                                                          Arial,
                                                                                                          'Helvetica Neue',
                                                                                                          Helvetica,
                                                                                                          sans-serif;
                                                                                                        font-weight: 300;
                                                                                                      "
                                                                                                      ><span
                                                                                                        style="
                                                                                                          font-weight: bold;
                                                                                                        "
                                                                                                        >Try
                                                                                                        them
                                                                                                        for
                                                                                                        14
                                                                                                        days
                                                                                                        and
                                                                                                        experience
                                                                                                        the
                                                                                                        remarkable
                                                                                                        difference
                                                                                                        yourself. </span
                                                                                                      >Continue
                                                                                                      for
                                                                                                      a
                                                                                                      month,
                                                                                                      and
                                                                                                      others
                                                                                                      will
                                                                                                      notice
                                                                                                      the
                                                                                                      change
                                                                                                      too.
                                                                                                      Embrace
                                                                                                      them
                                                                                                      for
                                                                                                      3
                                                                                                      months,
                                                                                                      and
                                                                                                      you'll
                                                                                                      feel
                                                                                                      like
                                                                                                      a
                                                                                                      rejuvenated
                                                                                                      version
                                                                                                      of
                                                                                                      yourself.</span
                                                                                                    >
                                                                                                  </div>
                                                                                                </div>
                                                                                              </td>
                                                                                            </tr>
                                                                                          </tbody>
                                                                                        </table>
                                                                                      </td>
                                                                                    </tr>
                                                                                  </tbody>
                                                                                </table>
                                                                              </div>
          
                                                                              <div
                                                                                style="
                                                                                  display: table-cell;
                                                                                  vertical-align: top;
                                                                                  width: 50%;
                                                                                "
                                                                              >
                                                                                <table
                                                                                  border="0"
                                                                                  cellpadding="0"
                                                                                  cellspacing="0"
                                                                                  role="presentation"
                                                                                  width="100%"
                                                                                >
                                                                                  <tbody>
                                                                                    <tr>
                                                                                      <td
                                                                                        style="
                                                                                          padding-left: 18px;
                                                                                          padding-right: 0px;
                                                                                        "
                                                                                      >
                                                                                        <table
                                                                                          border="0"
                                                                                          cellpadding="0"
                                                                                          cellspacing="0"
                                                                                          role="presentation"
                                                                                          width="100%"
                                                                                        >
                                                                                          <tbody>
                                                                                            <tr>
                                                                                              <td>
                                                                                                <table
                                                                                                  border="0"
                                                                                                  cellpadding="0"
                                                                                                  cellspacing="0"
                                                                                                  width="100%"
                                                                                                >
                                                                                                  <tbody>
                                                                                                    <tr>
                                                                                                      <td
                                                                                                        align="left"
                                                                                                        style="
                                                                                                          font-size: 0px;
                                                                                                          word-break: break-word;
                                                                                                        "
                                                                                                      >
                                                                                                        <table
                                                                                                          border="0"
                                                                                                          cellpadding="0"
                                                                                                          cellspacing="0"
                                                                                                          style="
                                                                                                            border-collapse: collapse;
                                                                                                            border-spacing: 0px;
                                                                                                          "
                                                                                                        >
                                                                                                          <tbody>
                                                                                                            <tr>
                                                                                                              <td
                                                                                                                style="
                                                                                                                  border: 0;
                                                                                                                  padding: 0;
                                                                                                                  width: 300px;
                                                                                                                "
                                                                                                                valign="top"
                                                                                                              >
                                                                                                                <a
                                                                                                                  style="
                                                                                                                    color: #15c;
                                                                                                                    font-style: normal;
                                                                                                                    font-weight: normal;
                                                                                                                    text-decoration: none;
                                                                                                                  "
                                                                                                                  href="https://balanutritions.com/#quiz-jyHAkz"
                                                                                                                >
                                                                                                                  <img
                                                                                                                    alt="Bala Probiotics"
                                                                                                                    src="https://i.imgur.com/5u4sZB3.png"
                                                                                                                    style="
                                                                                                                      display: block;
                                                                                                                      outline: none;
                                                                                                                      text-decoration: none;
                                                                                                                      height: auto;
                                                                                                                      font-size: 13px;
                                                                                                                      margin-top: 80px;
                                                                                                                      width: 100%;
                                                                                                                    "
                                                                                                                    title="Bala Probiotics"
                                                                                                                    width="300"
                                                                                                                    class="CToWUd"
                                                                                                                    data-bit="iit"
                                                                                                                  />
                                                                                                                </a>
                                                                                                              </td>
                                                                                                            </tr>
                                                                                                          </tbody>
                                                                                                        </table>
                                                                                                      </td>
                                                                                                    </tr>
                                                                                                  </tbody>
                                                                                                </table>
                                                                                              </td>
                                                                                            </tr>
                                                                                          </tbody>
                                                                                        </table>
                                                                                      </td>
                                                                                    </tr>
                                                                                  </tbody>
                                                                                </table>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 9px;
                                                                    padding-right: 18px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 18px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                              border-collapse: separate;
                                                                              line-height: 100%;
                                                                            "
                                                                          >
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  align="center"
                                                                                  bgcolor="#2F5854"
                                                                                  role="presentation"
                                                                                  style="
                                                                                    border: none;
                                                                                    border-radius: 50px;
                                                                                    background: #2f5854;
                                                                                  "
                                                                                  valign="middle"
                                                                                >
                                                                                  <a
                                                                                    style="
                                                                                      color: #fff;
                                                                                      font-weight: 500;
                                                                                      text-decoration: none;
                                                                                      display: inline-block;
                                                                                      background: #2f5854;
                                                                                      font-family: 'Lexend',
                                                                                        Arial,
                                                                                        'Helvetica Neue',
                                                                                        Helvetica,
                                                                                        sans-serif;
                                                                                      font-size: 15px;
                                                                                      line-height: 1.3;
                                                                                      letter-spacing: 0;
                                                                                      margin: 0;
                                                                                      text-transform: none;
                                                                                      padding: 15px
                                                                                        85px
                                                                                        15px
                                                                                        85px;
                                                                                      border-radius: 50px;
                                                                                    "
                                                                                    href="https://balanutritions.com/#quiz-jyHAkz"
                                                                                  >
                                                                                    Claim
                                                                                    My 35%
                                                                                    Discount
                                                                                    + Free
                                                                                    Shipping
                                                                                  </a>
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          style="
                                                                            font-size: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              height: 20px;
                                                                              line-height: 20px;
                                                                            "
                                                                          >
                                                                             
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </div>
                                                    </div>
          
                                                    <div
                                                      style="
                                                        display: table;
                                                        table-layout: fixed;
                                                        width: 100%;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          display: table-cell;
                                                          vertical-align: top;
                                                          width: 100%;
                                                        "
                                                      >
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          style="
                                                                            background: #d2e9e6;
                                                                            font-size: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              height: 10px;
                                                                              line-height: 10px;
                                                                            "
                                                                          >
                                                                             
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 15px;
                                                                            padding-right: 25px;
                                                                            padding-bottom: 9px;
                                                                            padding-left: 25px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <p>
                                                                              <span
                                                                                style="
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                  font-weight: 300;
                                                                                "
                                                                                >P.S. Act
                                                                                fast! This
                                                                                is a
                                                                                limited-time
                                                                                offer.
                                                                                Once it
                                                                                expires,
                                                                                you will
                                                                                lose the
                                                                                35%
                                                                                discount
                                                                                and free
                                                                                shipping,
                                                                                so don't
                                                                                miss
                                                                                out!</span
                                                                              >
                                                                            </p>
                                                                            <p
                                                                              style="
                                                                                padding-bottom: 0;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  font-weight: 300;
                                                                                  font-family: Lexend,
                                                                                    Arial,
                                                                                    'Helvetica Neue',
                                                                                    Helvetica,
                                                                                    sans-serif;
                                                                                "
                                                                                >Bala
                                                                                Nutrition</span
                                                                              >
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </div>
                                                    </div>
          
                                                    <div
                                                      style="
                                                        display: table;
                                                        table-layout: fixed;
                                                        width: 100%;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          display: table-cell;
                                                          vertical-align: top;
                                                          width: 100%;
                                                        "
                                                      >
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 30px;
                                                                    padding-right: 9px;
                                                                    padding-bottom: 9px;
                                                                    padding-left: 9px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          style="
                                                                            font-size: 0px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                              border-collapse: collapse;
                                                                              border-spacing: 0px;
                                                                            "
                                                                          >
                                                                            <tbody>
                                                                              <tr>
                                                                                <td
                                                                                  style="
                                                                                    border: 0;
                                                                                    padding: 0px
                                                                                      9px
                                                                                      0px
                                                                                      9px;
                                                                                    width: 30px;
                                                                                  "
                                                                                  valign="top"
                                                                                >
                                                                                  <table
                                                                                    border="0"
                                                                                    cellpadding="0"
                                                                                    cellspacing="0"
                                                                                    style="
                                                                                      border-collapse: collapse;
                                                                                      border-spacing: 0px;
                                                                                    "
                                                                                  >
                                                                                    <tbody>
                                                                                      <tr>
                                                                                        <td
                                                                                          valign="top"
                                                                                        >
                                                                                          <a
                                                                                            style="
                                                                                              color: #15c;
                                                                                              font-style: normal;
                                                                                              font-weight: normal;
                                                                                              text-decoration: none;
                                                                                            "
                                                                                            href="https://balanutritions.com"
                                                                                          >
                                                                                            <img
                                                                                              src="https://i.imgur.com/QyeUMCo.png"
                                                                                              style="
                                                                                                display: block;
                                                                                                outline: none;
                                                                                                text-decoration: none;
                                                                                                height: auto;
                                                                                                font-size: 13px;
                                                                                                width: 100%;
                                                                                              "
                                                                                              width="30"
                                                                                              class="CToWUd"
                                                                                              data-bit="iit"
                                                                                            />
                                                                                          </a>
                                                                                        </td>
                                                                                      </tr>
                                                                                    </tbody>
                                                                                  </table>
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div
                                                          style="
                                                            font-size: 0px;
                                                            text-align: left;
                                                            direction: ltr;
                                                            vertical-align: top;
                                                            width: 100%;
                                                          "
                                                        >
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            style="width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    vertical-align: top;
                                                                    padding-top: 0px;
                                                                    padding-right: 0px;
                                                                    padding-bottom: 0px;
                                                                    padding-left: 0px;
                                                                  "
                                                                >
                                                                  <table
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                    width="100%"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          align="left"
                                                                          style="
                                                                            font-size: 0px;
                                                                            padding: 0px;
                                                                            padding-top: 15px;
                                                                            padding-right: 50px;
                                                                            padding-bottom: 30px;
                                                                            padding-left: 50px;
                                                                            word-break: break-word;
                                                                          "
                                                                        >
                                                                          <div
                                                                            style="
                                                                              font-family: Arial;
                                                                              font-size: 16px;
                                                                              font-style: normal;
                                                                              font-weight: 400;
                                                                              letter-spacing: 0px;
                                                                              line-height: 1.5;
                                                                              text-align: left;
                                                                              color: #222222;
                                                                            "
                                                                          >
                                                                            <p
                                                                              style="
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <strong
                                                                                >Bala
                                                                                Nutritions</strong
                                                                              >
                                                                            </p>
                                                                            <p
                                                                              style="
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  color: #a9a9a9;
                                                                                "
                                                                                ><span
                                                                                  style="
                                                                                    font-size: 11px;
                                                                                  "
                                                                                ></span
                                                                              ></span>
                                                                            </p>
                                                                            <p
                                                                              style="
                                                                                text-align: center;
                                                                              "
                                                                            >
                                                                              <span
                                                                                style="
                                                                                  color: #a9a9a9;
                                                                                "
                                                                                ><span
                                                                                  style="
                                                                                    font-size: 11px;
                                                                                  "
                                                                                  >You
                                                                                  have
                                                                                  received
                                                                                  this
                                                                                  email
                                                                                  because
                                                                                  you have
                                                                                  shown
                                                                                  interest
                                                                                  in Bala.
                                                                                  This
                                                                                  email
                                                                                  and
                                                                                  offer is
                                                                                  only
                                                                                  valid
                                                                                  for the
                                                                                  receiver
                                                                                </span></span
                                                                              >
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
          
                  <img
                    src="https://i.imgur.com/QyeUMCo.png"
                    alt=""
                    width="1"
                    height="1"
                    border="0"
                    style="
                      height: 1px !important;
                      width: 1px !important;
                      border-width: 0 !important;
                      margin-top: 0 !important;
                      margin-bottom: 0 !important;
                      margin-right: 0 !important;
                      margin-left: 0 !important;
                      padding-top: 0 !important;
                      padding-bottom: 0 !important;
                      padding-right: 0 !important;
                      padding-left: 0 !important;
                    "
                    class="CToWUd"
                    data-bit="iit"
                  />
                </div>
              </div>
            </body>
          </html>
          `,
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
