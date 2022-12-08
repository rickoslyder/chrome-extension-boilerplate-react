import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
// import PropertyScraper from './propertyScraper';
import PropertyViewer from './propertyViewer';

const checkForExistingListings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['padfinder-scraped-listings'], (result) => {
      console.log(result);
      resolve(result['padfinder-scraped-listings']);
    });
  });
};

const saveProperty = async (propertyObj) => {
  if (propertyObj) {
    const property = propertyObj;

    checkForExistingListings().then((response) => {
      if (response) {
        const existingListings = response;
        const updatedListings = response;

        updatedListings.Popup;

        Object.assign(
          {},
          ...Array.from(
            updatedListings.map((x) => {
              return x;
            })
          )
        );

        chrome.storage.local.set({
          'padfinder-scraped-listings': [
            ...existingListings,
            (`${property.propertyURL}`: property),
          ],
        });
      } else {
        // Save to google storage
        chrome.storage.local.set(
          { 'padfinder-scraped-listings': [property] },
          () => {
            document.getElementById('tenants_needed').style.display = 'none';
            document.getElementById('no_tenants_yet').style.display = 'none';
            document.getElementById('tenants_entered').style.display = 'block';
          }
        );

        console.log('Tenant saved');
      }
    });
  }
};

const Popup = () => {
  const [show, setShow] = useState(false);
  const [property, setProperty] = useState({});

  // setProperty(PropertyScraper());chrome.runtime.sendMessage({ todo: "showPageAction" });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab);
    if (request.message === 'addProperty') {
      const property = request.property;
      const propertyAddress = property.propertyAddress;
      const details = property.details;
      const cost = property.cost;
      const furnished = property.furnished;
      const agency = property.agency;
      const propertyURL = property.propertyURL;
      const size = property.size;
      const availableFrom = property.availableFrom;
      const floorplan = property.floorplan;
      const epc = property.epc;

      const propertyData = {
        propertyAddress: propertyAddress,
        details: details,
        cost: cost,
        furnished: furnished,
        agency: agency,
        propertyURL: propertyURL,
        size: size,
        availableFrom: availableFrom,
        floorplan: floorplan,
        epc: epc,
      };

      setProperty(propertyData);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => setShow(!show)}>Click here</button>
        {show && <PropertyViewer {...property} />}
      </header>
    </div>
  );
};

export default Popup;

/* 

Flow:

- Open Chrome pop-up (or context menu clicked - either on link or on active property listing tab)
- Popup opens - confirmation dialog if triggered from context menu, show 'Scrape Property' button if opened directly on valid URL, greyed out button if URL is invalid

- User clicks 'Proceed' / 'Scrape Property' button-> 
--- Pull details from page via content script
--- create property object, save object in local storage
--- pass info back to popup (send message - confirmed scrape/failed scrape + error)
--- Popup retrieves property object from local storage
--- Object is used to rendered within popup
--- Add an edit icon beside each detail + save button at bottom of page
--- Once saved, display all recently scraped properties (details = {address}{bedrooms}{bathrooms}/summary elements = all details expanded)

- User clicks 'Cancel' button / invokes flow from invalid URL-> 
--- Displays list of any previously scraped properties
*/
