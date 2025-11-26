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
      className={`flex cursor-pointer flex-nowrap items-center gap-1 text-sm uppercase ${activeTab === tab ? activeColor : "text-[#fdf0d5] hover:opacity-90"}`}
    >
      {icon}
      {label}
    </button>
  );
}
