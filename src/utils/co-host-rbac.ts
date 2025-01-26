export const coHostRoles = {
  "Match Manager": {
    can: [
      "accept_or_reject_booking_requests",
      "adjust_property_availability",
      "modify_pricing_for_specific_dates",
      "communicate_with_guests",
    ],
    cannot: [
      "edit_property_details_or_photos",
      "view_financial_reports",
      "modify_overall_pricing_strategy",
    ],
  },
  "Listing Manager": {
    can: [
      "update_property_descriptions_and_amenities",
      "update_security_deposit",
      "manage_property_photos",
      "respond_to_guest_inquiries",
      "coordinate_check_ins_and_check_outs",
      //Match

      "communicate_with_guests", // can they???
    ],
    cannot: [
      "accept_or_reject_booking_requests",
      "modify_pricing_or_availability",
      "view_financial_reports",
    ],
  },
  "Co-Host": {
    can: [
      "view_financial_reports",
      "modify_overall_pricing_strategy",
      "invite_cohost_role",
      "update_cohost_role",
      "remove_cohost",
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
    cannot: ["remove_property"],
  },
  "Admin Access": {
    can: [
      //Admin only
      "Access_or_modify payment_information",
      //cohost
      "view_financial_reports",
      "modify_overall_pricing_strategy",
      "update_cohost_role",
      "remove_cohost",
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
    cannot: ["delete_property_listing", "change_primary_host"],
  },
} as const;

export type CoHostRole = keyof typeof coHostRoles;
export type Permission = (typeof coHostRoles)[CoHostRole]["can"][number];

export function checkPermission({
  role,
  permission,
}: {
  role: CoHostRole;
  permission: Permission;
}) {
  if (role === "Admin Access") return true; //ADMIN CAN DO Anything
  const rolePermissions = coHostRoles[role].can;

  return rolePermissions.includes(permission);
}
