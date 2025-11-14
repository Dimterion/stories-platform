export default function Footer() {
  return (
    <footer className="text-[#669bbc]">
      <p>&copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.dimterion.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Dimterion
      </a>
    </footer>
  );
}
