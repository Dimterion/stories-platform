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
      className="flex cursor-pointer flex-nowrap items-center gap-1 text-sm sm:text-base"
    >
      {icon}
      {label}
    </button>
  );
}
