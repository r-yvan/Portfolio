import React from "react";
import Header from "./components/Header";
import Contact from "./components/Contact";
import About from "./components/About";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Clients from "./components/Clients";
import "./styles/index.css";

const App = () => {
  return (
    <div className="overflow-x-hidden font-body">
      <Header />
      {/* <About />
      <Education />
      <Skills />
      <Projects />
      <Clients />
      <Contact /> */}
    </div>
  );
};

export default App;
