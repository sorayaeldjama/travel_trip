import React from "react";
import Header from "../components/Header";
import plane from "../assets/plane.png";
import forest from "../assets/forest.png";
import montain from "../assets/montain.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-full flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex items-center h-20% lg:h-20% sm:h-10% vm:max-sm:h-10%">
        <img src={plane} alt="Plane" className="ml-60% w-32 h-40% sm:ml-70% sm:w-10% vm:max-sm:w-10%"/>
      </div>
      <div className="flex h-60% flex-row">
        <div className="flex flex-col">
          <div className="flex xl:mr-40% xl:ml-10% lg:mr-40% lg:ml-10% sm:mr-10% sm:ml-10% flex-col vm:max-sm:mr-10%  vm:max-sm:ml-10%">
            <h1 className="text-title font-bold text-3xl vm:max-sm:text-2xl">
              Welcome to Epic road trip
            </h1>
            <p className="mt-10 leading-relaxed text-justify vm:max-lg:text-sm sm:vm:max-sm:mt-6">
              Your ultimate companion for crafting unforgettable journeys ! <br />
              Whether you're dreaming of scaling mountain peaks, cruising
              along coastal roads, or exploring hidden gems off the beaten
              path, our platform empowers you to turn your travel fantasies
              into reality. Embark on a seamless adventure planning experience
              as you create, customize, and discover your perfect route. From
              mapping out scenic routes to uncovering local treasures, Epic
              Road Trip equips you with the tools and inspiration to make
              every mile count. Join our vibrant community of explorers, share
              your experiences, and let the journey begin ! Start your
              adventure today with Epic Road Trip.
            </p>
            <div className="flex justify-end">
              <Link
                to="/trip"
                className="mt-8 pt-8h-5/6 text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-base px-4 py-2 text-center vm:max-sm:mt-4"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-2">Crée mon trajet</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between h-10% flex-row">
        <img src={forest} alt="Forest" className="absolute bottom-0 xl:h-30% lg:w-15% lg:h-20% sm:w-15% sm:h-20% vm:max-sm:w-15% vm:max-sm:h-10%"/>
        <img src={montain} alt="Montain" className="absolute bottom-0 right-0 xl:w-30% xl:h-100% lg:w-30% lg:h-60% sm:w-30% sm:h-30% vm:max-sm:w-30% vm:max-sm:h-20%"/>
      </div>
    </div>
  );
};
                          
export default HomePage;

