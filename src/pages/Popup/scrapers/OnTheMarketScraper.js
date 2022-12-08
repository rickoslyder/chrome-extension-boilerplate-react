import React from "react";

const OnTheMarketScraper = () => {
  const dataObj = window.__OTM__.jsonData;
  const OnTheMarketProperty = {
    propertyAddress: `${dataObj.header_data.address} ${dataObj.header_data.addressline_2}`,
    details: `${dataObj.bedrooms} bedroom ${dataObj.humanised_property_type}`,
    cost: `£${dataObj.header_data.price} pcm (£${Math.round(
      dataObj.header_data.price / 4.33
    )} pw)`,
    furnished: dataObj.letting_details.items.includes("Furnished")
      ? "Yes"
      : "No",
    agency: dataObj.agent.name,
    propertyURL: dataObj.canonical_url,
    size: `${dataObj.minimum_area}`,
    availableFrom: dataObj.start_date_values[0].name,
    floorplan: dataObj.floorplans[0].large_url,
    epc: dataObj.epc_url,
  };
  return OnTheMarketProperty;
};

export default OnTheMarketScraper;
