export default function CheckInMethodDialog() {
  const methods = [
    {
      title: "Smart lock",
      subtitle: "Guests will use a code or app to open a wifi-connected lock.",
    },
    {
      title: "Keypad",
      subtitle:
        "Guests will use the code you provide to open an electronic lock.",
    },
    {
      title: "Lockbox",
      subtitle:
        "Guests will use a code you provide to open a small safe that has a key inside.",
    },
    {
      title: "Building staff",
      subtitle: "Someone will be available 24 hours a day to let guests in.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">Select a check-in method</h1>
        <p className="text-muted-foreground">How do travelers get in?</p>
      </div>
      <div className="space-y-4">
        {methods.map((method, index) => (
          <div className="rounded-xl border p-3" key={index}>
            <h2>{method.title}</h2>
            <p>{method.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
