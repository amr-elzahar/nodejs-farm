const http = require("http");
const fs = require("fs");
const url = require("url");

const templateOverview = fs.readFileSync(
  `${__dirname}/html/overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/html/product.html`,
  "utf-8"
);
const templateProductCard = fs.readFileSync(
  `${__dirname}/html/product-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const templateHandler = (template, product) => {
  let output = template.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIBTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((product) => templateHandler(templateProductCard, product))
      .join("");

    const finalOverview = templateOverview.replace(
      "{%PRODUCT_CARDS%}",
      cardsHtml
    );
    res.end(finalOverview);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const product = dataObj[query.id];
    const finalProduct = templateHandler(templateProduct, product);

    res.end(finalProduct);
  }
});

server.listen(3000, "192.168.1.5", () =>
  console.log("Server is listening on port 3000...")
);
