var feeds = {
 "newsfeeds": [
    {
     "site": { "url":"http://www.newsoftheworld.co", "name":"newsoftheworld.co", "description": ""},
     "headline": { "url":"http://www.newsoftheworld.co", "name":"News of The World Launches Global News Channel","description":"News of The World Launches Global News Channel"},
     "timestamp": {"time":"", "timelapsed":"20 minutes ago"}
    },
    {
      "site": { "url":"http://www.axlisgod.com", "name":"www.axlisgod.com", "description": ""},
      "headline": { "url":"http://www.axlisgod.com", "name":"Vatican accept Axl Rose as the Infinite Spirit","description":"Vatican accept Axl Rose as the Infinite Spirit"},
      "timestamp": {"time":"", "timelapsed":"50 minutes ago"},
     },
     {
       "site": { "url":"http://www.freeyoursource.org", "name":"www.freeyoursource.org", "description": ""},
       "headline": { "url":"http://www.freeyoursource.org", "name":"FreeYourSource.org to buy Slashdot","description":"FreeYourSource.org to buy Slashdot"},
       "timestamp": {"time":"", "timelapsed":"0 minutes ago"}
     }
  ]
};
/*
*/
    
var index = 0;
function updateNewsDiv()
{

  var newsfeeds = feeds["newsfeeds"];
  var newsfeedslength = newsfeeds.length;
  
  /*while(true) { */
  
  if (index == newsfeedslength) {
    index = 0;
  }
  
  
  
  var newsfeed = newsfeeds[index];
  var trackernewsdiv = document.getElementById("trackernews");
  var newsSiteElement = document.getElementById("trackernewssitename");
  newsSiteElement.innerHTML = newsfeed["site"]["name"];
  var newsAnchorElement = document.getElementById("trackernewsdescriptionlink");
  
  newsAnchorElement.href = newsfeed["headline"]["url"];
  newsAnchorElement.innerHTML = newsfeed["headline"]["name"];
  var timeStampElement = document.getElementById("trackernewstimestamp");
  timeStampElement.innerHTML = newsfeed["timestamp"]["timelapsed"];
  
  /*
  pausecomp(3000);
  }
  */
  
  index++;
  
  setTimeout("updateNewsDiv()", 3000);
  
}

function pausecomp(millis)
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); }
while(curDate-date < millis);
} 
  