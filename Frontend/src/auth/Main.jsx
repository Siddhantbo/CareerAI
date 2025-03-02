import React from "react";
import { Outlet } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";

const Main = () => {
  return (
    <div className="flex w-full bg-gray-100">
      <img src="/assets/logo-light.png" className="absolute m-5" alt="Logo" />

      <div className="w-1/2 hidden lg:flex flex-col justify-center items-center">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet", 
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active", 
          }}
          className="w-full"
        >
          <SwiperSlide>
            <img
              src="/assets/login-side1.png"
              alt="Background 1"
              className="object-cover mx-auto w-2/4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/assets/login-side2.png"
              alt="Background 2"
              className="object-cover mx-auto w-2/4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/assets/login-side3.png"
              alt="Background 3"
              className="object-cover mx-auto w-2/4"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Content Section */}
      <div
        className="flex lg:w-1/2 w-full px-4 sm:px-6 md:px-8 lg:px-12 bg-white"
        style={{
          backgroundImage: `url('./assets/1519804675919.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full min-h-screen flex mx-auto justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
