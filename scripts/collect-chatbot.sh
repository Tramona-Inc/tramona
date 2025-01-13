#!/bin/bash
output_file="chatbot-documentation.html"
echo "<!DOCTYPE html>
<html>
<head>
    <title>Chatbot System Documentation</title>
</head>
<body>
<h1>Client-side Components</h1>" > $output_file

# Function to add file content
add_file() {
    if [ -f "$1" ]; then
        echo "<h2>$1</h2><pre><code>" >> $output_file
        cat "$1" >> $output_file
        echo "</code></pre>" >> $output_file
    else
        echo "File not found: $1"
    fi
}

# Client-side files
add_file "src/components/messages/chat-with-admin-popover/MessagesPopover.tsx"
add_file "src/components/messages/chat-with-admin-popover/ListMessagesWithAdmin.tsx"
add_file "src/components/messages/ListMessages.tsx"
add_file "src/utils/store/messages.ts"
add_file "src/utils/supabase-client.ts"
add_file "src/components/_common/UserAvatar.tsx"
add_file "src/types/supabase.ts"
add_file "src/types/supabase.message.ts"
add_file "src/utils/utils.ts"
add_file "src/utils/formatters.ts"

# UI Components
echo "<h2>UI Components</h2>" >> $output_file
for file in src/components/ui/*.tsx; do
    add_file "$file"
done

# Server-side files
echo "<h1>Server-side Components</h1>" >> $output_file
add_file "src/server/api/routers/messagesRouter.ts"
add_file "src/server/slack.ts"
add_file "src/server/db/schema/tables/messages.ts"
add_file "src/server/db/schema/relations.ts"
add_file "src/server/db/schema/tables/users.ts"
add_file "src/server/db/index.ts"
add_file "src/middleware.ts"

echo "</body></html>" >> $output_file
echo "Chatbot documentation has been written to $output_file" 