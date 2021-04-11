const puppeteer = require("puppeteer");
var fsp = require('fs').promises;

// starting Puppeteer
puppeteer.launch({
    headless: false,
    slowMo: 200 // 200ms slow down
}).then(async browser => {

    // opening a page
    const page = await browser.newPage();
    await page.goto("https://www.wunderground.com/forecast/us/ny/elmira/14904", {
        waitUntil: "networkidle2"
    });
    await page.waitForSelector("body");

    resultArray = [];
    Forecast = {};
    var Day, Icon, High, Low, Desc, Rain;

    Day = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Day => Day.innerHTML);
    }, 'div.forecast-date > a:nth-child(-n+8) > div > div');

    Icon = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Icon => Icon.getAttribute('src'));
    }, "div.forecast > a:nth-child(-n+8) > div > span:nth-child(2) > img");

    High = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(High => High.innerHTML);
    }, "div.forecast > a:nth-child(-n+8) > div > span:nth-child(1) > span.temp-hi");

    Low = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Low => Low.innerHTML);
    }, "div.forecast > a:nth-child(-n+8) > div > span:nth-child(1) > span.temp-lo");

    Desc = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Desc => Desc.innerHTML);
    }, "div.forecast > a:nth-child(-n+8) > div > div");

    Rain = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Rain => Rain.innerHTML);
    }, "div.precip > a:nth-child(-n+8) > div > div > span");

    var keys = ["day", "icon", "high", "low", "desc", "rain"];
    var values = [Day, Icon, High, Low, Desc, Rain];
    var resultArray = [];
    for (var i = 0; i < values.length; i++) {
        var obj = {};
        for (var j = 0; j < keys.length; j++) {
            obj[keys[j]] = values[j][i];
        }
        resultArray.push(obj);
    }

    // outputting the scraped data

    console.log(JSON.stringify(resultArray));
    await fsp.writeFile("forecast.json", JSON.stringify(resultArray));

    // closing the browser
    await browser.close();
    //console.log("Browser Closed");

}).catch(function(err) {
    console.error(err);
});
