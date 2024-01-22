import Image from 'next/legacy/image';
import React from 'react';

export default function How() {
	return (
		<section className='container flex h-full flex-col-reverse items-center justify-center gap-10 py-20 lg:flex-row'>
			<div className='relative aspect-square h-[350px] w-auto md:h-[500px]'>
				<Image
					src='https://archziner.com/wp-content/uploads/2021/06/aerial-view-of-plane-landing-in-the-clear-turquoise-water-on-white-sandy-beach-next-to-house-with-palm-trees-beach-background-images.jpg'
					alt='beach'
					className='rounded-lg shadow-lg'
					layout='fill'
					objectFit='cover'
				/>
			</div>

			<div className='flex flex-col items-center space-y-5 text-center lg:items-end lg:text-end'>
				<div className='font-bold uppercase text-5xl xl:text-7xl'>
					how it works
				</div>
				<div className='text-lg font-bold lg:text-2xl xl:text-3xl'>
					<span className='max-w-md rounded bg-[#EDFF1D] px-2 '>
						YOU TELL US A PRICE
					</span>{' '}
					you want to travel for and we match you with a host who wants to
					accept your price!
				</div>

				<div className=' px-2 text-2xl'>🥳 Yes it&apos;s that simple</div>
			</div>
		</section>
	);
}