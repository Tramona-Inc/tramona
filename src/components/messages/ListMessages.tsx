import { Message } from "./Message";

export default function ListMessages() {
  return (
    <div className="absolute space-y-5 p-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
        <Message key={value} />
      ))}
    </div>
  );
}
