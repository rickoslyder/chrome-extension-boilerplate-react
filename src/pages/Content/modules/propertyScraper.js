// import React, { useState } from 'react';
import RightmoveScraper from '../../Popup/scrapers/RightmoveScraper';
import OnTheMarketScraper from '../../Popup/scrapers/OnTheMarketScraper';
import ZooplaScraper from '../../Popup/scrapers/ZooplaScraper';
import PropertyViewer from '../../Popup/propertyViewer';

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

// Create a React functional component for the property scraper that uses the above functions, Axios and Puppeteer to send the property object data back to our backend API (using a mock endpoint)
// const PropertyScraper = () => {
//   const [property, setProperty] = useState({});
//   const [loading, setLoading] = useState(false);

//   const scrapeProperty = () => {
//     setLoading(true);

//     const newProperty = getSite();

//     setProperty(newProperty);
//     setLoading(false);
//   };

//   return (
//     <div>
//       {/* {isPropertyListing() && (

//       )} */}
//       <button onClick={scrapeProperty}>Scrape Property</button>
//       {loading && <p>Loading...</p>}
//       {property && <PropertyViewer {...property} />}
//     </div>
//   );
// };

// export default PropertyScraper;
