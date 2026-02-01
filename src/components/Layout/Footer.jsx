export default function Footer() {
  return (
    <footer className="bg-darkBlue text-lightBlue flex flex-wrap justify-center gap-2 p-1 text-sm italic">
      <p>&copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.dimterion.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-softWhite underline"
      >
        Dimterion
      </a>
    </footer>
  );
}
