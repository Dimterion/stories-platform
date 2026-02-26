export default function Footer() {
  return (
    <footer className="bg-darkBlue text-lightBlue flex flex-wrap justify-center gap-2 p-1 text-sm italic">
      <p>&copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.dimterion.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-softWhite hover:border-softWhite border-b border-transparent transition-all duration-300"
      >
        Dimterion
      </a>
    </footer>
  );
}
