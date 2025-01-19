Chat System Architecture

Your chat system is designed as a real-time messaging application with the following key components:

Frontend:
React (with TypeScript): Provides the user interface and handles user interactions.
Next.js: Provides routing, server-side rendering, and framework capabilities.
Zustand: Manages the client-side state of conversations and messages.
UI Components: Reusable UI elements built on top of Radix primitives for a consistent look and feel.
Backend:
Supabase: Provides the database, authentication, and real-time capabilities.
tRPC: Handles the API layer for communication between the frontend and backend.
Node.js: The runtime environment for the server code.
Communication:
Supabase Realtime: Used to push message updates to clients in real-time.
tRPC: Used for making API requests (mutations and queries) to the server.
Core Components and Their Interactions

src/components/messages/chat-with-admin-popover/MessagesPopover.tsx
Role: This is the primary component that renders the chat interface, usually as a popover or full-screen mobile view. It's responsible for the initial setup, fetching conversations, handling user input, and initiating new messages.
Initialization:
State Setup: Manages local state for the conversationId, tempToken (for guest users), and the popover's open state (open).
User Authentication: Uses useSession from NextAuth to check if a user is logged in. If not, it creates or retrieves a tempToken.
Guest User Handling: If not signed in, it handles temporary user creation and token management with createTempUserForGuest and local storage for managing the temporary user. It uses the tempToken to retrieve a tempUserId.
Conversation Fetching: On component mount or token update, it queries the API using getConversationsWithAdmin to check if there is an existing conversation. If the user is a guest, it uses a sessionToken to find the user and conversation.
Message Display:
Renders ListMessagesWithAdmin component, passing in the messages.
Input Handling:
Uses react-hook-form for managing the message input field.
Handles message submission via the handleOnSend function.
After sending, it calls the appropriate mutation to create a message via tRPC (createOrRetrieveConversation or createOrRetrieveConversationFromGuest) and then sends the message to Supabase.
Real-time Updates:
On initial load, it uses fetchInitialMessages to fetch a batch of initial messages, then it establishes a Supabase real-time subscription using supabase.channel(conversationId) to receive updates when new messages are added to the database.
The subscription listens for "INSERT" events on the messages table for the specified conversationId.
On receiving a new message, it calls handlePostgresChange to process the new message (if needed) and update the zustand store.
Zustand State Updates:
It uses useMessage to access and modify the messages state using addMessageToConversation, setOptimisticIds, and removeMessageFromConversation.
src/components/messages/chat-with-admin-popover/ListMessagesWithAdmin.tsx
Role: Renders the list of messages inside the popover/mobile view.
Data Handling:
Receives an array of messages from MessagesPopover.tsx.
Iterates through the messages and renders them differently based on whether the message was sent by the current user or not.
If the messages array is empty, displays a placeholder message.
Uses session and tempUserId to determine if the current user sent the message or not.
UI: Provides the visual layout for the message list, with styles depending on the sender.
src/components/messages/ListMessages.tsx
Role: Renders the list of messages in the main chat page, not in the popover. Used for general conversations between two users, or between a user and a group.
Initialization:
Sets up a scrollRef to manage scrolling of the messages list.
Manages scroll state userScrolled to determine when to show a "scroll to bottom" button.
Manages a notification state that tracks unread messages.
Gets the current conversationId from zustand.
Gets messages and the data of the participants in the conversation from the zustand store and the context api.
Data Handling:
Fetches the messages from the Zustand store, filtered by the current conversationId.
Sets all the messages as read when loaded for the first time.
Organizes messages into groups and renders them with MessageGroup.
If no messages are found, shows NoMessages message.
Filters and maps messages to messagesWithUser array to determine who sent each message
Real-time Updates:
Sets up a Supabase real-time subscription based on currentConversationId to listen for new messages on the messages table.
On receiving a new message, calls the handlePostgresChange function and calls addMessageToConversation to update the state.
Scroll Management:
Manages scroll to bottom on initial load and when a user clicks the "new messages" button.
Additional Features:
Shows "load more" button to fetch more previous messages.
Handles the display of the notification for unread messages.
src/utils/store/messages.ts
Role: Manages the client-side state of conversations and messages.
State:
conversations: Stores an object of all conversations, keyed by conversationId. Each conversation object contains the array of messages, a page number for pagination, a hasMore boolean to know when to load more messages, and a alreadyFetched boolean to know if it is the initial message load or not.
currentConversationId: Stores the ID of the currently active conversation.
optimisticIds: Array to store message ids before database confirmation.
State Management:
setCurrentConversationId: Sets the currentConversationId.
switchConversation: Used when the conversation changes to switch to a different conversation.
addMessageToConversation: Adds a new message to the corresponding conversation in a mutable way.
setOptimisticIds: Used to add a new id to optimisticIds array.
setMoreMessagesToConversation: Appends more messages to the corresponding conversation.
fetchInitialMessages: Fetches the first batch of messages from the Supabase database, stores them in the store, and sets alreadyFetched.
removeMessageFromConversation: Remove messages from conversation and also removes a specific message id from optimisticIds
src/server/api/routers/messagesRouter.ts
Role: Defines the tRPC API endpoints for all messages-related interactions.
Key Endpoints:
getConversations: Fetches all conversations for the current user. Orders them by most recent activity (newest message or conversation creation date).
createConversationWithAdmin: Creates or retrieves a conversation with the admin user.
createConversationWithAdminFromGuest: Creates or retrieves a conversation with admin from a guest user.
createOrFetchConversationWithOffer: Creates or retrieves a conversation for a specific offer.
createConversationHostWithUser: Creates or retrieves a conversation between a user and host.
createConversationWithHost: Creates or retrieves a conversation with host for logged in users.
addUserToConversation: Adds a user to a conversation.
setMessageToRead: Sets a specific message as read.
getParticipantsPhoneNumbers: Gets the phone numbers of other participants in a conversation.
getNumUnreadMessages: Gets the total number of unread messages of a logged in user.
setMessagesToRead: Sets multiple messages as read.
sendAdminSlackMessage: Sends message to an admin slack channel.
sendChatboxSlackMessage: Sends message to the chatbox slack channel.
getConversationsWithAdmin: Checks if conversation exists with an admin.
createMessage: This is a placeholder endpoint, but it is never used.
Database Interactions:
Uses db (Drizzle ORM) to query data from Supabase.
Performs inserts and updates to the conversations, messages, and conversation_participants tables.
Handles errors and returns the results to the client.
src/utils/supabase-client.ts
Role: Creates and exports the Supabase client for use throughout the application.
Configuration: Initializes the client with your Supabase URL and anon key from environment variables.
Data Flow

User Interaction: The user types a message and clicks "send" in MessagesPopover.tsx or on a chat page.
Form Handling: The message is processed in handleOnSend. The form data is extracted and reset.
API Call: A createOrRetrieveConversation (or guest equivalent) mutation is called to create a message in the database, along with a slack message.
Optimistic Update: The new message is immediately added to the messages state of the conversation in the zustand store via addMessageToConversation. This makes the UI feel responsive.
Database Interaction: The createOrRetrieveConversation method inserts the new message into the database, and returns the database ID.
Realtime Event: Supabase sends a "postgres_changes" event to all subscribed clients.
Subscription Update: The client receives the real-time update. The handlePostgresChange method then processes the new message and adds it to the zustand store if needed. This avoids duplicate messages by checking the optimisticIds first.
UI Update: The messages state is updated which triggers the React component to re-render and display the new message.
Read Status: When the conversation loads for the first time (or when a user views a message), the messages are marked as read. This is done via an API call to /setMessagesToRead which updates the database and avoids duplicate entries.
Key Considerations

Asynchronous Operations: The system heavily relies on asynchronous operations (API calls, database operations, real-time updates). Proper handling of promises, errors, and race conditions is crucial for its correct behavior.
State Management: State management is done via zustand and it plays a crucial role in keeping the UI updated and in sync with the backend.
Real-Time: Supabase realtime ensures messages are sent without a page refresh.
Error Handling: Robust error handling is present with try...catch and the use of errorToast().
