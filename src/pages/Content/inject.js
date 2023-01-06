import invokeScraper from '../Popup/invokers/invokeScraperFunctions';

const pageUrlObj = { currentPageUrl: window.location.href };

window.homeLoggerCurrentUrl = window.location.href;

const createHomeLoggerButton = () => {
  if (
    window.homeLoggerCurrentUrl &&
    isPropertyListing(window.homeLoggerCurrentUrl)
  ) {
    console.log('property listing found - creating HomeLogger popup');
    // right click
    const element = document.createElement('div');
    element.id = 'homeloggerPopup';
    element.innerHTML = `
  <div id="logo" style="display: block; margin: 0 auto;">
    <img src="https://i.imgur.com/HO2k1YH.png" alt="HomeLogger Logo" style="width: 90%; margin: auto; display: block; padding-top: 10px"/>
  </div>
  <br />
  <button id="save-listing-button" style="display: block;margin: 0 auto;background: #c4ff61;color: #1a1a1a; border-radius: 5px; border: 1px solid #1a1a1a; box-shadow: 0 2px 5px 0 rgb(99 107 118 / 20%), 0 2px 10px 0 rgb(99 107 118 / 20%); height: 35px; padding: 3px 10px 4px; text-align: center; vertical-align: middle; width: auto; font-weight: bold; font-family: 'Roboto','Helvetica','Arial', sans-serif;">Save Listing</button>
  <div id="loading-indicator" style="display: none;">
    <img src="https://icons8.com/preloaders/preloaders/1495/Spinner-3.gif" alt="Loading" />
  </div>
  <br />
  <div id="response" style="display: none; overflow-wrap: break-word;"></div>
`;

    element.style.cssText =
      'position: fixed;top: 10px;right: 10px;font-family: "Roboto","Helvetica","Arial",sans-serif;background-color: white;padding: 5px;border: 1px solid black;z-index: 9999;overflow-wrap: break-word;width: 20vw;max-height: 50vh;height: fit-content;overflow: hidden auto;border-radius: 15px;background: #d7ff94;box-shadow: 0 4px 8px 0 rgb(99 107 118 / 20%), 0 4px 16px 0 rgb(99 107 118 / 20%); border:1.5px solid #1a1a1a';

    document.body.appendChild(element);
    element.dispatchEvent(new Event('homelogger-button'));

    // Create a div element for the popup
    const close = document.createElement('div');
    close.innerText = 'X';
    close.id = 'close-btn';
    close.style.cssText = `position: fixed; z-index: 999; top: 20px; right: 20px; background-color: white; padding: 1px; cursor: pointer; background: #d7ff94`;

    // Add the button to the popup
    element.appendChild(close);

    // Add an event listener to the button to close the popup when it is clicked
    close.addEventListener('click', () => {
      element.remove();
    });

    console.log('popup created');
  } else {
    console.log(
      'unable to create HomeLogger popup - current URL is not a listing'
    );
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

createHomeLoggerButton();

// Get references to the button and loading indicator elements
const saveButton = document.getElementById('save-listing-button');
const loadingIndicator = document.getElementById('loading-indicator');
const responseDiv = document.getElementById('response');

// Handle the button click event
saveButton.addEventListener('click', () => {
  // Show the loading indicator while waiting for the response
  loadingIndicator.style.display = 'block';
  // Send a request to the backend
  // getSite(window.homeLoggerCurrentUrl).then((data) => {

  // use mock data for testing
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
      // Display the response on screen and hide the loading indicator
      console.log(data);
      responseDiv.innerText = JSON.stringify(data);
      loadingIndicator.style.display = 'none';
      responseDiv.style.display = 'block';
    });
});

window.postMessage(pageUrlObj, '*');
