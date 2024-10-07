// tramona-specific constants
export const TAX_PERCENTAGE = 0.08 as number;
export const SUPERHOG_FEE = 3 as number;
export const AVG_AIRBNB_MARKUP = 1.13868 as number;
export const LINK_REQUEST_DISCOUNT_PERCENTAGE = 15 as number;
export const TRAVELER__MARKUP = 1.025;
export const HOST_MARKUP = 0.975;
export const DIRECTLISTINGMARKUP = 1.015; // 1.5% markup for direct listings
export const REFERRAL_CASHBACK = 2500 as number;

export const airbnbHeaders = {
  "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
};

// generic constants
export const EARTH_RADIUS_MILES = 3959;
export const METERS_PER_MILE = 1609.34;
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const forHostsAccordionItems = [
  {
    question: "Can I counter offer requests?",
    answer:
      "Yes! You have full control over pricing. If a traveler submits a request, you can respond with an offer that fits your availability and pricing preferences.",
  },
  {
    question: "Can I invite a co-host?",
    answer:
      "Yes, Tramona supports co-hosting. You can add a co-host to help manage bookings, respond to traveler inquiries, and coordinate check-ins. They’ll have access to the necessary tools without needing full access to your account.",
  },
  {
    question: "Why list on Tramona?",
    answer:
      "Tramona helps you optimize occupancy and revenue by offering more flexibility. Just like how Priceline allowed hotels to offload unbooked rooms without lowering rates across the board, Tramona allows you to keep your listings at full price on other platforms while accepting offers for lower rates only when you choose. We also take lower fees than platforms like Airbnb and VRBO, meaning you can earn more while giving travelers better deals.",
  },
  {
    question: "Can I sync my calendar with other platforms?",
    answer:
      "Yes, Tramona allows you to sync your calendar with Airbnb. This ensures your availability is updated across all platforms, preventing double bookings.",
  },
];

// for full faq page

export const hostsFaqData = [
  {
    category: "How it works",
    questions: [
      {
        question: "Why list on Tramona?",
        answer: "Tramona provides an opportunity to maximize your occupancy by supplementing Airbnb and other platforms. Our platform is designed to help you fill vacancies efficiently, choosing when to accept or deny, while keeping pricing competitive on other listing sites.",
      },
      {
        question: "Can I sync my calendar with other platforms?",
        answer: "Yes! You can easily sync your calendar with Airbnb, ensuring that you never double-book your property and that all your reservations are in one place.",
      },
      {
        question: "Am I forced to offer discounts?",
        answer: "No, you are not forced to offer discounts. You have complete control over your pricing strategy and can offer whichever amount you choose.",
      },
      {
        question: "How do I know when there is a request",
        answer: "You will receive instant notifications via text when a traveler submits a request for an area and price that fits your property. Our user-friendly dashboard will alert you, allowing you to respond promptly and maximize your booking opportunities.",
      },
      {
        question: "How do I accept, counter offer or reject a request?",
        answer: "On the host dashboard you will see all requests that are eligible for your price range and location of your property. You will see how much the traveler wants to spend, from there you can accept, counter offer or decline the request.",
      },
      {
        question: "Can I import my existing listings?",
        answer: "You can import your existing listings from Airbnb, or manually upload.",
      },
      {
        question: "Can I give access to my property manager or team?",
        answer: "Yes, once you set up a host account, you can invite co-hosts to the platform and choose strict, moderate or loose privileges for them.",
      },
      {
        question: "How do I communicate with the traveler?",
        answer: "Our platform includes a messaging system that allows for easy communication with travelers. You can discuss details, answer questions, and provide any information necessary for a seamless booking experience.",
      },
      {
        question: "How to travelers know my rules and cancellation policy?",
        answer: "You can clearly outline your rules and cancellation policy on your listing. This information is required during the host onboard process and auto comes in when you sign up with your Airbnb account.",
      },
      {
        question: "How is customer support handled?",
        answer: "Tramona offers 24/7, robust customer support to assist you whenever needed. Our dedicated team is available to help with any issues or questions, ensuring you have the support necessary for a successful hosting experience. Customer experience is our number one priority.",
      },
      {
        question: "Does Tramona offer insurance or coverage for damage?",
        answer: "Yes, Tramona provides 50k of protection to protect you and your property for any damage. We prioritize the safety and security of our hosts, so you can host with peace of mind knowing you have coverage in place.",
      },
    ],
  },
  {
    category: "Safety",
    questions: [
      {
        question: "How is customer support handled?",
        answer: "Tramona offers 24/7, robust customer support to assist you whenever needed. Our dedicated team is available to help with any issues or questions, ensuring you have the support necessary for a successful hosting experience. Customer experience is our number one priority.",
      },
      {
        question: "What do I know about the traveler before they book?",
        answer: "You can review traveler profiles, including their verification status, ID Verification status and description. As a host you can also require the traveler to go through a 3rd party verification process through stripe to confirm their identity.",
      },
      {
        question: "What protection does Tramona provide?",
        answer: "Tramona provides up to $50,000 in protection, more than VRBO and Booking.com, but less than Airbnb.",
      },
      {
        question: "How does Tramona vet travelers?",
        answer: "We have 3 levels of vetting for travelers. Our own internal system, a 3rd party vetting process and also an option Stripe verification hosts can choose to have travelers do before booking.",
      },
    ],
  },
  {
    category: "Payments/Fees",
    questions: [
      {
        question: "How and when do I get paid?",
        answer: "You will receive payments 24 hours after a traveler checks in. Payment is collected from the traveler at the time of booking by Tramona, and safely held via Stripe.",
      },
      {
        question: "What Fees does Tramona charge",
        answer: "Tramona charges hosts a flat 2.5% fee, the most host friendly platform period. Airbnb charges 3%, Vrbo 5% and Booking.com 15%-18%. On the traveler side Tramona charges 5.5%",
      },
    ],
  },
];

export const travelersFaqData = [
  {
    category: "How it works",
    questions: [
      {
        question: "How does Tramona work for travelers?",
        answer: "Tramona allows you to submit a request with your travel dates, location, and budget. Hosts can then match your request with an offer. You review the offers and can book directly if you find the right match.",
      },
      {
        question: "How do I know I'm getting a good deal?",
        answer: "Tramona works similarly to Priceline for short-term rentals, meaning hosts can choose to offer you discounts on vacant dates. Since hosts can accept offers based on your budget, you have the chance to secure great deals that you won't find on other platforms.",
      },
      {
        question: "Can I communicate with the host?",
        answer: "Yes, once a host has sent you a match, you can communicate with them directly through Tramona's messaging system to discuss any details.",
      },
      {
        question: "Are there traveler fees?",
        answer: "Tramona does take fees so we can run our business, but we take ~50% lower fees than Airbnb and other platforms.",
      },
      {
        question: "Can I cancel my booking?",
        answer: "Tramona offers various cancellation policies set by the host, which range from strict to flexible. The cancellation terms will be clearly displayed when you make your booking.",
      },
      {
        question: "What happens if there's a problem with my stay?",
        answer: "Tramona has 24/7 customer support to assist with any issues during your stay, including booking problems or disputes with the host.",
      },
      {
        question: "How do I know if a property is safe or secure?",
        answer: "All hosts go through a verification process on Tramona and we also require hosts to be listed on Airbnb to know that Airbnb has also vetted them.",
      },
      {
        question: "How do I pay for my booking?",
        answer: "Payments are processed securely through Stripe, and your payment details will only be charged once your booking is confirmed. Payment is released to the host 24 hours after check-in, if anything goes wrong, you are guaranteed to get your money back.",
      },
      {
        question: "What if the host cancels my booking?",
        answer: "If a host cancels, Tramona will have your back, no questions asked. We will help you find an alternative stay or refund your booking based on the cancellation policy in place.",
      },
      {
        question: "What is the check-in process?",
        answer: "The host will provide all check-in details after your booking is confirmed. This information will include instructions, house rules, and any specific requirements.",
      },
      {
        question: "What if I don't get any offers from hosts?",
        answer: "If no hosts respond to your request, you can submit a new one or adjust your travel preferences to increase the chances of receiving offers. You'll be notified once a host submits a match, or if none do.",
      },
    ],
  },
];