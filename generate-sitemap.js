const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

const hostname = "https://www.paolanicola.com.ar";

const paths = [
  "/",
  "/tienda",
  "/home",
  "/sobre-mi",
  "/contacto"
];

const sitemapStream = new SitemapStream({ hostname });

paths.forEach((path) => {
  sitemapStream.write({ url: path, changefreq: "daily", priority: 0.8 });
});

sitemapStream.end();

streamToPromise(sitemapStream).then((sitemap) => {
  createWriteStream("./public/sitemap.xml").write(sitemap);
  console.log("✅ Sitemap generado correctamente.");
});