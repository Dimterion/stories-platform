export default function Instructions() {
  return (
    <section className="space-y-4">
      <h3 className="text-center text-xl font-bold">Instructions</h3>
      <p>
        Use <strong>Story Player</strong> to read/play through the interactive
        stories (upload your own stories in JSON format).
      </p>
      <p>
        Use <strong>Story Editor</strong> to create interactive stories (upload
        your own stories in JSON format, or download created stories in HTML or
        JSON format).
      </p>
      <p>
        Review your stories structure in <strong>Story Editor</strong> by using{" "}
        <strong>Story diagram</strong> functionality (download your stories
        diagrams in SVG or PNG format).
      </p>
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
