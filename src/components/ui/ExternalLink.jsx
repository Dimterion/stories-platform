export default function ExternalLink({ link, icon, text }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-center gap-1 border p-2"
    >
      {icon} {text}
    </a>
  );
}
