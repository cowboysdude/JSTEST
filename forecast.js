const puppeteer = require("puppeteer");

// starting Puppeteer
puppeteer.launch({
	headless: false,
    slowMo: 200 // 200ms slow down
}).then(async browser => {

    // opening a page
    const page = await browser.newPage();
    await page.goto("https://www.wunderground.com/forecast/us/ny/elmira/14904");
    await page.waitForSelector("body");

    // manipulating the page"s content
    ForecastData = [];
Forecast = {};
var Day, Icon, High, Low, Desc, Rain;

Day = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(Day => Day.innerHTML); 
}, 'div.forecast-date > a:nth-child(-n+5) > div > div'); 
       
 Icon = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(Icon => Icon.getAttribute('src'));
}, "div.forecast > a:nth-child(-n+5) > div > span:nth-child(2) > img");

 High = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(High => High.innerHTML);
}, "div.forecast > a:nth-child(-n+5) > div > span:nth-child(1) > span.temp-hi"); 

 Low = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(Low => Low.innerHTML);
}, "div.forecast > a:nth-child(-n+5) > div > span:nth-child(1) > span.temp-lo");

 Desc = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(Desc => Desc.innerHTML);
}, "div.forecast > a:nth-child(-n+5) > div > div");

 Rain = await page.evaluate((selector) => {
  const list = document.querySelectorAll(selector);
  const anchors = [...list];
  return anchors.map(Rain => Rain.innerHTML);
}, "div.precip > a:nth-child(-n+5) > div > div > span");

/*for (i=0; i < Day.length; i++){
	var days = Object.assign(Forecast, JSON.stringify(Day[i]));
	console.log(days);
} */
 console.log(Day.length);
var keys = ["day", "icon", "high", "low", "desc", "rain"];
var values = [Day, Icon, High, Low, Desc, Rain];
var resultArray = [];
for(var i=0; i<values.length; i++){
  var obj = {};
  for(var j=0; j<keys.length; j++){
     obj[keys[j]] = values[i][j];
  }
   resultArray.push(JSON.stringify(obj));
} 
    // outputting the data
    // this outputs this ->  
   //	[
//  '{"day":"Sat 4/10","icon":"Sun 4/11","high":"Mon 4/12","low":"Tue 4/13","desc":"Wed 4/14"}',
//  '{"day":"//www.wunderground.com/static/i/c/v4/34.svg","icon":"//www.wunderground.com/static/i/c/v4/12.svg","high":"//www.wunderground.com/static/i/c/v4/11.svg","low":"//www.wunderground.com/static/i/c/v4/11.svg","desc":"//www.wunderground.com/static/i/c/v4/11.svg"}',
//  '{"day":"79°","icon":"68°","high":"58°","low":"59°","desc":"59°"}',
//  '{"day":"56°","icon":"51°","high":"46°","low":"44°","desc":"41°"}',
//  '{"day":"Mostly Sunny","icon":"Rain","high":"Showers","low":"Showers","desc":"Showers"}',
//  '{"day":"0.13 in","icon":"0.82 in","high":"0.32 in","low":"0.39 in","desc":"0.14 in"}'
//]
///  getting closer but not there quite yet.... trying to figure out how to fill out the data correctly.  as you can see it's putting all the data from Day into the 1st object, and so forth	
  
     console.log(resultArray); 
    //await fsp.writeFile(this.path, JSON.stringify(grabWeather, null, "\t")); 

    // closing the browser
    await browser.close();
    //console.log("Browser Closed");

}).catch(function(err) {
    console.error(err);
});
