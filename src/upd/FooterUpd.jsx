export default function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-2 p-1 text-[#669bbc] italic">
      <p>&copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.dimterion.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[#fdf0d5]"
      >
        Dimterion
      </a>
    </footer>
  );
}
