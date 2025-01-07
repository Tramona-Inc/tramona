#!/bin/bash

# Create HTML file
cat > message_system.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Tramona System Code Documentation</title>
    <style>
        body { font-family: monospace; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .section { margin: 40px 0; }
        .section-title { font-size: 24px; color: #2563eb; margin: 20px 0; }
        .file { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px; }
        .file-name { font-weight: bold; color: #333; margin-bottom: 10px; }
        pre { background: #fff; padding: 15px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Tramona System Code Documentation</h1>
EOF

# Function to add section header
add_section_header() {
    echo "<div class='section'>" >> message_system.html
    echo "<h2 class='section-title'>$1</h2>" >> message_system.html
}

# Function to add file content to HTML
add_file_to_html() {
    if [ -f "$1" ]; then
        echo "<div class='file'>" >> message_system.html
        echo "<div class='file-name'>$1</div>" >> message_system.html
        echo "<pre><code>" >> message_system.html
        cat "$1" >> message_system.html
        echo "</code></pre>" >> message_system.html
        echo "</div>" >> message_system.html
    else
        echo "File not found: $1"
    fi
}

# Authentication & Authorization
add_section_header "Authentication & Authorization"
AUTH_FILES=(
    "./src/server/api/trpc.ts"
    "./src/server/auth.ts"
    "./src/server/db/schema/tables/users.ts"
)
for file in "${AUTH_FILES[@]}"; do
    add_file_to_html "$file"
done

# State Management
add_section_header "State Management"
STATE_FILES=(
    "./src/utils/store/messages.ts"
    "./src/utils/store/conversations.ts"
)
for file in "${STATE_FILES[@]}"; do
    add_file_to_html "$file"
done

# Supabase Integration
add_section_header "Supabase Integration"
SUPABASE_FILES=(
    "./src/utils/supabase-client.ts"
    "./src/types/supabase.message.ts"
)
for file in "${SUPABASE_FILES[@]}"; do
    add_file_to_html "$file"
done

# UI Components
add_section_header "UI Components"
UI_FILES=(
    "./src/components/ui/popover.tsx"
    "./src/components/ui/form.tsx"
)
for file in "${UI_FILES[@]}"; do
    add_file_to_html "$file"
done

# Email & Notifications
add_section_header "Email & Notifications"
NOTIFICATION_FILES=(
    "./src/server/server-utils.ts"
)
for file in "${NOTIFICATION_FILES[@]}"; do
    add_file_to_html "$file"
done

# Stripe Integration
add_section_header "Stripe Integration"
STRIPE_FILES=(
    "./src/utils/payment-utils/paymentBreakdown.ts"
    "./src/utils/stripe-utils.ts"
    "./src/utils/webhook-functions/stripe-utils.ts"
)
for file in "${STRIPE_FILES[@]}"; do
    add_file_to_html "$file"
done

# Host Conversation Feature
add_section_header "Host Conversation Feature"
HOST_CONV_FILES=(
    "./src/components/dashboard/host/requests/requests-to-book/HostRequestsToBook.tsx"
    "./src/components/landing-page/search/DesktopSearchTab.tsx"
    "./src/components/my-trips/TripTab.tsx"
    "./src/components/my-trips/UpcomingTripCard.tsx"
    "./src/components/propertyPages/PropertyPage.tsx"
    "./src/components/propertyPages/sidebars/priceCards/RequestToBookOrBookNowPriceCard.tsx"
    "./src/server/api/routers/messagesRouter.ts"
    "./src/utils/messaging/useChatWithUser.ts"
    "./src/utils/payment-utils/useGetOriginalPropertyPricing.ts"
)
for file in "${HOST_CONV_FILES[@]}"; do
    add_file_to_html "$file"
done

# Messaging Components
add_section_header "Messaging Components"
for file in $(find ./src/components/messages -type f -exec grep -l "message\|chat\|conversation" {} \;); do
    add_file_to_html "$file"
done

# Close HTML file
echo "</div></body></html>" >> message_system.html

echo "Created message_system.html with all system code"