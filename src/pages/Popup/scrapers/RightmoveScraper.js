import React from "react";

const RightmoveScraper = () => {
  const data = window.PAGE_MODEL.propertyData;
  return {
    propertyAddress: `${data.address.displayAddress}`,
    details: `${data.text.propertyPhrase}`,
    cost: `${data.prices.primaryPrice}`,
    furnished: `${data.keyFeatures[4]}`,
    agency: `${data.customer.branchDisplayName}`,
    propertyURL: `${window.location.href}`,
    size: `${data.rooms[0].dimension}`,
    availableFrom: `${data.lettings.letAvailableDate}`,
    floorplan: `${data.floorplans[0].url}`,
    epc: `${data.epcGraphs[0].url}`,
  };
};

export default RightmoveScraper;
