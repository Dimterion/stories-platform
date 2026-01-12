export default function Instructions() {
  return (
    <section className="space-y-4">
      <h3 className="text-center text-xl font-bold">Instructions</h3>
      <article>
        <p>
          Use <strong>Story Player</strong> to read/play through the interactive
          stories.
        </p>
        <ul className="list-disc space-y-1 pt-2 pl-5">
          <li>Upload your own stories in JSON format.</li>
          <li>Navigate through the stories by choosing various options.</li>
          <li>Progress is saved locally in your current browser.</li>
          <li>Clear and reset progress to start over.</li>
        </ul>
      </article>
      <article>
        <p>
          Use <strong>Story Editor</strong> to create interactive stories.
        </p>
        <ul className="list-disc space-y-1 pt-2 pl-5">
          <li>Upload your own stories in JSON format.</li>
          <li>Download created stories in HTML or JSON format.</li>
          <li>Progress is saved locally in your current browser.</li>
          <li>Clear and reset progress to start over.</li>
          <li>
            Review your stories structure by using{" "}
            <strong>Story diagram</strong> functionality.
          </li>
          <li>Download your stories diagrams in SVG or PNG format.</li>
        </ul>
      </article>
      <h3 className="text-center text-lg font-semibold">
        Questions or feedback?
      </h3>
      <article className="mx-2 flex flex-wrap justify-around">
        <a
          href="https://linktr.ee/dimterion"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          Profile links
        </a>
        <a
          href="https://www.dimterion.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lightBlue underline"
        >
          My main site
        </a>
      </article>
    </section>
  );
}
