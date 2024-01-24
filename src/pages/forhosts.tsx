// pages/for-hosts.tsx
import Modals from "@/components/forhosts/Modal";
import Head from "next/head";

export default function ForHosts() {
  const options = [0, 1];
  return (
    <>
      <Head>
        <title>Tramona</title>
      </Head>
      <div className="flex flex-col bg-[url('https://i.pinimg.com/564x/29/05/b6/2905b6ce1a2064dc4e4513f193750024.jpg')]">
        {/* <h1>For Hosts</h1>
      <p>Welcome to our "For Hosts" page! If you are a host looking to maximize your property's potential for short-duration stays, you've come to the right place.</p>

      <h2>How We Can Help</h2>
      <p>Our platform is dedicated to bringing travelers and hosts together. We simplify the process of connecting travelers who are ready to book with hosts who can provide unique and memorable stays.</p>

      <h2>Why Choose Our Platform</h2>
      <p>When you host with us, you join a community of hosts and travelers who value convenience and a seamless booking experience. Here's how we can benefit you:</p>
      <ul>
        <li>Effortless Connectivity: We bridge the gap between travelers seeking accommodations and hosts offering exceptional stays.</li>
        <li>Increased Exposure: Your property gets visibility to a broad audience of potential guests, helping you fill vacancies more effectively.</li>
        <li>Support and Resources: Gain access to helpful resources and tools to enhance your hosting experience.</li>
        <li>Streamlined Booking: We take care of the booking process, leaving you more time to focus on providing a memorable stay for your guests.</li>
      </ul>

      <p>Our commitment is to make hosting a hassle-free and rewarding experience. Join our platform today and see the difference it can make for your short-duration stays.</p>
      <Link href="/">Back to Home</Link> */}
        <div className="flex h-80 flex-row">
          <div className="my-8 basis-1/2">
            <p className="mx-12 my-2 text-4xl font-bold text-white">
              {" "}
              Increasing Revenue and Decreasing Vacancies For Short Term Rentals{" "}
            </p>
            <div className="mx-12 my-8 flex flex-col justify-start">
              <p className="text-left text-white">
                Our platform connects travelers ready to book with hosts,
                streamlining the booking process for seamless transactions and
                maximizing revenue for property owners.
              </p>
            </div>
          </div>
        </div>
        <Modals options={options} />
      </div>
    </>
  );
}
