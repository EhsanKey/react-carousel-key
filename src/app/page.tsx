import CardBlog from "@/components/CardBlog";
import Carousel from "@/components/Carousel";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Carousel>
        <CardBlog />
        <CardBlog />
        <CardBlog />
        <CardBlog />
        <CardBlog />
      </Carousel>
    </main>
  );
}
