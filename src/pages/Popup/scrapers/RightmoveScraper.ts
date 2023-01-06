const RightmoveScraper = async (windowObject: Window | any) => {
  const data = await windowObject.PAGE_MODEL.propertyData;
  return {
    propertyAddress: `${data.address.displayAddress}`,
    details: `${data.text.propertyPhrase}`,
    cost: `${data.prices.primaryPrice}`,
    furnished: `${data.keyFeatures[4]}`,
    agency: `${data.customer.branchDisplayName}`,
    propertyURL: `${windowObject!.location.href}`,
    size: `${data?.rooms[0]?.dimension ? data.rooms[0].dimension : 'n/a'}`,
    availableFrom: `${data.lettings.letAvailableDate}`,
    floorplan: data?.floorplans ? `${data.floorplans[0].url}` : 'n/a',
    epc: data?.epcGraphs ? `${data.epcGraphs[0].url}` : 'n/a',
  };
};

export default RightmoveScraper;
