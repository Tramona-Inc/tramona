Overview

The Tramona messaging system provides a real-time chat functionality within the application. It allows users to communicate with each other, particularly between travelers and hosts, or with the Tramona admin team. The system is built with the following principles in mind:

Real-time Updates: Messages are delivered and displayed in real time, leveraging Supabase's real-time capabilities.
State Management: The application uses Zustand for state management to handle messages and conversations, which enables performant and responsive UI.
Authentication & Authorization: The system integrates with NextAuth.js to ensure that messaging features are only accessible to authenticated users, with certain actions restricted based on user roles (e.g., admin-only features).
Backend API: tRPC is used for the backend API, creating a type-safe communication layer between the client and server.
Scalable Components: The message system is built with modular components that can be reused throughout the application.
Key Components

Let's break down the key components of the messaging system and how they interact:

./src/components/messages/ChatInput.tsx (Chat Input Component)
Purpose: Handles the input of new messages. Users type messages here, and upon submission, the component triggers several actions to send and display the message.
Functionality:
Uses React Hook Form for form management with Zod for schema validation.
On submission, it creates a new message object with a unique ID (nanoid) and relevant information.
It updates the application state optimistically with useMessage's addMessageToConversation and setOptimisticIds. This means the message appears instantly on the UI while the server request happens in the background.
It saves the message to the Supabase database. If saving to the database fails, it removes the message optimistically (with removeMessageFromConversation).
It handles sending notifications to the admin via Slack.
Conditionally sends SMS/WhatsApp notifications to other participants in the conversation, but not more than once an hour, to avoid excessive spamming.
Calls the useUpdateUser hook to update the lastTextAt of the message sender
Interactions:
Sends data to Supabase for persistence.
Interacts with Zustand store (useMessage) for message state.
Uses api.messages for sending Slack messages and retrieving participant phone numbers and api.twilio for SMS/WhatsApp sending.
Interacts with useConversation to set a conversation to top after a message is sent.
Key Points:
The component is robust, handling both optimistic updates and database errors.
It follows a clear flow: create optimistic message → save to database → handle notifications & errors.
It also performs error logging.
./src/components/messages/ChatMessages.tsx (Chat Messages Container)
Purpose: Acts as a container to manage message display and lifecycle events.
Functionality:
It switches the current conversation with useMessage's switchConversation.
It fetches initial messages for the specified conversationId with useMessage's fetchInitialMessages when mounted.
This component uses LIMIT_MESSAGE (20 by default) to manage the amount of messages initially fetched from the db.
Interactions:
Interacts with useMessage to manage which messages are displayed.
Key Points:
It serves as the entry point for message rendering and ensures that messages are loaded for new conversations.
./src/components/messages/ListMessages.tsx (Message List)
Purpose: Responsible for rendering the actual list of chat messages and handling real-time updates.
Functionality:
Uses a scrollRef to manage scrolling within the message container.
It sets a userScrolled variable when the user scrolls. This triggers a new message indicator at the bottom of the chat window.
It listens to PostgreSQL changes on Supabase and updates the message list in real time (with handlePostgresChange), ensuring that new messages are displayed as soon as they come. This is where the real-time updating logic is.
On load, it marks unread messages as read if the current user has not sent it.
It groups messages from the same user by date with groupMessages.
It renders messages with MessageGroup.
Fetches and applies the user data to the messages.
If the user has scrolled, the notification at the bottom appears until the user scrolls to the bottom again
Interactions:
Listens to Supabase changes.
Interacts with useMessage to retrieve message data.
Uses useConversation to get information about chat participants.
Uses the api.messages for marking messages as read.
Key Points:
This component manages the complexities of real-time updates, scrolling, and message grouping.
It's a performant way to manage a long list of messages.
./src/components/messages/MessageGroup.tsx (Message Grouping)
Purpose: Groups together consecutive messages from the same user, improving UI organization.
Functionality:
Renders a list of consecutive messages from the same user, grouped in a bubble.
Displays the sender's name and timestamp.
Interactions:
Utilizes the logic provided by ./src/components/messages/groupMessages.ts.
Key Points:
Provides a clean user interface by grouping messages.
./src/components/messages/HostInitiateChat.tsx
Purpose: Enables a host to message a traveler.
Functionality:
Uses api.messages.createConversationHostWithUser to create a conversation between the host and the traveler.
Redirects the host to the messages page after a new conversation has been created.
Interactions:
Interacts with api.messages and next router.
./src/components/checkout/sections/ChatWithHost.tsx
Purpose: Allows a traveler to quickly chat with the host from the checkout page.
Functionality:
Uses useChatWithAdmin custom hook to initiate the chat.
Interactions:
Interacts with useChatWithAdmin custom hook.
./src/utils/store/messages.ts (Message Store)
Purpose: Manages the client-side state of messages, conversations, and loading. It makes use of zustand which allows for easy reactive state management and fast UI updates
State:
conversations: An object keyed by conversationId to store all message data.
currentConversationId: The currently selected conversation ID.
optimisticIds: Array of IDs of messages that are being saved to supabase to avoid showing duplicate messages.
Methods:
setCurrentConversationId: Sets the currently selected conversation.
switchConversation: Sets the currently selected conversation.
addMessageToConversation: Add a new message to the state.
setOptimisticIds: Stores the id of any message that is being saved to supabase.
setMoreMessagesToConversation: Loads more messages to the correct conversation.
fetchInitialMessages: Fetches initial messages from Supabase.
removeMessageFromConversation: Removes messages from state.
Interactions:
Used by components to set and get message data.
Interacts with Supabase for data fetching.
Key Points:
Centralized message state management, making it easier to manage all message-related data.
./src/utils/store/conversations.ts (Conversation Store)
Purpose: Manages the list of conversations that are visible in the app. It makes use of zustand which allows for easy reactive state management and fast UI updates
State:
conversationList: An array of all conversations the user is a part of.
Methods:
setConversationList: Sets the initial list of conversations, this is used in the parent components for managing the current state of the list.
setConversationToTop: Moves the current active conversation to the top and updates the message list within the conversation object.
setConversationReadState: Sets read status of all messages in state.
Interactions:
Interacts with the messages state.
Key Points:
Centralized conversation state management, making it easier to manage all conversations-related data.
./src/utils/supabase-client.ts (Supabase Client)
Purpose: Centralized Supabase client initialization.
Functionality:
Creates a new Supabase client, ensuring that database interactions across the application are consistent.
Interactions:
Used by other components and server utils to access Supabase.
Key Points:
Provides a single point of configuration for the Supabase client.
./src/types/supabase.ts & ./src/types/supabase.message.ts (Supabase Types)
Purpose: Type definitions for Supabase database schema.
Functionality:
Provide Typescript types for tables, enums, etc...
Interactions:
Used across the application for type safety.
Key Points:
Enhances type safety and reduces errors in development.
./src/components/ui (UI Components)
Purpose: Reusable user interface components with a cohesive design.
Functionality:
Contains UI elements like buttons, forms, popovers etc. These provide a clean and unified user interface.
Interactions:
Used across the application for consistent UIs.
Key Points:
Provides a consistent user experience and makes it easier to update/modify the UI.
./src/server/server-utils.ts (Server Utilities)
Purpose: Contains a collection of functions that facilitates communication with external services. These utilities centralize and simplify common server-side tasks across the application, such as sending emails, text messages, interacting with APIs, and fetching data.
Functionality:
Sends email and text messages.
Manages external APIs, fetching data for different providers.
Handles group and host team functionalities.
Manages properties, requests, and offers.
Implements various helpers that facilitates data manipulation.
Interactions:
Interacts with Nodemailer, Twilio, and external APIs and database for fetching and managing data.
Key Points:
Centralizes server-side utilities in a modular fashion.
./src/utils/payment-utils (Payment Utilities)
Purpose: Consists of functions for calculation payment breakdowns and interactions with Stripe.
Functionality:
Calculates taxes, service fees and discounts for the final price.
Interacts with Stripe for payment authorization, transfers and refunds.
Interactions:
Relies on the calculations functions and interacts with the Stripe API.
Key Points:
Provides consistent price calculation across the app.
./src/utils/webhook-functions/stripe-utils.ts & ./src/utils/webhook-functions/trips-utils.ts (Stripe Webhook Utils)
Purpose: Manages interactions with Stripe's API through webhooks for events such as successful payments and payment method setup.
Functionality:
Creates and Manages Stripe payment intents.
Handles the checkout process including updating the trips, setting up payment intents for both credit card payments and future payments, and managing the superhog request id.
Manages notifications after a successful payment
Interactions:
Interacts with the Stripe API and database.
Key Points:
Provides logic for webhook management.
./src/components/messages/chat-with-admin-popover/MessagesPopover.tsx (Admin Messaging UI)
Purpose: Displays a chat UI between a user and the Tramona Admin team using a popover component.
Functionality:
The component is similar to ChatInput but provides a customized user interface for interactions with the admin.
It uses a tempToken in the localStorage to identify a non-logged user, which allows the user to chat with admin before having signed in.
Listens to real-time changes from supabase and updates the messages accordingly.
Interactions:
Interacts with useMessage for messages state and api.messages for fetching conversations and messages data.
Key Points:
It supports both logged-in users and guests.
./src/components/messages/chat-with-admin-popover/ListMessagesWithAdmin.tsx (Admin Message Listing)
Purpose: Lists the messages for the admin messaging feature.
Functionality:
Shows messages in a conversation between a user and an admin.
Adjusts UI to differentiate between logged and non-logged in users.
Interactions:
Displays data that are passed in by MessagesPopover.tsx
Key Points:
Provides a UI for the messages inside the popover.
./src/components/messages/MessagesSidebar.tsx (Message Sidebar)
Purpose: List all conversations for a user, this is displayed in host and regular user settings
Functionality:
Shows a list of active conversations, allows you to view conversations based of all messages or just unread messages.
Uses SidebarConversation component to display individual conversation components.
Listens to postgres changes to receive messages.
When an item is clicked the app updates state accordingly.
Interactions:
Uses supabase to listen to postgres changes.
Uses zustand for state management for conversations useConversation.
Uses next router for navigation.
Uses useSession to detect the current session.
Key Points:
Centralize conversations view with real time updates.
./src/components/messages/SidebarConversation.tsx (Sidebar Conversation Component)
Purpose: Displays individual conversation UI components in a sidebar listing format.
Functionality:
Uses UserAvatar component for the participants photo
Displays name or email or participants in the converstation.
Displays the latest message and the timestamp if there's any.
Interactions:
Interacts with api.messages to update message to read when the item is selected.
Interacts with useConversation to update the read state.
Updates the parent component MessageSidebar state.
Key Points:
Displays a single item in a conversation list
./src/components/messages/MessagesContent.tsx (Messages Content Display)
Purpose: Manages the chat and layout of components for the active conversation being displayed.
Functionality:
Conditionally displays either EmptyStateValue or the chat messaging components depending on the selected conversation.
Displays ChatHeader, ChatMessages and ChatInput components.
Interactions:
Passes state down to child components.
Key Points:
Acts as a layout container for the conversation window.
./src/server/api/routers/messagesRouter.ts (tRPC Router for Messages)
Purpose: Defines all backend endpoints and the logic associated with messaging functionality.
Functionality:
Manages conversation data by fetching, creating, and managing conversations between users.
Provides a getConversations endpoint to retrieve all conversations for a user.
Defines endpoint for creating conversations with admin, host or any user by id.
Defines a mutation endpoint that sets a message as read in the database.
Manages participants phone numbers for sending notifications.
Provides a mutation for sending Slack notifications and getting the number of unread messages.
Interactions:
Uses Drizzle ORM for database interactions and interacts with Supabase.
Interacts with other components to send message to admin and other users using different channels.
Key Points:
Provides all the logic for messaging including type safety, data processing and error handling.
./src/utils/messaging/useChatWithUser.ts (Messaging Hook)
Purpose: Provides custom logic for initiating chat between users.
Functionality:
It utilizes the createConversationHostWithUser endpoint via tRPC to create the conversation.
Redirects user to message view after a conversation is created.
Interactions:
Interacts with the backend API.
Key Points:
Abstraction of conversation creation logic for easier reuse.
./src/utils/payment-utils/useGetOriginalPropertyPricing.ts (Price Fetching Hook)
Purpose: A custom hook designed to retrieve pricing information for a property, including the original nightly price (which can be scraped from external sources), host specific prices, and other pricing adjustments (e.g., discounts).
Functionality:
Queries and retrieves price data for both scraped and direct listing properties (e.g., from Hospitable).
Applies markups and calculates prices for each listing.
Returns loading state to indicate if the pricing data is loading, or if an error occurs.
It also handles discount applications.
Interactions:
Interacts with backend endpoints to get pricing and calendar information and api.misc for prices.
Key Points:
Centralizes logic for fetching and calculating property prices.
How Everything Works Together

Initiating a Chat: When a user wants to start a new conversation, components like HostInitiateChat.tsx, or the logic within MessagesPopover.tsx and other UI components, call the backend api.messages endpoints to create the conversation. When the conversation is initiated, the user is either redirected to the messaging page or a popover is displayed.
Sending a Message: The ChatInput.tsx component takes a user’s input and adds that message optimistically to the UI using the state manager useMessage in addMessageToConversation. In the background, Supabase stores the new message and all the relevant notification are sent.
Real-Time Updates: Supabase triggers a real-time event (PostgreSQL changes). This is listened to in the ListMessages.tsx component to update the UI with the new message, providing a seamless real-time experience.
Message Grouping: Before rendering, the ListMessages.tsx component uses the groupMessages function in ./src/components/messages/groupMessages.ts to group messages, ensuring messages from the same user display within a single container.
State Management: Zustand, with useMessage and useConversation handles the state of conversations, messages, and other data to achieve an optimized UI.
Authentication & Authorization: NextAuth.js ensures all message routes in tRPC are protected. The protectedProcedure verifies that a user session exists before processing any message-related action. Some routes use the custom role checking methods to authorize users based on their role.
Error Handling: The system provides feedback to the user and also does error logging via the console. For example the ChatInput.tsx handles a failure to post the message to Supabase, and makes use of errorToast custom hook.
Deep Dive into Specific Workflows

User-to-User Messaging:
When a traveler initiates a chat with a host, HostInitiateChat.tsx calls tRPC to create a new conversation in the conversations table.
Once created, the conversationParticipants table is updated, associating both users with the new conversation.
Both users see the new conversation in their sidebar through the use of useConversation.
Messages are exchanged, and notifications are sent to ensure that the conversation is active and up to date.
Guest User Messaging:
Guest users that have not logged in can use the MessagesPopover popover to initiate a chat with admin.
A tempToken is used in the background and stored in localStorage to identify a temporary user.
When the user sends a message, it interacts with createConversationWithAdminFromGuest which uses the tempToken and sends the message.
Real-Time Updates:
The Supabase channel listens to the messages table changes and dispatches updates via event listeners, which are processed in the ListMessages.tsx component using handlePostgresChange.
Zustand store with useMessage updates state immediately on the UI while all other processes are happening.
Potential Improvements

Typing Indicator: Add a typing indicator to the message view, enhancing the real-time nature of the chat.
Read Receipts: Improve read receipts to handle when the user has not seen the message yet.
Optimized Queries: Fine-tune database queries for better performance (e.g., using indices, optimizing fetches etc).
Error Logging: Implement a full error logger and not just console.error.
Test Suite: Write comprehensive tests for the entire chat functionality.
Notification Handling: Add logic for push notifications.
Search Functionality: Add a search functionality within a conversation.
Performance Improvements: Refine performance to handle a large amount of conversations.
Overall Summary

The Tramona messaging system is a well-structured, modular, and robust solution for real-time chat. It leverages powerful technologies like Supabase for real-time updates, Zustand for state management, and tRPC for type-safe API communication. The system is designed with scalability and maintainability in mind, making it a solid foundation for ongoing enhancements.
