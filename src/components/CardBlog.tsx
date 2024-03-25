import { Bookmark, Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

type CardBlogProps = ({}: {}) => JSX.Element;
const CardBlog: CardBlogProps = () => {
  return (
    <div className=" bg-white rounded-xl p-4 shadow-xl transition-transform ease-linear duration-300 hover:scale-105">
      <Image
        src="/imageSlider.jfif"
        width={500}
        height={500}
        alt="imageSlider"
        className="rounded-md"
      />
      <div className=" text-black mt-4">
        <div className="flex items-center justify-between font-bold">
          <span>اسم وبلاگ</span>
          <div className="flex">
            <Bookmark />
            <Heart />
          </div>
        </div>
        <span className="text-justify text-sm inline-block whitespace-normal mt-2">
          لورم ایپسوم متن ساختگی با تولید سادگی نا مفهوم از صنعت چاپ و با
          استفاده از طراحان گرافیک است
        </span>
      </div>
    </div>
  );
};

export default CardBlog;
