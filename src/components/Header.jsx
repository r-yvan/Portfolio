import React from "react";
import v1 from "../assets/v-1.png";
import v2 from "../assets/v-2.png";
import v3 from "../assets/v-3.png";
import v4 from "../assets/v-4.png";
import v5 from "../assets/v-5.png";
import background from "../assets/BackgroundImage.png";
import profile from "../assets/anotherMe.png";
import netflixLogo from "../assets/netflix.png";
import googleLogo from "../assets/google.png";
import paypalLogo from "../assets/paypal.png";
import skypeLogo from "../assets/skype.png";
import amazonLogo from "../assets/amazon.png";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";

const Header = () => {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 2]);
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: [100, 0],
        opacity: [0, 1],
        transition: { duration: 1, ease: "easeOut" },
      });
    } else {
      controls.stop();
    }
  }, [controls, inView]);

  return (
    <header className="relative text-white bg-[#050505] bg-cover bg-center font-body pt-6 pb-10">
      <div className="flex justify-center items-center">
        <nav className="fixed py-2 z-50 bg-white bg-opacity-10 mt-2 rounded-full w-fit backdrop-blur-3xl px-10 border border-green-400 border-opacity-30">
          <ul className="flex justify-center items-center space-x-12">
            <li className="duration-300 ease-out hover:text-green-400">Home</li>
            <li className="duration-300 ease-out hover:text-green-400">
              About Me
            </li>
            <li className="duration-300 ease-out hover:text-green-400">
              Education
            </li>
            <li className="duration-300 ease-out hover:text-green-400">
              Skills
            </li>
            <li className="duration-300 ease-out hover:text-green-400">
              Projects
            </li>
          </ul>
        </nav>
      </div>
      <div className="spotlight" ref={ref} animate={controls}>
        <div className="flex flex-col relative px-4 py-40 pb-96 z-10">
          <div className="w-full flex justify-between px-36 pr-56">
            <div className="w-1/3 flex flex-col gap-6 mt-10">
              <div>
                <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                  <p className="font-bold">Hello There, I' m</p>
                </div>
                <div>
                  <p className="font-bold text-3xl">Rubuto</p>
                  <p className="font-bold text-green-400 text-2xl">Yvan</p>
                </div>
              </div>
              <div>
                <p className="w-2/3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem totam adipisci dolor? Laboriosam eligendi vel dolorum,
                  fuga non pariatur quae?
                </p>
                <button className="font-bold text-green-400 border border-green-400 px-10 py-3 rounded-2xl">
                  Contact Me
                </button>
              </div>
              <div>
                <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                  <p className="font-bold">My Social Media</p>
                </div>
                <div className="flex flex-row">
                  <div className="px-3 border-r border-green-400">
                    <p>LinkedIn</p>
                  </div>
                  <div className="px-3 border-r border-green-400">
                    <p>Facebook</p>
                  </div>
                  <div className="px-3">
                    <p>Instagram</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[500px] h-[500px] absolute right-[43%] top-[40] rounded-full bg-green-400"></div>
            <img
              src={profile}
              alt=""
              className="w-[500px] absolute h-auto top-54 right-[43%]"
            />
            <img
              src={v5}
              alt=""
              className="absolute right-[300px] w-80 h-7 top-[245px]"
            />
            <img
              src={v2}
              alt=""
              className="absolute left-10 top-[200px] w-16 h-auto"
            />
            <img
              src={v4}
              alt=""
              className="absolute left-[90px] top-[420px] w-[300px] opacity-50 h-auto"
            />
            <div className="flex flex-col gap-40 w-1/3 mt-20">
              <div className="flex flex-col gap-10">
                <div>
                  <p className="font-bold text-green-400 text-3xl">
                    UI/UX Designer,{" "}
                  </p>
                  <p className="font-bold text-5xl">Frontend Developer</p>
                </div>
                <div>
                  <p className="w-4/5 opacity-80">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Commodi accusamus aut aliquid exercitationem in, minus neque
                    architecto omnis totam pariatur repellat amet aliquam.
                    Aperiam nesciunt obcaecati non.
                  </p>
                </div>
                <div>
                  <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                    <p className="font-bold">Discover my</p>
                  </div>
                  <div className="flex flex-row">
                    <div className="px-3 border-r border-green-400">
                      <p>Skills</p>
                    </div>
                    <div className="px-3 border-r border-green-400">
                      <p>Art</p>
                    </div>
                    <div className="px-3">
                      <p>Experience</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/5 pl-5 border-l border-green-400 ml-32">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Fugiat similique quod, cum repudiandae quisquam laborum eaque
                  modi architecto at vel beatae. Non deserunt laudantium
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-5 falling-text">
          <div className="flex justify-center items-center flex-col w-52 h-52 border border-gray-400 px-5 py-5 bg-white bg-opacity-15 backdrop-filter backdrop-blur-3xl rounded-2xl duration-200 hover:scale-95 hover:border-green-400">
            <h1 className="text-6xl items-center text-green-400">1+</h1>
            <p className="opacity-70 font-light pt-3">Years</p>
            <p>Experience</p>
          </div>
          <div className="flex justify-center flex-col items-center w-52 h-52 border px-5 py-5 bg-white bg-opacity-15 backdrop-filter backdrop-blur-3xl rounded-2xl border-gray-400 duration-200 hover:scale-95 hover:border-green-400">
            <h1 className="text-6xl items-center text-green-400">21+</h1>
            <p className="opacity-70 font-light pt-3">Github</p>
            <p className="font-bold">Repositories</p>
          </div>
          <div className="flex justify-center flex-col items-center w-52 h-52 border px-5 py-5 bg-white bg-opacity-15 backdrop-filter backdrop-blur-3xl rounded-2xl border-gray-400 duration-200 hover:scale-95 hover:border-green-400">
            <h1 className="text-6xl items-center text-green-400">71+</h1>
            <p className="opacity-70 font-light pt-3">Friendly</p>
            <p className="font-bold">Connections</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
