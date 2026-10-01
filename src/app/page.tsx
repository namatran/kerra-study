import { Contact } from "@/components/sections/Contact/Contact";
import { Footer } from "@/components/sections/Footer/Footer";
import { Hero } from "@/components/sections/Hero/Hero";
import { Intro } from "@/components/sections/Intro/Intro";
import { Markets } from "@/components/sections/Markets/Markets";
import { Nav } from "@/components/sections/Nav/Nav";
import { Preloader } from "@/components/sections/Preloader/Preloader";
import { Sustainability } from "@/components/sections/Sustainability/Sustainability";
import { Technology } from "@/components/sections/Technology/Technology";
import { Why } from "@/components/sections/Why/Why";
import { Divider } from "@/components/ui/Divider/Divider";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Divider />
        <Technology />
        <Divider />
        <Markets />
        <Divider />
        <Why />
        <Divider />
        <Sustainability />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
