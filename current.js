const puppeteer = require("puppeteer");
var fsp = require('fs').promises;

// starting Puppeteer
puppeteer.launch({
    headless: false,
     // 200ms slow down
}).then(async browser => {

     function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
};

    // opening a page
    const page = await browser.newPage();
	
    await page.goto("https://www.weather-us.com/en/new-york-usa/southport");
	//await page.setViewport({ width: 1920, height: 926 });
    await delay(20000);
	await page.waitForSelector("body");

    resultArray = [];
    Forecast = {};
    var Hour, Day, Icon, High, Low, Desc, Rain, Like, Wind, Humidity, Baro, Visibility, UV;

	////// when I console the TimeHour it returns 20, when I console.log the Hour it returns 20.....when it writes the data in the json file\
	/////  it only writes 2.    Why is that?
	
	
	var today = new Date();
    var TimeHour = today.getHours();
console.log(TimeHour);
   
	Hour = TimeHour.toString();
console.log(Hour);		
    Day = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Day => Day.innerHTML);
    }, '#today');

    Icon = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Icon => Icon.getAttribute('data-src'));
    }, "div.col-xs-12.col-md-8 > div:nth-child(3) > div > div.col-xs-4.text-center.pl10 > img");

    High = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(High => High.innerHTML);
    }, "span.text-danger.font_175_rem");

    Low = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Low => Low.innerHTML);
    }, "span.text-primary.font_150_rem");

    Desc = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Desc => Desc.innerHTML);
    }, "div:nth-child(3) > div > div.col-xs-8 > span");

    Rain = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Rain => Rain.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(4)");

    Like = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Like => Like.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(1) > ul > li.font_150_rem"); 
	
	Wind = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Wind => Wind.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(1)"); 
	
	Humidity = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Humidity => Humidity.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(2)"); 
	
	Baro = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Baro => Baro.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(4)");
	
	Visibility = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(Visibility => Visibility.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(6)"); 
	
	UV = await page.evaluate((selector) => {
        const list = document.querySelectorAll(selector);
        const anchors = [...list];
        return anchors.map(UV => UV.innerHTML);
    }, "div.col-xs-8 > div > div:nth-child(2) > ul > li:nth-child(7)");

    var keys = ["hour","day", "icon", "high", "low", "desc", "rain","like","wind","humidity", "baro", "vis", "uv"];
    var values = [Hour, Day, Icon, High, Low, Desc, Rain, Like, Wind, Humidity, Baro, Visibility, UV];
    var resultArray = [];
    for (var i = 0; i < 1; i++) {
        var obj = {};
        for (var j = 0; j < keys.length; j++) {
            obj[keys[j]] = values[j][i];
        }
			
        resultArray.push(obj);
		  
    } 
	

    // outputting the scraped data

    var output = JSON.stringify(resultArray, null, "\t"); 
	
    await fsp.writeFile("current.json", output);

    // closing the browser
    await browser.close();
    //console.log("Browser Closed");

}).catch(function(err) {
    console.error(err);
});
