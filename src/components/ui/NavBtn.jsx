export default function NavBtn({
  activeTab,
  setActiveTab,
  tab,
  icon,
  label,
  activeColor,
}) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`inline-flex min-w-36 cursor-pointer items-center gap-2 rounded px-3 py-1 text-sm sm:text-base ${
        activeTab === tab ? activeColor : "bg-gray-700"
      }`}
      aria-label={`${label} tab`}
    >
      {icon}
      {label}
    </button>
  );
}
