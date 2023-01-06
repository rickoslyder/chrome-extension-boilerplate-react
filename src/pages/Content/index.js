import invokeScraper from '../Popup/invokers/invokeScraperFunctions';

// console.log('Content script works!');
// console.log('Must reload extension for modifications to take effect.');

// Create a function that checks the current URL and returns the correct object
const getSite = async (url) => {
  if (url.includes('rightmove')) {
    const property = await invokeScraper('rightmove', url);
    return property;
  } else if (url.includes('zoopla')) {
    const property = await invokeScraper('zoopla', url);
    return property;
  } else if (url.includes('onthemarket')) {
    const property = await invokeScraper('onthemarket', url);
    return property;
  } else {
    alert('Site not supported yet / Invalid URL');
    return null;
  }
};

const isPropertyListing = (url) => {
  if (url.includes('rightmove')) {
    return url.includes('properties');
  } else if (url.includes('zoopla')) {
    return url.includes('to-rent/details') || url.includes('for-sale/details');
  } else if (url.includes('onthemarket')) {
    return url.includes('details');
  } else {
    return false;
  }
};

const scrapeProperty = async (url) => {
  if (isPropertyListing(url)) {
    const property = await getSite(url);
    console.log('property = ', property);
    return property;
  } else {
    return {
      error:
        'Invalid URL - active tab must be using Rightmove, Zoopla or OnTheMarket',
    };
  }
};

const createHomeLoggerButton = () => {
  console.log('attempting to create button');
  if (
    window.homeLoggerCurrentUrl &&
    isPropertyListing(window.homeLoggerCurrentUrl)
  ) {
    // right click
    const element = document.createElement('div');
    element.textContent = 'Zoopla pop-up test';
    element.style.position = 'fixed';
    element.style.top = 10;
    element.style.left = 10;
    element.style.backgroundColor = 'white';
    element.style.padding = '5px';
    element.style.border = '1px solid black';
    element.style.zIndex = '9999';
    document.body.appendChild(element);
    element.dispatchEvent(new Event('homelogger-button'));
  }

  // Create a div element for the popup
  const popup = document.createElement('div');
  popup.style.cssText = `position: fixed; z-index: 999; top: 10px; right: 10px; background-color: white; padding: 20px; border: 1px solid black;`;

  // Create a button element
  const button = document.createElement('button');
  button.innerText = 'Click me';
  button.style.cssText = `display: block; margin: 0 auto;`;
  button.style.zIndex = '999';

  // Add the button to the popup
  popup.appendChild(button);

  // Add an event listener to the button to close the popup when it is clicked
  button.addEventListener('click', () => {
    popup.remove();
  });

  // Add the context menu event listener to the document
  document.addEventListener('homelogger-button', (event) => {
    event.preventDefault();
    document.body.appendChild(popup);
  });
};

// const saveProperty = async (listing) => {
//   if (listing) {
//     try {
//       await supabase.from("listings").upsert({
//         ...listing,
//         user_id: currentUserId
//       });

//       console.log('property saved -', listing)

//       // const action = snackbarId => (
//       //   <>
//       //     <Button variant="outlined" color="inherit" onClick={async () => {
//       //       await supabase.from("listings").delete().order('last_modified', { ascending: false }).limit(1).single
//       //       enqueueSnackbar('Undo complete', { variant: 'success' })
//       //     }}>
//       //       Undo
//       //     </Button>
//       //     <Button variant="outlined" color="inherit" onClick={() => { window.location = `${window.location.origin}/listings/saved` }}>
//       //       View Saved Listings
//       //     </Button>
//       //   </>
//       // )

//       // enqueueSnackbar('Listing successfully saved!', { variant: 'success', action });
//     } catch (error) {
//       console.error(error);
//       // enqueueSnackbar(`Error saving listing - ${error}`, { variant: 'error' });
//     }
//   }
// };

const globalPropertyObject = {};

// inject helper script to clone page window
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Listen for messages from the helper script
window.addEventListener('message', (event) => {
  if (event.data.currentPageUrl) {
    window.homeLoggerCurrentUrl = event.data.currentPageUrl;
  }
});

document.addEventListener('DOMContentLoaded', createHomeLoggerButton);

// add listener for scraping
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'scrapeProperty') {
    // Call the scrapeProperty function or raise error
    if (!window.homeLoggerCurrentUrl) {
      console.log('No property object found - try again!');
      alert('No property object found - try again!');
      return;
    }
    const result = await scrapeProperty(window.homeLoggerCurrentUrl);
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

const savePropertyToLocal = async (propertyObj) => {
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
