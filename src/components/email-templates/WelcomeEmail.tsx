import {Img} from "@react-email/components";
  import { Layout, Header, Footer, SocialLinks, Info, BottomHr, CustomButton} from './emailcomponents'
  
  export function TramonaWelcomeEmail({
    name,
    url,
  }: {
    name: string | null;
    url: string;
  }) {
    return (
        <Layout title_preview="Welcome to Tramona">
        <Header title="Welcome to Tramona" />
        <div className="px-6">
            <Img src={"https://via.placeholder.com/600x300?text=Welcome+Image+Here&bg=cccccc"} alt="Placeholder Image" className="my-4"/>
        </div>
        <CustomButton link="https://www.tramona.com/" title="Book now"/>
        <BottomHr/>
        <SocialLinks />
        <Footer />
        <Info/>
      </Layout>
    );
}

