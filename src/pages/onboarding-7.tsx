import MainLayout from "@/components/_common/Layout/MainLayout";
import { Container } from "@react-email/components";

export default function Onboarding7() {
  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="font-bold text-3xl my-3" >Add some photos of your property</h1>
        <p className="text-slate-500">Choose at least 5 photos</p>
        <div className="my-5 w-full">
          <p>Drag your photos here or upload from device</p>
        </div>
      </Container>
    </MainLayout>
  )
}