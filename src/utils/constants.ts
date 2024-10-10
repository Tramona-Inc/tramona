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

export const travelerAccordionItems = [
  {
    question: "How does Tramona work for travelers?",
    answer:
      "Tramona allows you to submit a request with your travel dates, location, and budget. Hosts can then match your request with an offer. You review the offers and can book directly if you find the right match.",
  },
  {
    question: "How do I know I'm getting a good deal?",
    answer:
      "Tramona works similarly to Priceline for short-term rentals, meaning hosts can choose to offer you discounts on vacant dates. Since hosts can accept offers based on your budget, you have the chance to secure great deals that you won’t find on other platforms.",
  },
  {
    question: "Can I communicate with the host?",
    answer:
      "Yes, once a host has sent you a match, you can communicate with them directly through Tramona’s messaging system to discuss any details.",
  },
  {
    question: "Are there traveler fees?",
    answer:
      "Tramona does take fees so we can run our business, but we take ~50% lower fees than Airbnb and other platforms.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Tramona offers various cancellation policies set by the host, which range from strict to flexible. The cancellation terms will be clearly displayed when you make your booking.",
  },
  {
    question: "What happens if there’s a problem with my stay?",
    answer:
      "Tramona has 24/7 customer support to assist with any issues during your stay, including booking problems or disputes with the host.",
  },
  {
    question: "How do I know if a property is safe or secure?",
    answer:
      "All hosts go through a verification process on Tramona and we also require hosts to be listed on Airbnb to know that Airbnb has also vetted them.",
  },
  {
    question: "How do I pay for my booking?",
    answer:
      "Payments are processed securely through Stripe, and your payment details will only be charged once your booking is confirmed. Payment is released to the host 24 hours after check-in, if anything goes wrong, you are guaranteed to get your money back.",
  },
  {
    question: "What if the host cancels my booking?",
    answer:
      "If a host cancels, Tramona will have your back, no questions asked. We will help you find an alternative stay or refund your booking based on the cancellation policy in place.",
  },
  {
    question: "What is the check-in process?",
    answer:
      "The host will provide all check-in details after your booking is confirmed. This information will include instructions, house rules, and any specific requirements.",
  },
  {
    question: "What if I don’t get any offers from hosts?",
    answer:
      "If no hosts respond to your request, you can submit a new one or adjust your travel preferences to increase the chances of receiving offers. You’ll be notified once a host submits a match, or if none do.",
  },
];

export const hostAccordionItems = [
  {
    question: "Can I counter offer requests?",
    answer:
      "Yes! You have full control over pricing. If a traveler submits a request, you can respond with an offer that fits your availability and pricing preferences.",
  },
  {
    question: "How do I communicate with the traveler?",
    answer:
      "Once you’ve matched with a traveler, Tramona facilitates messaging between you and the traveler, allowing you to discuss details, clarify questions, or provide any additional information.",
  },
  {
    question: "How do they know my rules and information?",
    answer:
      "When you accept a booking, your house rules, check-in procedures, and any other important information will automatically be shared with the traveler. You can customize this in your host dashboard to ensure that travelers are fully informed.",
  },
  {
    question: "Can I invite a co-host?",
    answer:
      "Yes, Tramona supports co-hosting. You can add a co-host to help manage bookings, respond to traveler inquiries, and coordinate check-ins. They’ll have access to the necessary tools without needing full access to your account.",
  },
  {
    question: "How is customer support handled?",
    answer:
      "Tramona offers 24/7 support for both hosts and travelers. Our support team is available to help resolve issues related to bookings, payments, and traveler disputes. Additionally, we provide dedicated assistance for any technical or platform-related concerns.",
  },
  {
    question: "What protection am I giving up compared to Airbnb and VRBO?",
    answer:
      "While Tramona offers up to $50K in booking protection, some additional protections you may find on other platforms (like specific guest injury liability) are not automatically included. However, our protection plan covers most key concerns, and you can supplement with personal insurance if needed.",
  },
  {
    question: "Why list on Tramona?",
    answer:
      "Tramona helps you optimize occupancy and revenue by offering more flexibility. Just like how Priceline allowed hotels to offload unbooked rooms without lowering rates across the board, Tramona allows you to keep your listings at full price on other platforms while accepting offers for lower rates only when you choose. We also take lower fees than platforms like Airbnb and VRBO, meaning you can earn more while giving travelers better deals.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Hosts get paid 24 hours after check-in. Payments are processed via Stripe and can be deposited directly into your bank account. You’ll also be able to track your earnings and payouts in real-time through your host dashboard. When you create a host account you will be prompted to make or connect your Stripe account.",
  },
  {
    question: "What are the fees for using Tramona?",
    answer:
      "Tramona takes a smaller commission than Airbnb or VRBO, allowing you to keep more of your earnings. Typically, we take around 50% less in fees, which means you and the traveler benefit more.",
  },
  {
    question: "Do I have control over my pricing?",
    answer:
      "Yes, you have full control over your pricing. Your pricing is pulled in from Airbnb, so it will be in sync with that. You can also put price restrictions on to make sure you are not getting low-balled.",
  },
  {
    question: "Can I sync my calendar with other platforms?",
    answer:
      "Yes, Tramona allows you to sync your calendar with Airbnb. This ensures your availability is updated across all platforms, preventing double bookings.",
  },
  {
    question: "Do I need to offer discounts on Tramona?",
    answer:
      "No, offering discounts is completely optional. You can list your property at full price, and only accept lower offers if it fits your preference. It’s similar to how Priceline works with hotels—you can keep your rates high and only lower them if you choose to fill unbooked dates.",
  },
  {
    question: "Can I vet or reject travelers?",
    answer:
      "Yes, Tramona allows you to screen travelers before accepting their booking. You’ll be able to see that they have been verified just like you can on Airbnb, and you can also make them go through a thorough verification process if you choose. You are free to reject travelers who don’t meet your standards or feel uncomfortable hosting.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Tramona offers the same cancellation policies you see on Airbnb, which you can set yourself. You can choose from various options ranging from strict to flexible, allowing you to decide how cancellations will be handled.",
  },
  {
    question: "Does Tramona offer insurance or coverage for damage?",
    answer:
      "Yes, Tramona offers up to $50K in booking protection, covering damages to your property. This coverage protects against major issues. You can also supplement with your own insurance if needed.",
  },
  {
    question: "Can I import my existing listings?",
    answer:
      "Yes, Tramona makes it easy to import your existing property listings from Airbnb. This includes property descriptions, photos, and pricing information, allowing for a quick and seamless setup.",
  },
  {
    question: "Can I give access to my property manager or team?",
    answer:
      "Yes, Tramona supports co-hosting. You can add property managers or team members as co-hosts to help with everything they typically do.",
  },
];

export const whyListAccordionItems = [
  {
    question: "Does Tramona help with Taxes?",
    answer:
      "Yes! You have full control over pricing. If a traveler submits a request, you can respond with an offer that fits your availability and pricing preferences.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Yes, Tramona supports co-hosting. You can add a co-host to help manage bookings, respond to traveler inquiries, and coordinate check-ins. They’ll have access to the necessary tools without needing full access to your account.",
  },
  {
    question: "How much protection does Tramona offer?",
    answer:
      "Tramona helps you optimize occupancy and revenue by offering more flexibility. Just like how Priceline allowed hotels to offload unbooked rooms without lowering rates across the board, Tramona allows you to keep your listings at full price on other platforms while accepting offers for lower rates only when you choose. We also take lower fees than platforms like Airbnb and VRBO, meaning you can earn more while giving travelers better deals.",
  },
];