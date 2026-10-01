import { Hero } from "@/components/sections/Hero/Hero";
import { Intro } from "@/components/sections/Intro/Intro";
import { Nav } from "@/components/sections/Nav/Nav";
import { Divider } from "@/components/ui/Divider/Divider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Divider />
      </main>
    </>
  );
}
