import type { ReactNode } from "react";
import { Link, type To } from "react-router";

type PageLinkProps = {
  to: To;
  animation?: string;
  icon?: ReactNode;
  text: string;
};

export default function PageLink({ to, animation, icon, text }: PageLinkProps) {
  return (
    <Link
      to={to}
      className={`${animation} hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-full max-w-sm flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase ${animation && "opacity-0"} transition-all duration-300 active:scale-95 sm:text-base`}
    >
      {icon} {text}
    </Link>
  );
}
