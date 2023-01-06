import { ListingNoUser } from '../../../../lib/database.types';
import formatDate from '../utils/formatDate';

const ZooplaScraper = async (windowObject: Window | any, src: string) => {
  console.log('Zoopla window object - ', windowObject);
  if (src === 'inject') {
    const zooplaData =
      windowObject?.document?.querySelector('#__NEXT_DATA__')?.innerHTML;
    const {
      props: {
        pageProps: {
          listingDetails: {
            branch,
            detailedDescription,
            propertyImage,
            epc,
            counts,
            features,
            floorPlan,
            listingUris,
            displayAddress,
            floorArea,
            pricing,
            deposit,
            propertyType,
          },
        },
      },
    } = JSON.parse(zooplaData);

    const zooplaProperty: ListingNoUser = {
      property_address: displayAddress,
      description: detailedDescription,
      property_images: propertyImage.map(
        (image: any) => `https://lid.zoocdn.com/u/2400/1800/${image.filename}`
      ),
      details: `${counts.numBedrooms} bedroom, ${counts.numBathrooms} bathroom, ${counts.numLivingRooms} living room, ${propertyType}`,
      cost: `${pricing.label}`,
      deposit: `${deposit?.label ? deposit.label : 'n/a'}`,
      furnished: features.flags.furnishedState.label,
      agency_name: `${branch.name}`,
      agency_address: `${branch.address} ${branch.postcode}`,
      agency_number: `${branch.phone}`,
      property_url: `https://www.zoopla.co.uk${listingUris.detail}`,
      size: `${floorArea?.label ? floorArea.label : 'n/a'}`,
      available: formatDate(features.flags.availableFromDate) as string,
      floorplan: floorPlan?.image
        ? `https://lid.zoocdn.com/u/2400/1800/${floorPlan.image[0].filename}`
        : 'n/a',
      epc: epc?.image
        ? `https://lid.zoocdn.com/u/2400/1800/${epc.image[0].filename}`
        : 'n/a',
    };

    return zooplaProperty;
  }
};

export default ZooplaScraper;
