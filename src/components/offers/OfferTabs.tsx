import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const OfferTabs = ({ offers, onSelectOffer, selectedOffer }) => {
  // const [activeOffer, setActiveOffer] = useState(null);

  // useEffect(() => {
  //   if (offers.length > 0) {
  //     // setSelectedOffer(offers[0]);
  //     onSelectOffer(offers[0]);
  //   }
  // }, []);

  // useEffect(() => {
  //   setActiveOffer(selectedOffer);
  //   console.log(selectedOffer);
  //   console.log("ksdajflksajdkfjlkasjdklfjklasdklfjla")
  // }, [selectedOffer]);

  const handleSelectOffer = (offer) => {
    // setSelectedOffer(offer);
    onSelectOffer(offer);
  };

  return (
      {offers.map((offer, i) => {
        const selected = selectedOffer?.id === offer.id
        return (
          <div
            key={offer.id}
            onClick={() => handleSelectOffer(offer)}
            style={{
              fontWeight: selected ? 'bold' : 'normal',
              color: selected ? 'inherit' : '#ccc', // Light color if not selected
              position: 'relative', // Add position relative to create a stacking context
              paddingBottom: '5px',
            }}
          >
            Offer {i + 1}
            {selected && (
              <div className='absolute left-0 right-0 bottom-0 h-[3px] bg-current' />
            )}
          </div>
        );
      })}
    </Tabs>
  );
};

export default OfferTabs;