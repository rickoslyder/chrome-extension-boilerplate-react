const OnTheMarketScraper = async (windowObject: Window | any) => {
  console.log(windowObject);
  const dataObj = await windowObject.__OTM__.jsonData;
  dataObj['header-data']['data-layer'] = await JSON.parse(
    dataObj['header-data']['data-layer']
  );
  console.log('dataObj - ', dataObj);
  console.log('header data - ', dataObj['header-data']);
  console.log('data layer ', dataObj['header-data']['data-layer']);
  const datalayer = dataObj['header-data']['data-layer'];
  const OnTheMarketProperty = {
    propertyAddress: `${datalayer.address ? `${datalayer.address}, ` : ''}${
      datalayer.addressline_2
    }, ${datalayer.postcode}`,
    details: `${dataObj.bedrooms} bedroom ${dataObj['humanised-property-type']}`,
    cost: `£${datalayer.price} pcm (£${Math.round(
      parseInt(`${datalayer.price}`.replace(',', '')) / 4.33
    )} pw)`,
    furnished: Array.from(dataObj['letting-details']['items']).includes(
      'Furnished'
    )
      ? 'Yes'
      : 'No',
    agency: dataObj.agent.name,
    propertyURL: dataObj['canonical-url'],
    size: `${dataObj['minimum-area']}`,
    availableFrom: dataObj['start-date-values'][0].name,
    floorplan: dataObj['floorplans?']
      ? dataObj.floorplans[0]['large-url']
      : 'n/a',
    epc:
      (dataObj['epc-url'] ? dataObj['epc-url'] : dataObj?.epc?.rating) || 'N/A',
  };
  console.log('Final details - ', OnTheMarketProperty);
  return OnTheMarketProperty;
};

export default OnTheMarketScraper;
