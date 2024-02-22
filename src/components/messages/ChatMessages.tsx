import InitMessages from "./InitMessages";

export default function ChatMessages() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="relative flex flex-1 overflow-y-auto">
      {/* <ListMessages /> */}
      <InitMessages messages={data} />
    </div>
  );
}
