import { Hero } from "@/components/sections/Hero/Hero";
import { Intro } from "@/components/sections/Intro/Intro";
import { Markets } from "@/components/sections/Markets/Markets";
import { Nav } from "@/components/sections/Nav/Nav";
import { Technology } from "@/components/sections/Technology/Technology";
import { Divider } from "@/components/ui/Divider/Divider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Divider />
        <Technology />
        <Divider />
        <Markets />
        <Divider />
      </main>
    </>
  );
}
