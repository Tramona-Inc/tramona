import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";


const OfferTabs = ({ offers, onSelectOffer }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    if (offers.length > 0) {
      setSelectedOffer(offers[0]);
      onSelectOffer(offers[0]);
    }
  }, []);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    onSelectOffer(offer);
  };

  return (
    <div className='text-black flex space-x-4'>
      {offers.map((offer, i) => (
        <div
          key={offer.id}
          onClick={() => handleSelectOffer(offer)}
          style={{
            fontWeight: selectedOffer === offer ? 'bold' : 'normal',
            color: selectedOffer === offer ? 'inherit' : '#ccc', // Light color if not selected
            position: 'relative', // Add position relative to create a stacking context
            paddingBottom: '5px',
            // textDecoration: selectedOffer === offer ? 'underline' : 'none',
          }}
        >
          Offer {i+1}
          {selectedOffer === offer && (
            <div
              style={{
                position: 'absolute', // Position the underline absolutely
                left: 0,
                right: 0,
                bottom: 0, // Position it at the bottom
                height: '3px', // Adjust the height to make it thicker
                backgroundColor: 'currentColor', // Use the current text color for the underline
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default OfferTabs;