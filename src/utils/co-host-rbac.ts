export const roles = {
  MATCH_MANAGER: {
    can: [
      "accept_or_reject_booking_requests",
      "adjust_property_availability",
      "modify_pricing_for_specific_dates",
      "communicate_with_guests",
    ],
    cannot: [
      "edit_property_details_or_photos",
      "access_financial_information",
      "modify_overall_pricing_strategy",
    ],
  },
  LISTING_MANAGER: {
    can: [
      "update_property_descriptions_and_amenities",
      "manage_property_photos",
      "respond_to_guest_inquiries",
      "coordinate_check_ins_and_check_outs",
      //Match

      "communicate_with_guests", // can they???
    ],
    cannot: [
      "accept_or_reject_booking_requests",
      "modify_pricing_or_availability",
      "access_financial_reports",
    ],
  },
  ADMIN_ACCESS: {
    can: [
      "view_financial_reports",
      "modify_overall_pricing_strategy",
      //Listing
      "update_property_descriptions_and_amenities",
      "manage_property_photos",
      "respond_to_guest_inquiries",
      "coordinate_check_ins_and_check_outs",
      //Match
      "accept_or_reject_booking_requests",
      "adjust_property_availability",
      "modify_pricing_for_specific_dates",
      "communicate_with_guests",
    ],
    cannot: [
      "access_or_modify_payment_information",
      "delete_property_listing",
      "change_primary_host",
    ],
  },
} as const;

export type Role = keyof typeof roles;
