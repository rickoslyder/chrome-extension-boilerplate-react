const ZooplaScraper = () => {
  const zooplaData = document.querySelector('#__NEXT_DATA__');
  const json = JSON.parse(zooplaData);
  const props = json.props.pageProps;
  const listingDetails = props.listingDetails;
  const branch = listingDetails.branch;
  // const embeddedContent = listingDetails.embeddedContent;
  const epc = listingDetails.epc;
  const counts = listingDetails.counts;
  // const location = listingDetails.location;
  // const detailedDescription = listingDetails.detailedDescription;
  const features = listingDetails.features;
  const floorPlan = listingDetails.floorPlan;
  // const propertyImage = listingDetails.propertyImage;
  // const title = listingDetails.title;
  const listingUris = listingDetails.listingUris;
  const displayAddress = listingDetails.displayAddress;
  const floorArea = listingDetails.floorArea;
  const pricing = listingDetails.pricing;
  // const councilTaxBand = listingDetails.councilTaxBand;
  // const groundRent = listingDetails.groundRent;
  // const deposit = listingDetails.deposit;
  const propertyType = listingDetails.propertyType;

  let zooplaProperty = {};

  zooplaProperty.propertyAddress = displayAddress;
  zooplaProperty.details = `${counts.numBedrooms} bedroom, ${counts.numBathrooms} bathroom, ${counts.numLivingRooms} living room, ${propertyType}`;
  zooplaProperty.cost = `${pricing.label}`;
  zooplaProperty.furnished = features.flags.furnishedState.label;
  zooplaProperty.agency = `${branch.name}, ${branch.address}, ${branch.phone}`;
  zooplaProperty.propertyURL = listingUris.detail;
  zooplaProperty.size = floorArea;
  zooplaProperty.availableFrom = features.flags.availableFromDate;
  zooplaProperty.floorplan = floorPlan.image[0].filename;
  zooplaProperty.epc = epc.image[0].filename;

  return zooplaProperty;
};

export default ZooplaScraper;
