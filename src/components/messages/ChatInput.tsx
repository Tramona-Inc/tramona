import { useState, type FormEvent } from "react";
import { Input } from "../ui/input";

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          id="newMessage"
          name="newMessage"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="rounded-full"
        />
      </form>
    </div>
  );
}
