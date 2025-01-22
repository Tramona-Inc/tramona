Core Tables for Messaging

conversations Table
Purpose: Represents a single conversation thread between two or more users (or a user and the system, like the concierge).
Columns:
id (varchar(21), primary key, default nanoid()): A unique identifier for the conversation. You're using nanoid() for generating these IDs, which is great for scalability and avoids predictable sequences.
name (varchar(255), nullable): An optional name for the conversation (e.g., "Trip with User X," or "Support Ticket #123"). Might be null if it's a direct message or an unorganized chat.
createdAt (timestamp(with timezone), not null, default now()): The timestamp when the conversation was created. Helpful for ordering, filtering, or displaying the conversation creation.
offerId (varchar, nullable): Links this conversation to a specific offer, if related, is usually null. Useful for displaying a message relating to an offer
messages Table
Purpose: Stores individual messages within a conversation.
Columns:
id (varchar(21), primary key, default nanoid()): Unique identifier for each message.
conversationId (varchar(21), not null, foreign key to conversations.id, onDelete: cascade): Links a message to the specific conversation it belongs to. The onDelete: "cascade" ensures that if a conversation is deleted, all its related messages are removed too.
userId (text, nullable, foreign key to users.id, onDelete: set null): The ID of the user who sent the message. It's nullable to handle messages from the system itself (e.g., automated notifications) or if the user gets deleted. It's set null when the user is deleted.
message (varchar(1500), not null): The actual text content of the message.
read (boolean, default false): Indicates if a message has been read by the recipient.
isEdit (boolean, default false): Indicates if a message has been edited by the sender.
createdAt (timestamp(with timezone), not null, default now(), mode string): The time when the message was sent. mode: string is used here so that next-auth can properly serialize and deserialize the date.
conversation_participants Table
Purpose: Manages the relationship between conversations and users who are part of them (many-to-many).
Columns:
conversationId (varchar(21), not null, foreign key to conversations.id, onDelete: cascade): The ID of the conversation.
userId (text, not null, foreign key to users.id, onDelete: cascade): The ID of a user participating in the conversation.
compoundKey (primary key on (conversationId,userId)): Creates a combination key for both columns so that there cannot be duplicate conversation and user combinations
propertyMessages Table
Purpose: Manages the messages for communications related to the properties
Columns:
id (varchar(21), primary key, default nanoid()): Unique identifier for each message, this is using a nanoid
conversationId (varchar(21), not null, foreign key to propertyConversations.id, onDelete: cascade): Links a message to the specific property conversation it belongs to. The onDelete: "cascade" ensures that if a property conversation is deleted, all its related messages are removed too.
authorId (text, not null, foreign key to users.id, onDelete: cascade): The ID of the user who sent the message. It is not nullable because all messages on this table should be created by a user that has been logged in
message (text, not null): The actual text content of the message
readAt(timestamp(with timezone), nullable) if the user as read the message the time of that action.
editedAt (timestamp(with timezone), nullable): the timestamp when a message is edited by the user
createdAt (timestamp(with timezone), not null, default now()): The timestamp when the message was created
propertyConversations Table
Purpose: Manages the conversations related to a specific property
Columns:
id (varchar(21), primary key, default nanoid()): A unique identifier for the conversation related to a property
travelerId (text, not null, foreign key to users.id, onDelete: cascade): The ID of a traveler involved in the conversation.
propertyId (integer, not null, foreign key to properties.id, onDelete: cascade): The ID of the property associated with this conversation.
offerId (integer, nullable, foreign key to offers.id , onDelete: "set null"): Links this conversation to a specific offer, if related
requestToBookId (integer, nullable, foreign key to requestsToBook.id , onDelete: "set null"): Links this conversation to a specific request to book, if related
tripId (integer, nullable, foreign key to trips.id, onDelete: "set null"): Links the conversation to a specific trip, if related.
plannedCheckIn (date, nullable): If the conversation started before a booking, this allows to reference what dates the conversation may have been about.
plannedCheckOut (date, nullable): Same as above
plannedNumGuests (integer, nullable): Same as above
\*createdAt (timestamp(with timezone), not null, default now()): The timestamp when the conversation was created
Key Relationships and How They Work

Users and Conversations: A user can be involved in multiple conversations. A conversation has multiple users.
Conversations and Messages: A conversation has multiple messages. Each message belongs to one conversation and one user.
propertyConversations and properties: A property can have many conversations related to it
The main use of this table is for a user to ask questions about the property, even without having booked it, or without having an offer
Implications for your Messaging System

Data Integrity:
The onDelete: cascade in relations ensures referential integrity. If a conversation or user is deleted, the related data will be automatically cleaned up.
The set null allows a user to be deleted while the message history remains, as a log.
Data Structure:
You have normalized your data effectively with clear separation of conversations, participants, and messages.
You have a separate table for specific property messages.
Scalability:
Using nanoid for primary keys will avoid the scaling problems that auto-incrementing integers can have in distributed databases.
Querying:
The indexes on conversationId, userId, and createdAt will help in optimizing queries, e.g., fetching a conversation's history or messages sent by a particular user.
Features Supported:
Your schema can support core messaging features like:
Direct messages between users
Group messages
Real-time updates of message lists
Tracking read/unread status
Message threading (by conversation ID)
Messages about specific properties.
