import type { ReactNode } from "react";

type ExternalPageLinkProps = {
  href: string;
  icon?: ReactNode;
  text: string;
};

export default function ExternalPageLink({
  href,
  icon,
  text,
}: ExternalPageLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-center gap-1 border p-2 text-xs transition-all duration-300 active:scale-95 sm:text-base"
    >
      {text} {icon}
    </a>
  );
}
