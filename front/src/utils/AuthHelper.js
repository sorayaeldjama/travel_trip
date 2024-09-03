import axios from 'axios';
import apiUrl from "../config";

/**
 * Fonction de connexion de l'utilisateur
 * @param email 
 * @param password 
 * @returns 
 */
const login = async (email, password) => {
  try {
    const response = await axios.post(apiUrl + '/users/login', {
      mail: email,
      password: password
    });
    const { token, user_id } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);

    console.log(token);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    throw error;
  }
};

/**
 * Fonction de déconnexion de l'utilisateur
 */
const logout = () => {
  localStorage.removeItem('token');
};

export { login, logout };
