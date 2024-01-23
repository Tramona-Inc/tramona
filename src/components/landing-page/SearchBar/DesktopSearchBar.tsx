// import type { NewRequest } from '../../lib/new-request-utils';
// import { getSuccessfulRequestToast, makeRequest } from '../../lib/new-request-utils';
// import { useUserInfo } from '../../../hooks/useUserInfo';
// import type { FormEvent } from 'react';
// import { useRef, useState } from 'react';

// // warning: this code is bad

// export default function DesktopSearchBar({
//   toast,
// }: {
//   toast: (props: { title: string; description: string }) => void;
// }) {
//   const locationInputRef = useRef<HTMLInputElement | null>(null);
//   const formRef = useRef<HTMLFormElement | null>(null);

//   const [location, setLocation] = useState('');
//   const [price, setPrice] = useState('');
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [guests, setGuests] = useState('');

//   const formIsEmpty = location === '' && price === '' && checkIn === '' && checkOut === '' && guests === '';

//   function clearForm() {
//     setLocation('');
//     setPrice('');
//     setCheckIn('');
//     setCheckOut('');
//     setGuests('');
//   }

//   const [user] = useUserInfo();
//   const isLoggedIn = user !== null;
//   const [formIsFocused, setFormIsFocused] = useState(false);
//   const isExpanded = formIsFocused || !formIsEmpty;

//   function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const userId = user?.id;

//     const newRequest: NewRequest = {
//       location,
//       price: parseInt(price.slice(1)),
//       checkIn: new Date(checkIn),
//       checkOut: new Date(checkOut),
//       numGuests: parseInt(guests),
//     };

//     if (isLoggedIn) {
//       // make the request
//       makeRequest(newRequest, userId!);
//       toast(getSuccessfulRequestToast(newRequest));

//       clearForm();
//       formRef.current?.blur();
//       setFormIsFocused(false); // not sure why i have to do this but i do
//     } else {
//       localStorage.setItem('unsentRequest', JSON.stringify(newRequest));
//       window.location.href = '/sign-up';
//     }
//   }

//   return (
//     <div className="grid place-items-center [&>*]:[grid-area:1/1]">
//       {/* expanded search bar */}
//       <form
//         ref={formRef}
//         onFocus={() => setFormIsFocused(true)}
//         onBlur={() => setFormIsFocused(false)}
//         onSubmit={handleFormSubmit}
//         className={`flex -space-x-10 rounded-full border border-black/5 bg-black/20 backdrop-blur-md transition-all duration-300 ${
//           isExpanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
//         }`}
//       >
//         <label className="group rounded-full px-12 py-4 focus-within:bg-white">
//           <p className="text-sm font-semibold tracking-wide text-white group-focus-within:text-black">Location</p>
//           <input
//             required
//             type="text"
//             value={location}
//             onChange={e => setLocation(e.target.value)}
//             ref={locationInputRef}
//             className="bg-transparent text-lg text-white placeholder:text-zinc-300 group-focus-within:text-zinc-600 group-focus-within:outline-none group-focus-within:placeholder:text-zinc-400"
//             placeholder="Enter your destination"
//           />
//         </label>
//         <label className="group rounded-full px-12 py-4 focus-within:bg-white">
//           <p className="text-sm font-semibold tracking-wide text-white group-focus-within:text-black">Your price</p>
//           <div className="flex w-40 items-baseline gap-2">
//             <input
//               required
//               type="text"
//               value={price}
//               onChange={e => {
//                 if (e.target.value === '') setPrice('');
//                 if (/^\$?[0-9]{0,5}$/.test(e.target.value)) {
//                   let newPrice = e.target.value;
//                   if (newPrice.startsWith('$')) {
//                     newPrice = newPrice.slice(1);
//                   }
//                   setPrice('$' + newPrice);
//                 }
//               }}
//               onBlur={e => {
//                 if (e.target.value === '$') setPrice('');
//               }}
//               className={`bg-transparent text-lg text-white placeholder:text-zinc-300 group-focus-within:text-zinc-600 group-focus-within:outline-none group-focus-within:placeholder:text-zinc-400 ${
//                 price === '' ? 'w-40' : 'w-16'
//               }`}
//               placeholder="Enter your budget"
//             />
//             {price.length > 1 && <p className="text-sm text-zinc-400">/night</p>}
//           </div>
//         </label>
//         <label className="group overflow-clip rounded-full px-12 py-4 focus-within:bg-white">
//           <p className="text-sm font-semibold tracking-wide text-white group-focus-within:text-black">Check in</p>
//           <div className="w-28 overflow-clip transition-all focus-within:w-40">
//             <input
//               required
//               value={checkIn}
//               onChange={e => setCheckIn(e.target.value)}
//               type="date"
//               className="bg-transparent text-lg text-white placeholder:text-zinc-300 group-focus-within:text-zinc-600 group-focus-within:outline-none group-focus-within:placeholder:text-zinc-400 [&::calendar-picker-indicator]:opacity-0"
//               placeholder="Add dates"
//             />
//           </div>
//         </label>
//         <label className="group overflow-clip rounded-full px-12 py-4 focus-within:bg-white">
//           <p className="text-sm font-semibold tracking-wide text-white group-focus-within:text-black">Check out</p>
//           <div className="w-28 overflow-clip transition-all focus-within:w-40">
//             <input
//               required
//               type="date"
//               value={checkOut}
//               onChange={e => setCheckOut(e.target.value)}
//               className="bg-transparent text-lg text-white placeholder:text-zinc-300 group-focus-within:text-zinc-600 group-focus-within:outline-none group-focus-within:placeholder:text-zinc-400 [&::calendar-picker-indicator]:opacity-0"
//               placeholder="Add dates"
//             />
//           </div>
//         </label>
//         <label className="group rounded-full py-4 pl-12 focus-within:bg-white">
//           <p className="text-sm font-semibold tracking-wide text-white group-focus-within:text-black">Guests</p>
//           <input
//             required
//             type="text"
//             value={guests}
//             onChange={e => {
//               if (/^[0-9]*$/.test(e.target.value)) {
//                 setGuests(e.target.value);
//               }
//             }}
//             className="bg-transparent text-lg text-white placeholder:text-zinc-300 group-focus-within:text-zinc-600 group-focus-within:outline-none group-focus-within:placeholder:text-zinc-400"
//             placeholder="Number of guests"
//           />
//         </label>
//         <div className="p-3 pl-12">
//           <button
//             type="submit"
//             className="h-full whitespace-nowrap rounded-full bg-white px-8 py-3 font-semibold text-black"
//           >
//             Request Deal
//           </button>
//         </div>
//       </form>

//       {/* not expanded */}
//       <button
//         className={`flex cursor-pointer items-center gap-4 rounded-full border border-black/5 bg-black/20 p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/50 ${
//           isExpanded ? 'pointer-events-none scale-110 opacity-0' : 'scale-100 opacity-100'
//         }`}
//         onClick={() => locationInputRef?.current?.focus()}
//       >
//         <div className="p-2 pl-4">
//           Your Price <span className="p-1 opacity-40">&ndash;</span> Your Choice{' '}
//           <span className="p-1 opacity-40">&ndash;</span> Your Vacation
//         </div>
//         <div className="inline-flex items-center whitespace-nowrap rounded-full bg-white px-8 py-3 font-semibold text-black">
//           Request Deal
//         </div>
//       </button>
//     </div>
//   );
// }