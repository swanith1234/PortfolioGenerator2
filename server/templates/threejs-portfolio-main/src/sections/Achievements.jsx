import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper";

const Achievements = ({ userData }) => {
  const achievements = userData?.achievements || [];

  return (
    <section className="c-space my-20">
      <p className="head-text text-center text-3xl font-bold">
        My Achievements
      </p>
      <div className="container mt-12">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          autoplay={{
            delay: 3000, // Auto-slide delay in milliseconds
            disableOnInteraction: false, // Keeps autoplay even when user interacts
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          {achievements.map((achievement, index) => (
            <SwiperSlide key={index}>
              <div className="achievement-card">
                <div className="achievement-card-content">
                  <p className="text-white text-xl font-bold">
                    {achievement.title}
                  </p>
                  <p className="text-white mt-2">{achievement.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </Swiper>
      </div>

      {/* Styles */}
      <style jsx>{`
        .achievement-card {
          background: #1e293b;
          color: #fff;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          word-wrap: break-word;
          width: 100%;
          height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .achievement-card-content {
          overflow-y: auto;
          max-height: 100%;
          padding-right: 10px;
          width: 100%;
        }

        .achievement-card::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        .achievement-card::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        .achievement-card-content::-webkit-scrollbar {
          width: 0;
          display: none;
        }

        .swiper_container {
          height: 32rem;
          padding: 2rem 0;
          position: relative;
        }

        .swiper-slide {
          width: 37rem;
          height: fit-content !important;
          position: relative;
        }

        @media (max-width: 500px) {
          .swiper_container {
            height: 47rem;
          }
          .swiper-slide {
            width: 28rem !important;
            height: fit-content !important;
          }
          .swiper-slide .achievement-card {
            width: 28rem !important;
            height: 36rem !important;
          }
        }

        .swiper-slide img {
          width: 37rem;
          height: 42rem;
          border-radius: 2rem;
          object-fit: cover;
        }

        .slider-controler {
          position: relative;
          bottom: -3rem !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slider-controler .swiper-button-next {
          left: 58% !important;
          transform: translateX(-58%) !important;
        }

        @media (max-width: 990px) {
          .slider-controler .swiper-button-next {
            left: 70% !important;
            transform: translateX(-70%) !important;
          }
        }

        @media (max-width: 450px) {
          .slider-controler .swiper-button-next {
            left: 80% !important;
            transform: translateX(-80%) !important;
          }
        }

        @media (max-width: 990px) {
          .slider-controler .swiper-button-prev {
            left: 30% !important;
            transform: translateX(-30%) !important;
          }
        }

        @media (max-width: 450px) {
          .slider-controler .swiper-button-prev {
            left: 20% !important;
            transform: translateX(-20%) !important;
          }
        }

        .slider-controler .slider-arrow {
          background: var(--white);
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          left: 42%;
          transform: translateX(-42%);
          filter: drop-shadow(0px 8px 24px rgba(18, 28, 53, 0.1));
        }

        .slider-controler .slider-arrow ion-icon {
          font-size: 2rem;
          color: #222224;
        }

        .slider-controler .slider-arrow::after {
          content: "";
        }

        .swiper-pagination {
          position: relative;
          width: 15rem !important;
          bottom: 1rem;
        }
        .swiper-wrapper {
          height: fit-content !important;
        }
        .swiper-pagination .swiper-pagination-bullet {
          filter: drop-shadow(0px 8px 24px rgba(18, 28, 53, 0.1));
        }

        .swiper-pagination .swiper-pagination-bullet-active {
          background: var(--primary);
        }
      `}</style>
    </section>
  );
};

export default Achievements;
