/*const cheerio=require('cheerio');
const rp=require('request-promise');
const link="https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States";

rp(link)
.then(function(html){
   const $=cheerio.load(html);
  const title = $('wikitable td b a');
  console.log(title.lenght);
  const wiki=[];
  for(let i =0;i<title.lenght;i++)
  {
    const Name=title[i].attribs.title;
    const link=title[i].attribs.href;
    wiki.push({Name,link});
  }

  console.log(wiki);
})
.catch(function(err){
      console.log(err);
})*/
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const link = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

// Async function which scrapes the data
async function scrapeData() {
  try {
    
    const { data } = await axios.get(link);
    //load data
    const $ = cheerio.load(data);

    const listItems = $(".plainlist ul li");
  
    const countries = [];
    //loop
    listItems.each((idx, el) => {
    
      const country = { name: "", catogory: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("a").text();
      country.iso3 = $(el).children("span").text();
      // push data
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    fs.writeFile("menu.json", JSON.stringify(countries, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();