import React from 'react';
import Image from 'next/legacy/image';

export default function CurrentState() {
	return (
		<section className='relative h-full w-full bg-[#EC4899] py-20 text-white'>
			<div className='container flex flex-col space-y-10 p-20 text-5xl'>
				<p className='text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl'>
					The Current State of Travel
				</p>
				<h1 className='text-4xl font-extrabold sm:text-6xl lg:text-7xl'>
					3.2 MILLION VACANT AIRBNBS TONIGHT
				</h1>

				<div className='absolute -right-10 -top-[137px] h-[200px] w-[200px] md:-top-40 md:right-0 md:h-[250px] md:w-[250px] lg:-top-52 lg:h-[350px] lg:w-[350px]'>
					<Image
						src='/assets/images/landing-page-props/coin_money.png'
						layout='fill'
						objectFit='contain'
						alt='image dollar'
					/>
				</div>

				<div className='absolute bottom-0 right-10 h-[200px] w-[200px] md:h-[250px] md:w-[250px] lg:-bottom-0 lg:-right-[50px] lg:h-[350px] lg:w-[350px]'>
					<Image
						src='/assets/images/landing-page-props/plane_passport.png'
						layout='fill'
						objectFit='contain'
						alt='image dollar'
					/>
				</div>

				<div className='absolute -bottom-20 right-[300px] hidden h-[200px] w-[200px] md:h-[250px] md:w-[250px] lg:-bottom-20 lg:right-[200px] lg:h-[350px] lg:w-[350px] xl:inline'>
					<Image
						src='/assets/images/landing-page-props/plane_passport.png'
						layout='fill'
						objectFit='contain'
						alt='image dollar'
					/>
				</div>
			</div>
		</section>
	);
}