import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import mongo from "../assets/mongo.png";
import montagne from "../assets/montagne.png";
import troisMouettes from "../assets/trois-mouettes.png";

export const SignUpPage = () => {
  return (
    <div className="h-full flex flex-col relative">
      <Header />
      <img
        src={montagne}
        alt="Montagne"
        className="absolute bottom-0 left-0 w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/7 xl:w-1/8 h-auto"
      />
      <div className="flex justify-center items-center mt-8">
        <img src={mongo} alt="Mongo" className="w-24 h-auto" />
      </div>
      <div className="flex justify-end p-4">
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4 mr-10% rounded-lg bg-blue-900 text-white">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Sign up for an account
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 block"
              />
            </div>
            <div className="text-center mb-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-8 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-white">
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src={troisMouettes}
        alt="Trois mouettes"
        className="absolute top-0 left-0 mt-28 ml-8 w-12 h-auto"
      />
      <img
        src={troisMouettes}
        alt="Trois mouettes"
        className="absolute top-0 right-0 mt-24 mr-8 w-12 h-auto"
      />
    </div>
  );
};

export default SignUpPage;
