import { printLine } from './modules/print';
import RightmoveScraper from '../Popup/scrapers/RightmoveScraper';
import OnTheMarketScraper from '../Popup/scrapers/OnTheMarketScraper';
import ZooplaScraper from '../Popup/scrapers/ZooplaScraper';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

// chrome.runtime.sendMessage({ todo: 'scrapeProperty' }, function (response) {
//   const property = PropertyScraper();
//   chrome.runtime.sendMessage({ todo: 'addProperty', property: property });
//   console.log(response);
// });

// Create a function that checks the current URL and returns the correct object
const getSite = () => {
  const url = window.location.href;
  if (url.includes('rightmove')) {
    return RightmoveScraper();
  } else if (url.includes('zoopla')) {
    return ZooplaScraper();
  } else if (url.includes('onthemarket')) {
    return OnTheMarketScraper();
  } else {
    console.log('Site not supported yet');
    return null;
  }
};

// Create a function that checks if the current page is a property listing
const isPropertyListing = () => {
  console.log('href =', window.location.href);
  if (window.location.href.includes('rightmove')) {
    return window.location.href.includes('property-to-rent');
  } else if (window.location.href.includes('zoopla')) {
    return window.location.href.includes('to-rent');
  } else if (window.location.href.includes('onthemarket')) {
    return window.location.href.includes('to-rent');
  } else {
    return window.location.href.includes('to-rent');
  }
};

const scrapeProperty = () => {
  // proceed if link is property listing
  if (isPropertyListing()) {
    const property = getSite();
    return property;
  } else {
    // otherwise reject request and clearly display reason to user
    return {
      error:
        'Invalid URL - active tab must be using Rightmove, Zoopla or OnTheMarket',
    };
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'scrapeProperty') {
    //   const { content } = request;

    // Call this insert function
    const result = scrapeProperty();

    // If something went wrong, send a failes status
    if (result.error) {
      sendResponse({ status: 'failed', reason: `${result.error}` });
      return;
    }

    sendResponse({ status: 'success', property: result });
  }
});
