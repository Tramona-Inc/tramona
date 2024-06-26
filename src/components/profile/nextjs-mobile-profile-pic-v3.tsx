import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'

const profilePics = [
  '/assets/images/profile-avatars/Avatar_2.png',
  '/assets/images/profile-avatars/Avatar_3.png',
  '/assets/images/profile-avatars/Avatar_4.png',
  '/assets/images/profile-avatars/Avatar_5.png',
  '/assets/images/profile-avatars/Avatar_6.png',
  '/assets/images/profile-avatars/Avatar_7.png',
  '/assets/images/profile-avatars/Avatar_8.png',
  '/assets/images/profile-avatars/Avatar_9.png',
  '/assets/images/profile-avatars/Avatar_10.png',
  '/assets/images/profile-avatars/Avatar_11.png',
];

const ProfilePicSelectionMobile: React.FC = () => {
  const [selectedPic, setSelectedPic] = useState(0);
  const router = useRouter();

  const handleOnClick = (selectedPic: number) => {
    console.log('Selected avatar:', selectedPic)
    void router.push("/auth/signin");
  }

  const nextPic = () => setSelectedPic((prev) => (prev + 1) % profilePics.length);
  const prevPic = () => setSelectedPic((prev) => (prev - 1 + profilePics.length) % profilePics.length);

  return (
    <div className="max-w-sm mx-auto p-4 bg-gradient-to-b from-blue-50 to-white flex flex-col min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Choose an avatar</h1>
      <p className="text-sm text-gray-600 mb-4">This will be your profile picture</p>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-6">
          <Image 
            src={profilePics[selectedPic] ?? ""}
            alt={`Avatar ${selectedPic + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-full shadow-lg border-4 border-white"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-md px-3 py-1">
            <p className="text-sm font-medium text-gray-700">Avatar {selectedPic + 1} of {profilePics.length}</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button onClick={prevPic} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextPic} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="w-full space-y-3">
          <button
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            onClick={() => handleOnClick(selectedPic)}
          >
            Confirm
          </button>
          <button className="w-full bg-white text-blue-500 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicSelectionMobile;
