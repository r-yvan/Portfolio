import React from "react";
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
        <div className="flex flex-col relative px-4 pt-10 pb-10 z-10">
          <div className="w-full flex justify-between px-10">
            <div className="w-1/3 gap-2">
              <div className="px-3 py-2 bg-[#202020] w-fit rounded-xl">
                <p className="font-bold">Hello There, I' m</p>
              </div>
              <div>
                <p className="font-bold">Rubuto</p>
                <p className="font-bold text-green-400">Yvan</p>
              </div>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                totam adipisci dolor? Laboriosam eligendi vel dolorum, fuga non
                pariatur quae?
              </p>
              <button>Contact Me</button>
              <div>
                <p>My Social Media</p>
              </div>
              <div></div>
              <div></div>
            </div>
            <div className="w-1/3">
              <div>
                <p>UI/UX Designer</p>
                <p>Frontend Developer</p>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi accusamus aut aliquid exercitationem in, minus neque
                  architecto omnis totam pariatur repellat amet aliquam. Aperiam
                  nesciunt obcaecati non. Asperiores veniam omnis vel, officiis
                  similique suscipit, ducimus pariatur praesentium totam quis
                  dolores?
                </p>
                <div></div>
              </div>
              <div></div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-8 falling-text">
            <img src={netflixLogo} alt="Netflix" className="h-8" />
            <img src={googleLogo} alt="Google" className="h-8" />
            <img src={paypalLogo} alt="PayPal" className="h-8" />
            <img src={skypeLogo} alt="Skype" className="h-8" />
            <img src={amazonLogo} alt="Amazon" className="h-8" />
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
