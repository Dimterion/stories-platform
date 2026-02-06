import { Link } from "react-router";

export default function PageLink({ link, animation, icon, text }) {
  return (
    <Link
      to={`/${link}`}
      className={`${animation} hover:bg-softWhite hover:text-deepBlue bg-darkBlue mx-auto flex w-sm max-w-[80vw] flex-nowrap items-center justify-center gap-2 border p-2 text-center text-xs uppercase ${animation && "opacity-0"} transition-all duration-300 active:scale-95 sm:text-base`}
    >
      {icon} {text}
    </Link>
  );
}
