import React from "react";
import v1 from "../assets/v-1.png";
import v2 from "../assets/v-2.png";
import v3 from "../assets/v-3.png";
import v4 from "../assets/v-4.png";
import v5 from "../assets/v-5.png";
import profile from "../assets/anotherMe.png";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandSupabase,
  IconBrush,
  IconCrown,
} from "@tabler/icons-react";

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
                  <p className="font-bold text-2xl leading-none tracking-tighter">
                    Rubuto{" "}
                    <span className="font-bold text-green-400 tracking-tighter text-3xl">
                      Yvan<span className="text-4xl text-white">.</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="w-4/5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem totam adipisci dolor? Laboriosam eligendi vel dolorum,
                  fuga non pariatur quae?
                </p>
                <button className="font-bold text-green-400 border-2 border-green-400 w-fit px-10 py-3 rounded-2xl">
                  Contact Me
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                  <p className="font-bold">My Social Media</p>
                </div>
                <div className="flex flex-row">
                  <div className="flex flex-row gap-1 pr-3 border-r-2 border-green-400">
                    <IconBrandLinkedin size={24} color="#4ade80" />
                    <p className="font-bold">LinkedIn</p>
                  </div>
                  <div className="flex flex-row gap-1 px-3 border-r-2 border-green-400">
                    <IconBrandFacebook size={24} color="#4ade80" />
                    <p className="font-bold">Facebook</p>
                  </div>
                  <div className="flex flex-row gap-1 px-3">
                    <IconBrandInstagram size={24} color="#4ade80" />
                    <p className="font-bold">Instagram</p>
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
            <div className="flex flex-col gap-40 w-1/3">
              <div className="flex flex-col gap-10">
                <div>
                  <p className="font-bold text-green-400 text-3xl">
                    UI/UX Designer,{" "}
                  </p>
                  <p className="font-bold text-5xl">Frontend Developer</p>
                </div>
                <div>
                  <p className="w-4/5 opacity-80 tracking-tight">
                    I'm a passionate frontend developer based in Kigali, Rwanda,
                    with a strong foundation in building dynamic and responsive
                    web applications. My expertise lies in leveraging modern
                    JavaScript frameworks and tools to create seamless user
                    experiences
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                    <p className="font-bold">Discover my</p>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-row gap-1 pr-5 border-r-2 border-green-400">
                      <IconBrandSupabase size={24} color="#4ade80" />
                      <p className="font-bold">Skills</p>
                    </div>
                    <div className="flex flex-row gap-1 px-5 border-r-2 border-green-400">
                      <IconBrush size={24} color="#4ade80" />
                      <p className="font-bold">Art</p>
                    </div>
                    <div className="flex flex-row gap-1 px-5">
                      <IconCrown size={24} color="#4ade80" />
                      <p className="font-bold">Experience</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/5 pl-5 border-l-2 border-green-400 ml-32">
                <p className="opacity-80">
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
