const checkForExistingListings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('homelogger-scraped-listings', (result) => {
      console.log(result);
      resolve(result['homelogger-scraped-listings']);
    });
  });
};

const retrieveLatestListing = async () => {
  const retrievedProperties = await checkForExistingListings();
  console.log(retrievedProperties);
  const latestProperty = retrievedProperties[retrievedProperties.length - 1];
  console.log('latest property retrieved - ', latestProperty);
  return latestProperty;
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
            document.getElementById('tenants_needed').style.display = 'none';
            document.getElementById('no_tenants_yet').style.display = 'none';
            document.getElementById('tenants_entered').style.display = 'block';
          }
        );

        console.log('Property saved');
      }
    });
  }
};

try {
  const sendScrapeRequest = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;

      chrome.tabs.sendMessage(
        activeTab,
        { message: 'scrapeProperty' },
        async (response) => {
          console.log(response);
          if (response?.status !== 'success') {
            console.log('Error: property scraping failed.');
            console.log('response -', response);
            console.log(response.reason);
            return;
          } else {
            console.log('Property scraping succeeded.');
            let property = await retrieveLatestListing();
            console.log(property);
          }
        }
      );
    });
  };

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request?.message === 'scrapePage') {
      sendScrapeRequest();
      sendResponse({ status: 'success' });
    }
  });

  // Don't touch this
  chrome.contextMenus.remove('homelogger', function () {
    chrome.contextMenus.create({
      id: 'homelogger',
      title: 'Scrape property details',
      contexts: ['all'],
    });
  });

  chrome.contextMenus.onClicked.addListener(sendScrapeRequest);
} catch (e) {
  console.error(e);
}
