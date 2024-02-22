import ListMessages from "./ListMessages";

export default function ChatMessages() {
  return (
    <div className="relative flex flex-1 overflow-y-auto bg-red-500">
      <ListMessages />
    </div>
  );
}
