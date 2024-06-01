import React from 'react';
import { Text, Button } from '@react-email/components';
import { Layout } from './EmailComponents';

interface ReservationConfirmedEmailProps {
  userName: string;
  property: string;
  hostName: string;
  nights: number;
  adults: number;
  checkInDateTime: Date;
  checkOutDateTime: Date;
  originalPrice: number;
  tramonaPrice: number;
  serviceFee: number;
  totalPrice: number;
  daysToGo: number;
}

export default function ReservationConfirmedEmail({
  userName = 'John Doe',
  property = 'New Beach house with Sandy Backyard Fire Ring',
  hostName = 'Pam',
  nights = 5,
  adults = 2,
  checkInDateTime = new Date('2024-04-25T16:00:00'),
  checkOutDateTime = new Date('2024-04-30T12:00:00'),
  originalPrice = 200,
  tramonaPrice = 150,
  serviceFee = 20,
  totalPrice = 20,
  daysToGo = 7,
}: ReservationConfirmedEmailProps) {
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <Layout title_preview="Reservation Confirmed">
      <div className="p-6 bg-white border-b border-gray-300">
        <Text className="text-3xl font-bold mb-4">Your reservation is confirmed</Text>
        <Text className="text-left mb-4">
          Hello, {userName}. Your booking to <span className="text-black-600 underline">{property}</span> has been confirmed. Congrats and enjoy!
        </Text>
        <table className="mb-8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tr>
            <td style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tr>
                <td style={{ padding: 0, background: 'url(https://via.placeholder.com/600x300?text=Property+Image+Here&bg=cccccc)', backgroundSize: 'cover', borderRadius: '8px' }}>
                    <table style={{ width: '100%', height: '300px', color: 'white', textAlign: 'left', borderRadius: '8px' }}>
                    <tr>
                        <td style={{ padding: '16px' }}>
                        <p style={{ margin: 0, marginTop: '35%' , fontSize: '14px' }}>The countdown to your trip begins</p>
                        <p style={{ margin: 0, fontSize: '24px' }}>{daysToGo} days to go</p>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
        <Text className="text-2xl font-bold mb-4">Property Name/Title</Text>
        <div style={{ display: 'table', width: '100%', marginBottom: '16px' }}>
          <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '10%', paddingRight: '8px' }}>
            <img
              src="https://via.placeholder.com/600x300?text=Profile+Picture+Here&bg=cccccc"
              alt="Host"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '20%' }}>
            <Text className="text-sm text-left m-0">Hosted by</Text>
            <Text className="text-lg m-0 font-bold">{hostName}</Text>
          </div>
          <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'right', width: '70%' }}>
            <a href="#" className="bg-gray-200 text-black py-2 px-4 rounded-md" style={{ textDecoration: 'none', marginRight: '8px' }}>Message your host</a>
          </div>
        </div>
        <div className="my-4 mx-auto w-full" style={{ borderBottom: '2px solid #e0e0e0' }}></div>
        <div>
          <div style={{ textAlign: 'left', float: 'left' }}>
            <Text className="text-xl font-bold m-0">Your trip</Text>
            <Text className="text-left font-bold mt-0">{nights} nights • {adults} Adults</Text>
          </div>
          <div style={{ textAlign: 'right', float: 'right' }}>
            <Text className="text-green-600 text-sm p-2" style={{ border: '1px solid #F2F1EF', borderRadius: '20px'}}>Booking confirmed</Text>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>
        <div className="mb-4" style={{ display: 'table', width: '100%' }}>
          <div style={{ display: 'table-cell', textAlign: 'left', width: '50%' }}>
            <Text className="text-sm font-bold m-0">Check-in</Text>
            <Text className="text-lg font-bold m-0">{formatDate(checkInDateTime)}</Text>
            <Text className="text-sm font-bold mt-0">{formatTime(checkInDateTime)}</Text>
          </div>
          <div style={{ display: 'table-cell', textAlign: 'center', width: '1%', verticalAlign: 'middle' }}>
            <Text className="text-xl font-bold">→</Text>
          </div>
          <div style={{ display: 'table-cell', textAlign: 'right', width: '50%' }}>
            <Text className="text-sm font-bold m-0">Check-out</Text>
            <Text className="text-lg font-bold m-0">{formatDate(checkOutDateTime)}</Text>
            <Text className="text-sm font-bold mt-0">{formatTime(checkOutDateTime)}</Text>
          </div>
        </div>
        <Button
          href="https://www.tramona.com/my-trips"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-6 w-11/12 mx-auto"
        >
          View trip details
        </Button>
        <div>
            <div style={{ textAlign: 'left', float: 'left' }}>
                <Text className="text-sm"><b>Original price</b> x {nights} nights</Text>
            </div>
            <div style={{ textAlign: 'right', float: 'right' }}>
                <Text className="text-sm">${originalPrice}</Text>
            </div>
            <div style={{ clear: 'both' }}></div>
        </div>
        <div>
            <div style={{ textAlign: 'left', float: 'left' }}>
                <Text className="text-sm"><b>Tramona’s price</b> x {nights} nights</Text>
            </div>
            <div style={{ textAlign: 'right', float: 'right' }}>
                <Text className="text-sm">${tramonaPrice}</Text>
            </div>
            <div style={{ clear: 'both' }}></div>
        </div>
        <div>
            <div style={{ textAlign: 'left', float: 'left' }}>
                <Text className="text-sm"><b>Service Fee</b></Text>
            </div>
            <div style={{ textAlign: 'right', float: 'right' }}>
                <Text className="text-sm">${serviceFee}</Text>
            </div>
            <div style={{ clear: 'both' }}></div>
        </div>
        <div className="my-4 mx-auto w-full" style={{ borderBottom: '2px solid #e0e0e0' }}></div>
        <div>
            <div style={{ textAlign: 'left', float: 'left' }}>
                <Text className="text-lg font-bold">Total (USD)</Text>
            </div>
            <div style={{ textAlign: 'right', float: 'right' }}>
                <Text className="text-lg font-bold">${totalPrice}</Text>
            </div>
            <div style={{ clear: 'both' }}></div>
        </div>
      </div>
    </Layout>
  );
}
