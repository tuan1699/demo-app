// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
// @ts-ignore
import { Session } from "inspector";

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// GET ALL PAGE
app.get("/api/pages", async (_req, res) => {
  const id = _req.query.id;
  const published_status = _req.query.published_status;
  if (id) {
    let pagesData = await shopify.api.rest.Page.find({
      session: res.locals.shopify.session,
      // @ts-ignore
      id,
    });
    res.status(200).send(pagesData);
  } else {
    let pagesData = await shopify.api.rest.Page.all({
      session: res.locals.shopify.session,
      published_status: published_status,
    });
    res.status(200).send(pagesData);
  }
});

// CREATE PAGE
app.post("/api/pages", async (_req, res) => {
  const data = _req.body.page;
  const pagesData = new shopify.api.rest.Page({
    session: res.locals.shopify.session,
  });
  pagesData.title = data?.title;
  pagesData.body_html = data?.body_html || "";
  pagesData.published = data?.published;
  await pagesData.save({ update: true });
  res.status(200).send(pagesData);
});

// DELETE PAGE
app.delete("/api/pages", async (_req, res) => {
  // @ts-ignore
  const ids = _req.query.id?.split(","); // Split comma-separated IDs into an array
  const deletePromises = ids.map((id) =>
    shopify.api.rest.Page.delete({
      session: res.locals.shopify.session,
      id: id,
    })
  );
  const pagesData = await Promise.all(deletePromises);
  res.status(200).send(pagesData);
});

// UPDATE PAGE: HIDDEN PAGE
app.put("/api/pages", async (_req, res) => {
  // @ts-ignore
  const ids = _req.query.id?.split(",");
  const published = _req.body.published;
  const title = _req.body.title;
  const body_html = _req.body.body_html;

  if (title || body_html) {
    const page = new shopify.api.rest.Page({
      session: res.locals.shopify.session,
    });
    page.id = ids[0];
    page.title = title;
    page.published = published;
    page.body_html = body_html;
    await page.save({
      update: true,
    });
    res.status(200).send(page);
  } else if (ids) {
    const updatePageStatus = ids.map(async (id) => {
      const page = new shopify.api.rest.Page({
        session: res.locals.shopify.session,
      });
      page.id = id;
      page.published = published;
      await page.save({
        update: true,
      });
    });
    const pagesData = await Promise.all(updatePageStatus);
    res.status(200).send(pagesData);
  }
});

// app.put("/api/pages", async (_req, res) => {
//   const ids = _req.query.id.split(",");
//   const published_status = _req.body.page.published;
//   const title = _req.body.page.title;
//   const body_html = _req.body.page.body_html;

//   if (title) {
//     // update content of a page
//     const page = new shopify.api.rest.Page({
//       session: res.locals.shopify.session,
//     });
//     page.id = ids[0];
//     page.published = published_status;
//     page.title = title;
//     page.body_html = body_html;
//     await page.save({
//       update: true,
//     });
//     res.status(200).send(page);
//   } else {
//     // update status of a page or many pages
//     const updatePageStatus = ids.map(async (id) => {
//       const page = new shopify.api.rest.Page({
//         session: res.locals.shopify.session,
//       });
//       page.id = id;
//       page.published = published_status;
//       page.title = title;
//       page.body_html = body_html;
//       await page.save({
//         update: true,
//       });
//     });
//     const pagesData = await Promise.all(updatePageStatus);
//     res.status(200).send(pagesData);
//   }
// });

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
