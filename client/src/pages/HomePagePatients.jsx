import React from "react";
import Navbar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import "../App.css"; // This has fixed background and global styles

const HomePagePatients = () => {
  return (
    <div className="homepage">
      <div className="fixed-background" />
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default HomePagePatients;
