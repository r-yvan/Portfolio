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
      <div ref={ref} animate={controls}>
        <div className="flex flex-col relative px-4 py-40 pb-96 z-10">
          <div className="w-full flex justify-between px-28 pl-32">
            <div className="w-1/3 flex flex-col gap-6 mt-16">
              <div>
                <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                  <p className="font-bold">Hello There, I' m</p>
                </div>
                <div>
                  <p className="font-bold text-3xl">Rubuto</p>
                  <p className="font-bold text-green-400 text-2xl">Yvan</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="w-4/5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem totam adipisci dolor? Laboriosam eligendi vel dolorum,
                  fuga non pariatur quae?
                </p>
                <button className="font-bold text-green-400 border border-green-400 w-fit px-10 py-3 rounded-2xl">
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
            <div className="w-[550px] h-[550px] absolute right-[40%] top-[40] rounded-full p-5 bg-green-400">
              <div className="w-full h-full bg-green-400 border-[15px] border-[#0A0A0A] rounded-full"></div>
            </div>
            <img
              src={profile}
              alt=""
              className="w-[500px] absolute h-auto top-56 right-[40%] bg-gradient-to-b from-inherit to-slate-700"
            />
            <img
              src={v5}
              alt=""
              className="absolute right-[350px] w-80 h-7 top-[245px]"
            />
            <img
              src={v2}
              alt=""
              className="absolute left-[60px] top-[250px] w-14 rotate-[5deg] h-[70px]"
            />
            <img
              src={v3}
              alt=""
              className="absolute left-[170px] rotate-[3deg] top-[590px] w-48 h-auto"
            />
            <div className="flex flex-col gap-40 w-1/3">
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
      </div>
    </header>
  );
};

export default Header;
