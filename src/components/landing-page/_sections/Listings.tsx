import Home from "@/pages";
import HomeOfferCard from "../HomeOfferCard";
import { api } from "@/utils/api";
import { Property } from "@/server/db/schema";
import Spinner from "@/components/_common/Spinner";
import { SP } from "next/dist/shared/lib/utils";
export default function Listings() {
  const { data: propertiesArray } = api.properties.getAll.useQuery();
  console.log(propertiesArray)

  const propertyCards = propertiesArray?.map((property:Property)=>(
   <HomeOfferCard property = {property} /> 
  ))


  return (
    <div>
      {propertyCards ? 
      <div className="grid grid-cols-1 gap-10 gap-y-10 md:grid-cols-6">

        {propertyCards}
      </div>
      
      
      :
      <Spinner/>
    }
    </div>
  );
}
