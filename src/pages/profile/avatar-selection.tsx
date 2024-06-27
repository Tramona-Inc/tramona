import MainLayout from '@/components/_common/Layout/MainLayout';
import  ProfilePicSelection  from '@/components/profile/profile-pic-selection-v7';
import ProfilePicSelectionMobile from '@/components/profile/nextjs-mobile-profile-pic-v3'
import { useMediaQuery } from '@/components/_utils/useMediaQuery';

export default function AvatarSelection() {
    const isMobile = useMediaQuery("(max-width: 640px)")
    return(
    <MainLayout>
        {!isMobile ? 
        <ProfilePicSelection /> :
        <ProfilePicSelectionMobile />
    }
    </MainLayout>
    );
}