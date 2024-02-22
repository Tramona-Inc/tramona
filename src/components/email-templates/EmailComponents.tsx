import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Hr,
    Img
  } from "@react-email/components";

  import UserAvatar from "@/components/_common/UserAvatar";
  
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: ReactNode;
  title_preview: string; 
}

interface HeaderProps {
    title: string;
}

interface ButtonProps {
    title: string;
    link: string; 
}

interface EmailOfferCardProps {
    originalPrice?: number;
    tramonaPrice?: number;
    description?: string;
    image_link?: string; 
  }

  function TramonaLogo() {
    return (
        <div className="flex items-center gap-2 text-lg font-bold text-brand">
            <img src="https://www.tramona.com/assets/images/tramona-logo.jpeg" alt="Tramona Logo" style={{ width: 'auto', height: '30px' }} />
            Tramona
        </div>
    );
}

export const Layout: React.FC<LayoutProps> = ({ children, title_preview }) => {
    return (
        <Html>
            <Preview className="text-brand">{title_preview}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#000000",
                                offwhite: "#fafbfb",
                                grey: "#4D4D4D", 
                                lightgrey:"#F9F9F9",
                            },
                            spacing: {
                                0: "0px",
                                20: "20px",
                                45: "45px",
                            },
                        },
                    },
                }}
            >
            <Head />
            <Body className="text-base font-sans" style={{ backgroundColor: 'white'}}>
                <Container className="bg-white p-45 my-8" style={{ backgroundColor: 'white' }}>
                    {children}
                </Container>
            </Body>
            </Tailwind>
        </Html>
    );
};


export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <>
        <div className="mt-4 ml-6"><TramonaLogo/></div>
        <div className="inline-flex items-center justify-center w-full">
            <Hr className="w-11/12 h-px bg-gray-400 border-0 "/>
        </div>
        <Heading className="text-left my-0 leading-8 text-lg ml-6 mt-4">
            <strong className="text-brand">{title}</strong>
        </Heading>
        </>
    );
    };

export const BottomHr = () => {
    return(
    <div className="inline-flex items-center justify-center w-full">
        <Hr className="w-11/12 h-px bg-gray-400 border-0  mt-8"/>
      </div>
  ); 
}

export const Info =() => {
    return(
        <>
        <Text className="text-center text-xs text-brand font-light">
            Update your email preferences to choose which emails you get or unsubscribe from this type of email.
        </Text><Row>
                <Column className="text-center px-20">
                    <Link className="text-grey text-xs mr-2">Unsubscribe</Link>
                    <Link className="text-grey text-xs underline">View in the browser</Link>
                </Column>
            </Row>
        </>
    ); 
}

export const CustomButton: React.FC<ButtonProps> = ({title, link}) => {
    return(
        <Section className="text-center">
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand text-white text-base font-semibold rounded-full py-3 w-11/12 mx-auto">
              {title}
        </a>
        </Section>
    ); 
}

export const Footer = () =>  {
    return (
        <Row>
        <Column className="mt-2 mb-0">
            <Text className="text-left text-xs text-black ml-6 mb-0">
            Tramona
            </Text>
            <Text className="text-left text-xs text-black ml-6 mt-0">
            2314 236th AVE NE Sammamish WA 98074
            </Text>
        </Column>
        </Row>
    );
    };

    export const SocialLinks: React.FC = () => {
        return (
            <>
            <style>
                {`
                @media (prefers-color-scheme: dark) {
                    .light-mode-icons {
                        display: none;
                    }
                    .dark-mode-icons {
                        display: block;
                    }
                }
                `}
            </style>
            <div className="mt-4 px-6">
    <table width="100%">
        <tr>
            <td style={{ textAlign: 'left' }}>
                <a href="https://www.tramona.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://myspaceaccount.s3.us-east-2.amazonaws.com/logo+(1).png" alt="Tramona Logo" style={{ height: '20px' }} />
                </a>
            </td>
            <td style={{ textAlign: 'right' }}>
                <div className="light-mode-icons">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <img src="https://myspaceaccount.s3.us-east-2.amazonaws.com/facebook+(2).png" alt="Facebook" style={{ width: '16px', height: '16px', marginRight: '10px' }} />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src="https://myspaceaccount.s3.us-east-2.amazonaws.com/instagram.png" alt="Instagram" style={{ width: '16px', height: '16px' }} />
                    </a>
                </div>

                <div className="dark-mode-icons" style={{display: "none"}}>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <img src="https://myspaceaccount.s3.us-east-2.amazonaws.com/dark_mode_facebook_icon.png" alt="Facebook" style={{ width: '16px', height: '16px', marginRight: '10px' }} />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src="https://myspaceaccount.s3.us-east-2.amazonaws.com/dark_mode_instagram_icon.pngg" alt="Instagram" style={{ width: '16px', height: '16px' }} />
                    </a>
                </div>
            </td>
        </tr>
    </table>
</div>
            </>
        );
    };
      

export const EmailOfferCard: React.FC<EmailOfferCardProps> = ({ originalPrice, tramonaPrice, description, image_link}) => {
    let discountPercentage = 0; 
    if(tramonaPrice){
         discountPercentage = originalPrice ? Math.round(((originalPrice - tramonaPrice) / originalPrice) * 100) : 0;
    }

    return(
        <div className="px-6 py-6 mb-4 bg-lightgrey">
            <Card className="w-[350px] lg:w-[500px] md:w-[450px] shadow-none space-y-0 p-0 overflow-hidden">
            <CardHeader className="w-full">
        <Img src={image_link} alt="Offer Image" className="w-full" />
      </CardHeader>
      <div className="text-sm font-semibold p-4">{description}</div>
      <CardContent>
        <div className="mx-2 mb-1 mt-4 flex items-center justify-between p-4">
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold line-through lg:text-3xl">
              ${originalPrice}
            </p>
            <p className="text-sm tracking-tight">Airbnb price</p>
          </div>
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold text-brand lg:text-3xl">
              ${tramonaPrice}
            </p>
            <p className="text-sm tracking-tight">Our price</p>
          </div>
          <div className="bg-brand px-4 py-2 text-zinc-50 lg:px-5 lg:py-3">
            <p className="text-lg font-semibold lg:text-xl">
              {discountPercentage}%
              OFF
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
</div>
    )
}; 

interface EmailConfirmationCardProps {
    hostName?: string;
    hostImageUrl?: string;
    startDate?: string;
    endDate?: string;
    address?: string;
  }
  
export const EmailConfirmationCard: React.FC<EmailConfirmationCardProps> = ({
    hostName,
    hostImageUrl,
    startDate,
    endDate,
    address,
  }) => {
    return (
      <table style={{ width: '100%', border: '0', borderSpacing: '0', borderCollapse: 'collapse' }}>
        <tr>
          <td style={{ width: '50%', padding: '10px', backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#000000' }}>
              Tropical getaway in Mexico
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img src={hostImageUrl || "https://via.placeholder.com/150"} alt="Host" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
              <div>
                <p style={{ color: '#606060', marginBottom: '5px' }}>Hosted by {hostName}</p>
                <p style={{ color: '#909090', fontSize: '14px' }}>+1 234 567 8901</p>
              </div>
            </div>
            <hr style={{ width: '100%', color: '#d3d3d3', border: '0', borderBottom: '1px solid #d3d3d3' }} />
            <p style={{ color: '#707070' }}>{startDate} - {endDate}</p>
            <p style={{ color: '#707070' }}>{address}</p>
          </td>
          <td style={{ width: '50%' }}>
            <img src={hostImageUrl || "https://via.placeholder.com/150"} alt="Property" style={{ width: '100%', height: 'auto' }} />
          </td>
        </tr>
      </table>
    );
  };
  