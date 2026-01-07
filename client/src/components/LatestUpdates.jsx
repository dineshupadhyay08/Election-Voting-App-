const updates = [
  {
    title: "PM Kisan Yojana",
    desc: "₹6000/year direct benefit transfer",
  },
  {
    title: "Jan Dhan Account",
    desc: "Zero balance bank account",
  },
  {
    title: "Atal Pension Yojana",
    desc: "Retirement savings scheme",
  },
  {
    title: "Pradhan Mantri Fasal Bima",
    desc: "Crop insurance scheme",
  },
];

const LatestUpdates = () => {
  return (
    <aside className="bg-white rounded-2xl shadow p-4">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Latest Updates</h3>
        <span className="text-indigo-600 text-sm">See all</span>
      </div>

      <div className="space-y-4">
        {updates.map((u, i) => (
          <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-xl">
            <img src="/logo.png" className="w-8 h-8" />
            <div>
              <p className="font-medium text-sm">{u.title}</p>
              <p className="text-xs text-gray-500">{u.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LatestUpdates;
