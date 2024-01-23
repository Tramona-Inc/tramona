import Image from 'next/image';
import React from 'react';

export default function TramonaLoop() {
	return (
		<section className='flex h-full flex-col items-center justify-center gap-10 bg-black p-20 py-10 text-center text-white'>
			<h1 className='text-4xl font-extrabold md:text-6xl'>The Tramona Loop</h1>
			<Image
				src={'/assets/images/landing-page-props/tramona-loop.png'}
				alt='tramona loop'
				width={1000}
				height={500}
				className='hidden md:inline'
			/>
			<Image
				src={'/assets/images/landing-page-props/tramona-loop-mobile.png'}
				alt='tramona loop'
				width={1000}
				height={500}
				className='md:hidden'
			/>
		</section>
	);
}