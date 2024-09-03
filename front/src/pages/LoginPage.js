import React, { useState } from "react";
import Header from "../components/Header";
import mongo from "../assets/mongo.png";
import montagne from "../assets/montagne.png";
import troisMouettes from "../assets/trois-mouettes.png";

import { Link, Navigate   } from "react-router-dom"; 
import { login } from "../utils/AuthHelper"

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  
  /**
   * Sousmission du formulaire
   * @param {*} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {loggedIn && <Navigate  to="/" />}
      <Header />
      <img
        src={montagne}
        alt="Montagne"
        className="absolute bottom-0 left-0 w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/7 xl:w-1/8 h-auto"
      />
      <div className="flex justify-center items-center mt-8">
        <img src={mongo} alt="Mongo" className="w-24 h-auto" />
      </div>
      <div className="flex justify-end vm:max-md:justify-center item-center p-4">
        <div className="w-full sm:w-1/3 lg:w-1/4 vm:max-sm:w-80% sm:max-md:w-50% p-4 sm:mr-10% rounded-lg bg-blue-900 text-white">
          <h2 className="text-lg font-semibold mb-4 text-center">Login to your account</h2>
          <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 p-2 w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1 p-2 w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-700 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Login
              </button>
            </div>
          </form>
          <p className="mt-4 mb-8 text-sm text-center">
            Don't have an account ?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign up
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

export default LoginPage;

