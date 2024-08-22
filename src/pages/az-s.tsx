import { arizonaScraper } from "@/server/direct-sites-scraping/integrity-arizona";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      const result = await arizonaScraper({
        checkIn: today,
        checkOut: twoDaysLater,
      }).catch((err) => {
        console.error(err);
      });
      //   setProperties(result);
    };

    void fetchProperties();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Property List</h1>
      {/* <ul>
          {properties.map((property) => (
            <li key={property.originalPropertyId}>
              <h2>{property.name}</h2>
              <p>{property.about}</p>
              <p>{property.address}</p>
              <p>Max Guests: {property.maxNumGuests}</p>
              <p>Rating: {property.avgRating} ({property.numRatings} reviews)</p>
              <img src={property.imageUrls[0]} alt={property.name} />
            </li>
          ))}
        </ul> */}
    </div>
  );
}
