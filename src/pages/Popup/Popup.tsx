import React, { useState, useEffect } from 'react';
import { Listing } from '../../../lib/database.types';
import ListingCard from './components/ListingCard';
import './Popup.css';
// import PropertyViewer from './propertyViewer';

const checkForExistingListings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('homelogger-scraped-listings', (result) => {
      console.log(result);
      resolve(result['homelogger-scraped-listings']);
    });
  });
};

const retrieveLatestListing = async () => {
  const listings = await checkForExistingListings() as Listing[];
  console.log('listings', listings);
  const latestProperty = listings[listings.length - 1];
  console.log('latest property retrieved - ', latestProperty);

  return latestProperty;
};

const saveProperty = async (propertyObj: Listing) => {
  if (propertyObj) {
    const property = propertyObj;

    checkForExistingListings().then((response) => {
      if (response) {
        const existingListings = response;

        const updatedListings = [...existingListings as Listing[], property];

        chrome.storage.local.set({
          'homelogger-scraped-listings': updatedListings,
        });
      } else {
        // Save to google storage
        chrome.storage.local.set(
          { 'homelogger-scraped-listings': [property] }
        );

        console.log('Property saved');
      }
    });
  }
};

const Popup = () => {
  const [show, setShow] = useState(false);
  const [property, setProperty] = useState<Listing | null>(null);
  const [scrapingRequestSent, setScrapingRequestSent] = useState(false);
  const [savedListings, setSavedListings] = useState<Listing[] | null>(null);
  const [localSavedListings, setLocalSavedListings] = useState<Listing[] | null>(null);

  // const latestLocalListing = localSavedListings ? localSavedListings[localSavedListings.length - 1] : null

  useEffect(() => {
    // Load the state from storage when the component mounts
    chrome.storage.sync.get(['localSavedListings'], (result) => {
      setLocalSavedListings(result.localSavedListings);
    });
  }, []);

  useEffect(() => {
    // Save the state to storage whenever it changes
    chrome.storage.sync.set({ localSavedListings });
  }, [localSavedListings]);

  const sendScrapeRequestFromPopup = async () => {
    setScrapingRequestSent(true);
    chrome.runtime.sendMessage({ message: 'scrapePage' }, async (response) => {
      if (response.status === 'success') {
        const latestListing = await retrieveLatestListing();
        console.log(latestListing);
        setProperty(latestListing);
        setLocalSavedListings([...localSavedListings as Listing[], latestListing] as Listing[])
        return true;
      } else {
        setScrapingRequestSent(false);
        return false;
      }
    });
  };

  console.log('property -', property)

  return (
    <div className="App">
      <header className="App-header">
        <h1>HomeLogger</h1>
        <button onClick={() => setShow(!show)}>Display saved property</button>
        <button onClick={sendScrapeRequestFromPopup}>Save this listing</button>
        {show && (
          <div id="property-viewer" className="most-recent .wrap">
            {property ? <ListingCard listing={property} /> : 'no property loaded'}
            {/* {(latestLocalListing && !property) ? <ListingCard listing={latestLocalListing} /> : null} */}
          </div>
        )}
      </header>
    </div>
  );
};

export default Popup;

/* 

Flow:

- Open Chrome pop-up (or context menu clicked - either on link or on active property listing tab)
- Popup opens - confirmation dialog if triggered from context menu, show 'Scrape Property' button if opened directly on valid URL, greyed out button if URL is invalid

- User clicks 'Scrape Property' button-> 
--- Pull details from page via content script
--- create property object, save object in local storage
--- pass info back to popup (send message - confirmed scrape/failed scrape + error)
--- Popup retrieves property object from local storage
--- Object is used to render the property within popup
--- Add an edit icon beside each detail + save button at bottom of page
--- Once saved, display all recently scraped properties (details = {address}{bedrooms}{bathrooms}/summary elements = all details expanded)

- User clicks 'Cancel' button / invokes flow from invalid URL-> 
--- Displays list of any previously scraped properties
*/
