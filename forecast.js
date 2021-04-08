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
    let grabWeather = await page.evaluate(() => {

        var allPosts = document.querySelectorAll("lib-forecast-chart-header-daily > div > div > div");
 
        let ForecastData = [];
        allPosts.forEach(item => {
            let Forecast = {};
	
	// This is only returning the 1st item.  I've tried .map, append, a regular loop.... can only ever get the 1st item
	// so the first nth child selector is returning from 1-6 [really 0-6] the second nth child is always the same
	// it gets the 1st one but does not get the rest of them... 
		
            Forecast.Day = item.querySelector("div.forecast-date > a:nth-child(-n+6) > div > div").innerHTML;
	    Forecast.Icon = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(2) > img").getAttribute('src');
            Forecast.High = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(1) > span.temp-hi").innerHTML;
            Forecast.Low = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(1) > span.temp-lo").innerHTML;
            Forecast.Desc = item.querySelector("div.forecast > a:nth-child(-n+6) > div > div").innerHTML;
	    Forecast.Rain = item.querySelector("div.precip > a:nth-child(-n+6) > div > div > span").innerHTML;
		  
            ForecastData.push(Forecast);
        });

        return JSON.stringify(ForecastData);
    });
  
    // outputting the scraped data
    
	console.log(grabWeather);
    //await fsp.writeFile(this.path, JSON.stringify(grabWeather, null, "\t")); 

    // closing the browser
    await browser.close();
    //console.log("Browser Closed");

}).catch(function(err) {
    console.error(err);
});
