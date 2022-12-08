// import { useState } from 'react';
import React from 'react';

const PropertyViewer = (property) => {
  //   const [property, setProperty] = useState({});

  //   setProperty(data);
  return (
    <div id="property-viewer" className="most-recent">
      <p>Address: {property.address}</p>
      <p>Details: {property.details}</p>
      <p>Cost: {property.cost}</p>
      <p>Furnished: {property.furnished}</p>
      <p>Agency: {property.agency}</p>
      <p>URL: {property.url}</p>
      <p>Size: {property.size}</p>
      <p>Available: {property.available}</p>
      <p>Floorplan: {property.floorplan}</p>
      <p>EPC: {property.epc}</p>
    </div>
  );
};

export default PropertyViewer;
