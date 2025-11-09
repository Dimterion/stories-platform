export default function Footer() {
  return (
    <footer className="flex items-center justify-center gap-1 bg-gray-800 py-1 text-sm">
      <p>&copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.dimterion.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Dimterion
      </a>
    </footer>
  );
}
