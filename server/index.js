// const path = require("path");
const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const port = 8001;
// app.use(express.static(path.join(__dirname, "..", "build")));
// app.use(express.static("public"));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(helmet());

app.set('port', port);

const scrapeData = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const upEl = await page.$$('.gs_ai_t');
  const listOfData = await Promise.all(upEl.map( async (data, index) => {
    const email = await data.$('.gs_ai_eml');
    const anchor = await data.$('.gs_ai_name > a');
    const emailProperty = await email.getProperty('innerHTML');
    const nameProperty = await anchor.getProperty('innerHTML');
    const hrefProperty = await anchor.getProperty('href');
    const jsonEmail = await emailProperty.jsonValue();
    const jsonName = await nameProperty.jsonValue();
    const jsonHref = await hrefProperty.jsonValue();

    return {
      href: jsonHref,
      text: jsonName,
      email: jsonEmail,
    }
  }))

  await browser.close()
  console.log('listOfData', listOfData)
  return listOfData;
}

const simulateNextClick = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const nextClickElement = await page.$('.gsc_pgn_pnx')
  await nextClickElement.evaluate(el => el.click())
  await page.waitForNavigation();
  const newPageUrl = await page.evaluate(() => location.href);  
  const newData = await scrapeData(newPageUrl)
  await browser.close()

  return newData;
}

const simulateBackClick = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const nextClickElement = await page.$('.gsc_pgn_ppr')
  await nextClickElement.evaluate(el => el.click())
  await page.waitForNavigation();
  const newPageUrl = await page.evaluate(() => location.href);  
  const newData = await scrapeData(newPageUrl)
  await browser.close()

  return newData;
}

app.get('/', async (req, res) => {
  const url = 'https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=label%3Aionosphere+-in+-cn+-de+&btnG=';
  const authorInfo = await scrapeData(url)

  res.status(200).json({
    authorInfo
  })
})

app.post('/', async (req, res) => {
  const bodyData = await req.body;
  let authorInfo;
  if (bodyData.type === 'POST') {
    authorInfo = await scrapeData(bodyData.url);
  } else if (bodyData.type === 'NEXT') {
    authorInfo = await simulateNextClick(bodyData.url)
  } else if (bodyData.type === 'BACK') {
    authorInfo = await scrapeData(bodyData.url);
  }

  res.status(200).json({
    authorInfo
  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}`))
