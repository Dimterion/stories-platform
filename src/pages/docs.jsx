import { useMetadata } from "../utils/hooks";

export default function DocsPage() {
  useMetadata({
    title: "Stories Platform | Docs",
  });

  return (
    <section className="aboutPage-contentWrapper mx-auto my-10 flex max-w-[1024px] flex-col items-center justify-center gap-8 text-center sm:gap-10"></section>
  );
}
