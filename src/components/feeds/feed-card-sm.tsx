import React from 'react';
import type { OfferType } from '@/types';

type Props = {
  offer: OfferType;
};

export default function FeedCardSm({ offer }: Props) {
  return (
    <div className="flex flex-row items-center justify-center gap-5 rounded-xl bg-white p-2">
      {/* Avatar */}
      {/* <div className='flex items-center justify-center'>
				<Link href='/general-profile'>
					<Avatar>
						<AvatarImage src='' />
						<AvatarFallback>
							{offer.hostName
								.split(' ')
								.map((word) => word[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
				</Link>
			</div> */}

      {/* Middle */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-lg font-bold">{offer.propertyName}</h1>
        <div className="flex flex-col text-center ">
          <p className="text-xs xl:text-sm">
            Tramona: <span className="text-sm font-bold text-blue-700">${offer.price}/per night</span>
          </p>
          <p className="text-xs line-through xl:text-sm">Old Price: ${offer.originalPrice} </p>
        </div>
      </div>

      {/* Right */}
      {/* <h3 className='text-xs text-[#192185]'>24 min</h3> */}
    </div>
  );
}
