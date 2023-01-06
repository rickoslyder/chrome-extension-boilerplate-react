import RightmoveScraper from '../Popup/scrapers/RightmoveScraper';
import OnTheMarketScraper from '../Popup/scrapers/OnTheMarketScraper';
import ZooplaScraper from '../Popup/scrapers/ZooplaScraper';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

// Create a function that checks the current URL and returns the correct object
const getSite = async (windowObject) => {
  console.log('getSite window - ', windowObject);
  const url = windowObject.location.href;
  if (url.includes('rightmove')) {
    const property = await RightmoveScraper(windowObject);
    return property;
  } else if (url.includes('zoopla')) {
    const property = await windowObject.zooplaObject;
    return property;
  } else if (url.includes('onthemarket')) {
    const property = await OnTheMarketScraper(windowObject);
    return property;
  } else {
    console.log('Site not supported yet');
    return null;
  }
};

// Create a function that checks if the current page is a property listing
const isPropertyListing = (windowObject) => {
  console.log('isPropertyListing window - ', windowObject);
  const window = windowObject;
  console.log('href =', window.location.href);
  if (window.location.href.includes('rightmove')) {
    return window.location.href.includes('properties');
  } else if (window.location.href.includes('zoopla')) {
    return window.location.href.includes('to-rent');
  } else if (window.location.href.includes('onthemarket')) {
    return window.location.href.includes('details');
  } else {
    return false;
  }
};

var globalPropertyObject = {};

const scrapeProperty = async (windowObject) => {
  // proceed if link is property listing
  console.log('scrapeProperty window - ', windowObject);
  if (isPropertyListing(windowObject)) {
    const property = await getSite(windowObject);
    console.log('Property = ', property);
    globalPropertyObject = property;
    console.log('globalPropertyObject: ', globalPropertyObject);
    saveProperty(property);
    return property;
  } else {
    // otherwise reject request and clearly display reason to user
    return {
      error:
        'Invalid URL - active tab must be using Rightmove, Zoopla or OnTheMarket',
    };
  }
};

// inject helper script to clone page window
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Listen for messages from the helper script
window.addEventListener('message', (event) => {
  if (event.data.message === 'windowObject') {
    window.pageWindow = event.data.windowObject;
  }
});

// add listener for scraping
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'scrapeProperty') {
    // Call the scrapeProperty function with the window object
    const result = await scrapeProperty(window.pageWindow);
    console.log('scraping listener - result object: ', result);

    // If something went wrong, send a failed status
    if (result.error) {
      sendResponse({ status: 'failed', reason: `${result.error}` });
      return;
    }

    // Otherwise, send the success status and the property data
    console.log(
      'scraping listener - property response object: ',
      globalPropertyObject
    );
    sendResponse({ status: 'success', property: globalPropertyObject });
  }
});

const checkForExistingListings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('homelogger-scraped-listings', (result) => {
      console.log(result);
      resolve(result['homelogger-scraped-listings']);
    });
  });
};

const saveProperty = async (propertyObj) => {
  if (propertyObj) {
    const property = propertyObj;

    checkForExistingListings().then((response) => {
      if (response) {
        const existingListings = response;

        const updatedListings = [...existingListings, property];

        chrome.storage.local.set({
          'homelogger-scraped-listings': updatedListings,
        });
      } else {
        // Save to google storage
        chrome.storage.local.set(
          { 'homelogger-scraped-listings': [property] },
          () => {
            console.log('Saved property to local storage - ', property);
          }
        );

        console.log('Property saved');
      }
    });
  }
};
