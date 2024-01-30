import React from 'react';
import Image from 'next/legacy/image';

export default function Jungle() {
	return (
		<section className='relative h-[45vh]'>
			<Image
				src='/assets/images/landing-page-props/jungle swing.jpg'
				alt='jungle swing'
				className='absolute'
				objectFit='cover'
				layout='fill'
				priority
			/>
		</section>
	);
}