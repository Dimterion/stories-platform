import { NavLink } from "react-router";

export default function PageLink({ tab, icon, label, activeColor }) {
  const base =
    "flex cursor-pointer flex-nowrap items-center gap-1 text-xs sm:text-sm uppercase text-[#fdf0d5] hover:text-lightBlue transition-all duration-300";
  const active = `flex cursor-pointer flex-nowrap items-center gap-1 text-sm uppercase ${activeColor}`;

  return (
    <NavLink
      to={`/${tab}`}
      aria-label={`${label} tab`}
      className={({ isActive }) => (isActive ? active : base)}
    >
      {icon}
      {label}
    </NavLink>
  );
}
