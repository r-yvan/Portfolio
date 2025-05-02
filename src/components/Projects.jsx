import React from "react";
import { IconExternalLink } from "@tabler/icons-react";
import temp from "../assets/temp.jpg";
import upt from "../assets/upt.png";

const Projects = () => {
  const projects = [
    {
      img: {},
      title: "DoBuddy",
      description: "Simple mobile app to track your daily activities ot tasks for your productivity improvement..",
      link: "do-buddy.vercel.app",
    },
    {
      img: {},
      title: "PicDeck",
      description:
        "Modern web app build for artists and other art enthusiasts to visualize their work..",
      link: "pic-deck.vercel.app",
    },
    {
      img: {},
      title: "CompraViva",
      description:
        "Modern ecommerce app that enables you to buy or sell products oline and while at home...",
      link: "compra-viva.vercel.app",
    },
    {
      img: {},
      title: "VistaDash",
      description:
        "Modern beautiful dashboard that provide real time information for proper management..",
      link: "vista-dash.vercel.app",
    },
    {
      img: {},
      title: "NoviumTech",
      description:
        "Website that provide real time information about the outside trending tech gadgets..",
      link: "novium-tech.vercel.app",
    },
    {
      img: {},
      title: "PlanHub",
      description:
        "Website that provide real time information about the outside trending tech gadgets..",
      link: "novium-tech.vercel.app",
    },
    {
      img: {},
      title: "Chatten",
      description:
        "Website that provide real time information about the outside trending tech gadgets..",
      link: "novium-tech.vercel.app",
    },
    {
      img: {},
      title: "DoneWithIt",
      description:
        "Website that provide real time information about the outside trending tech gadgets..",
      link: "novium-tech.vercel.app",
    },
  ];

  return (
    <div className="pb-10 w-full overflow-hidden relative pt-10 bg-[#0a0a0a] text-white z-30">
      <div className="flex spotlight-2 justify-center z-20">
        <h2 className="text-5xl font-bold mb-20 z-20">
          My <span className="text-green-400">Projects</span>
        </h2>
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-row flex-wrap w-[1300px] for-scrollbar gap-5 z-20">
          {projects.map((project, index) => (
            <div
              className="flex flex-col overflow-y-auto w-card flex-shrink-0 for-scrollbar bg-[#151515] backdrop-blur-3xl border border-white border-opacity-10 duration-200 ease-out hover:scale-[1.015] hover:shadow-custom hover:border-green-400 hover:border-opacity-100 rounded-xl pb-2 z-20"
              key={index}
            >
              <div className="w-full rounded-t-xl overflow-hidden mb-2">
                <img src={temp} alt="" />
              </div>
              <div className="flex flex-col h-28 pr-2 pl-2 before:contents-[''] before:absolute before:w-1 before:h-28 before:bg-green-500 before:rounded-full">
                <h3 className="pl-3 text-lg font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="pl-3 text-white text-sm text-opacity-50 mb-3">
                  {project.description}
                </p>
                <div className="pl-3 flex gap-1">
                  <a
                    href={"https://" + project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-white text-opacity-40 text-sm underline hover:text-green-400">
                      {project.link}
                    </span>
                  </a>
                  <IconExternalLink size={20} className="opacity-40" />
                </div>
              </div>
              <div className="absolute right-1 bottom-2 h-28 w-28">
                <img src={upt} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
