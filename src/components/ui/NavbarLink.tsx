import type { ReactNode } from "react";
import { NavLink, type To } from "react-router";

type NavbarLinkProps = {
  to: To;
  icon?: ReactNode;
  label: string;
  activeColor: string;
};

export default function NavbarLink({
  to,
  icon,
  label,
  activeColor,
}: NavbarLinkProps) {
  const base =
    "flex cursor-pointer flex-nowrap items-center gap-1 text-xs sm:text-sm uppercase text-[#fdf0d5] hover:text-lightBlue transition-all duration-300";
  const active = `flex cursor-pointer flex-nowrap items-center gap-1 text-sm uppercase ${activeColor}`;

  return (
    <NavLink
      to={to}
      aria-label={`${label} tab`}
      className={({ isActive }) => (isActive ? active : base)}
    >
      {icon}
      {label}
    </NavLink>
  );
}
