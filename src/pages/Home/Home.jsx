import Navbar from "../../components/basic/navbar/navbar";

import React from "react";
import HeroSection from "../../components/home/hero/hero";
import AboutSection from "../../components/home/about/about";
import Service from "../../components/home/services/services";
import Footer from "../../components/basic/footer/footer";
import JoinUsSection from "../../components/home/joinus/Joinus";

const Home = () => {
  return (
    <>
      <header className="contanier">
        <Navbar />
      </header>
      <HeroSection />
      <AboutSection />
      <Service />
      <JoinUsSection />
      <Footer />
    </>
  );
};

export default Home;
