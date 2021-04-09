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

        var allPosts = document.querySelectorAll("#inner-content > div.region-content-main > div:nth-child(1) > div > div:nth-child(1) > div > lib-forecast-chart > div > div");
 
        let ForecastData = [];
		let Forecast = {};
        allPosts.forEach(item => {
            
	//using querySelectorAll on the below elements returns nothing.......example:
	//Forecast.Day = item.querySelectorAll("div.forecast-date > a:nth-child(-n+6) > div > div").innerHTML;
		// still only returns the 1st item, not the next the 5......
			
	    Forecast.Day = item.querySelector("div.forecast-date > a:nth-child(-n+6) > div > div").innerHTML;
	    Forecast.Icon = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(2) > img").getAttribute('src');
            Forecast.High = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(1) > span.temp-hi").innerHTML;
            Forecast.Low = item.querySelector("div.forecast > a:nth-child(-n+6) > div > span:nth-child(1) > span.temp-lo").innerHTML;
            Forecast.Desc = item.querySelector("div.forecast > a:nth-child(-n+6) > div > div").innerHTML;
	    Forecast.Rain = item.querySelector("div.precip > a:nth-child(-n+6) > div > div > span").innerHTML;
		   
        });
		 
		ForecastData.push(Forecast); 
		 
        return JSON.stringify(ForecastData);
    });
  
    // outputting the data
    
	console.log(grabWeather);
	
	
    //await fsp.writeFile(this.path, JSON.stringify(grabWeather, null, "\t")); 

    // closing the browser
    await browser.close();
    //console.log("Browser Closed");

}).catch(function(err) {
    console.error(err);
});
