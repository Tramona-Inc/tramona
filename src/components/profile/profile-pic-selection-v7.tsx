import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import {useSession} from 'next-auth/react';
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

const ProfilePicSelection: React.FC = () => {
  const [selectedPic, setSelectedPic] = useState<number | null>(null);
  const [hoverPic, setHoverPic] = useState<number | null>(null);
  const router = useRouter()
  const {data: session} = useSession();
  const {mutateAsync: addAvatar} = api.users.insertAvatar.useMutation({
    onSuccess: () => {
      console.log("avatar inserted");
    },
    onError: () => {
      console.log("something went wrong ")
    }
  });

  const handleOnClick = async (selectedPic: number) => {
    console.log('Selected avatar:', profilePics[selectedPic])
    await addAvatar({userId: session?.user.id ?? "", avatar: profilePics[selectedPic] ?? "",})
    localStorage.removeItem("userId");
    void router.push("/auth/signin");
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-10 bg-white shadow-lg rounded-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Choose an avatar to be your profile picture</h1>
        <p className="text-gray-600">This avatar will be visible to people in the feed and in your profile</p>
      </div>
      
      <div className="grid grid-cols-5 gap-6 mb-10">
        {profilePics.map((pic, index) => (
          <button
            key={index}
            className={`relative aspect-square rounded-full overflow-hidden focus:outline-none transition duration-200 transform ${
              selectedPic === index 
                ? 'ring-4 ring-indigo-500 shadow-lg scale-105' 
                : hoverPic === index 
                  ? 'shadow-md scale-105' 
                  : 'hover:shadow-md hover:scale-105'
            }`}
            onClick={() => setSelectedPic(index)}
            onMouseEnter={() => setHoverPic(index)}
            onMouseLeave={() => setHoverPic(null)}
          >
            <Image
              src={pic}
              alt={`Avatar ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
            {selectedPic === index && (
              <div className="absolute inset-0 bg-indigo-500 bg-opacity-40 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <button className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200">
          Skip this step
        </button>
        <div className="flex items-center space-x-4">
          <button
            className="bg-white text-indigo-600 border border-indigo-600 py-2 px-6 rounded text-lg font-semibold hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
            onClick={() => setSelectedPic(null)}
          >
            Reset
          </button>
          <button
            className="bg-indigo-600 text-white py-2 px-6 rounded text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleOnClick(selectedPic ?? 0)}
            disabled={selectedPic === null}
          >
            Confirm Selection
          </button>
        </div>
      </div>

      {selectedPic !== null && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src={profilePics[selectedPic] ?? ""}
              alt="Selected Avatar"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Selected Avatar: Option {selectedPic + 1}</p>
            <p className="text-gray-600 text-sm">This avatar will represent you across our platform.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicSelection;
