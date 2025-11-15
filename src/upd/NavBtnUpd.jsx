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
      aria-label={`${label} tab`}
      className="flex flex-nowrap gap-1"
    >
      {icon}
      {label}
    </button>
  );
}
