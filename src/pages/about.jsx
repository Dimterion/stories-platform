import { BookOpenCheck, ExternalLink, House, Pencil } from "lucide-react";
import { useMetadata } from "../utils/hooks";
import PageLink from "../components/ui/PageLink";
import ExternalPageLink from "../components/ui/ExternalPageLink";

export default function AboutPage() {
  useMetadata({
    title: "Stories Platform | About",
  });

  return (
    <section className="aboutPage-contentWrapper mx-auto my-10 flex max-w-[1024px] flex-col items-center justify-center gap-8 text-center sm:gap-10">
      <h2 className="text-2xl italic sm:text-4xl">
        Interactive Stories Platform
      </h2>
      <p className="text-xl">
        A platform to create interactive stories with multiple choices and
        outcomes.
      </p>
      <section className="w-sm max-w-[80vw] space-y-6">
        <PageLink link="" icon={<House />} text="Home page" />
        <PageLink link="story-editor" icon={<Pencil />} text="Start creating" />
        <PageLink
          link="story-player"
          icon={<BookOpenCheck />}
          text="Start playing"
        />
      </section>
      <h3 className="text-xl font-bold">Learn more about the project</h3>
      <section className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
        <p>
          Visit the project's GitHub repository for more information and
          updates:
        </p>
        <ExternalPageLink
          link="https://github.com/Dimterion/stories-platform"
          icon={<ExternalLink className="size-4 shrink-0" />}
          text="GitHub repo"
        />
      </section>
      {/* <p>
        I've written a series of articles about working on this project and
        developing its design and main features:
      </p>
      <section className="flex flex-wrap justify-center gap-10">
        <article className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
          <p>
            I've described the project, its main purpose, features, and
            functionality in the following article:
          </p>
          <a
            href="https://medium.com/@dimterion/text-adventure-games-creation-tool-385667ac8904"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-center gap-1 border p-2"
          >
            Creating the platform
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </article>
        <article className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
          <p>
            In this article I've talked about my approach to developing the
            project and adding new features:
          </p>
          <a
            href="https://medium.com/@dimterion/text-adventure-games-creation-tool-progress-update-4e2bd0524d03"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-center gap-1 border p-2"
          >
            Progress update (1)
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </article>
        <article className="border-darkBlue bg-softWhite text-deepBlue flex w-full max-w-[300px] flex-col items-center justify-center gap-2 border p-4">
          <p>
            After creating a new design for the project I've described the
            process of implementing it in this article:
          </p>
          <a
            href="https://medium.com/@dimterion/text-adventure-games-creation-tool-new-progress-update-01f7561a7cd4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-softWhite hover:text-deepBlue bg-darkBlue text-softWhite inline-flex w-full items-center justify-center gap-1 border p-2"
          >
            Progress update (2)
            <ExternalLink className="size-4 shrink-0" />
          </a>
        </article>
      </section> */}
      <h3 className="text-xl font-bold">Questions or feedback?</h3>
      <section className="mx-2 flex flex-wrap items-center gap-4">
        <ExternalPageLink
          link="https://linktr.ee/dimterion"
          icon={<ExternalLink className="size-4 shrink-0" />}
          text="Profile links"
        />
        <ExternalPageLink
          link="https://www.dimterion.com"
          icon={<ExternalLink className="size-4 shrink-0" />}
          text="My main site"
        />
      </section>
      <h3 className="text-xl font-bold">Other related projects</h3>
      <p>I have also made a couple of interactive text adventure games:</p>
      <section className="flex flex-col gap-4">
        <ExternalPageLink
          link="https://poets-of-tomorrows-world.vercel.app"
          icon={<ExternalLink className="size-4 shrink-0" />}
          text="Poets of Tomorrow’s World"
        />
        <ExternalPageLink
          link="https://profound-cat-a609de.netlify.app"
          icon={<ExternalLink className="size-4 shrink-0" />}
          text="Poets of Tomorrow’s World: gameOn(e)"
        />
      </section>
    </section>
  );
}
