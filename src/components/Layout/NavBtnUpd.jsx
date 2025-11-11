export default function NavBtn({
  activeTab,
  setActiveTab,
  tab,
  icon,
  label,
  activeColor,
}) {
  return (
    <button onClick={() => setActiveTab(tab)} aria-label={`${label} tab`}>
      {icon}
      {label}
    </button>
  );
}
