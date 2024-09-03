import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../utils/AuthHelper"

const Header = () => {
  const location = useLocation();

  /**
   * @returns Etat de connexion de l'utilisateur 
   */
  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  /**
   * Boolean qui permet de savoir si on se trouve ou non sur la page de connexion
   */
  const isLoginPage = location.pathname === "/login";

  /**
   * Génération du bouton de navigation de l'entête
   * @returns Boutton de navigation
   */
  const renderButton = () => {
    if (isLoginPage) {
      return (
        <Link to="/" className="mr-8 flex items-center justify-center h-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-base px-4 py-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="ml-2">Retour</span>
        </Link>
      );
    } else if(isLoggedIn()){
      return (
        <Link to="/" onClick={() => logout()()}  className="mr-8 flex items-center justify-center h-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-base px-4 py-2">
          <FontAwesomeIcon icon={faRightToBracket} />
          <span className="ml-2">Déconnexion</span>
        </Link>
      );
    } else {
      return (
        <Link to="/login" className="mr-8 flex items-center justify-center h-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-base px-4 py-2">
          <FontAwesomeIcon icon={faRightToBracket} />
          <span className="ml-2">Se connecter</span>
        </Link>
      );
    }
  };

  return (
    <nav className="h-10%">
      <div className="pt-5 ml-12 flex justify-between p-4">
        <img src={logo} className="h-12" alt="Flowbite Logo" />
        <div className="flex items-center">{renderButton()}</div>
      </div>
    </nav>
  );
};

export default Header;
