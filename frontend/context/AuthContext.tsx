import {useContext, createContext, useEffect, useState} from 'react';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {API_URL} from '../utilities/api';

//Help from https://www.youtube.com/watch?v=9vydY9SDtAo&ab_channel=SimonGrimm

interface AuthProps {
  authState?: {token: string | null; authenticated: boolean | null};
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'token';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      await EncryptedStorage.getItem(TOKEN_KEY).then(token => {
        if (token) {
          setAuthState({token, authenticated: true});
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      });
    };

    loadToken();
  }, []);

  const onRegister = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        email,
        password,
      });
      const {token} = response.data;
      await EncryptedStorage.setItem(TOKEN_KEY, token);
      setAuthState({token, authenticated: true});
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return response.data;
    } catch (error) {
      return {error: true, message: (error as any).response.data.message};
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const {token} = response.data;
      await EncryptedStorage.setItem(TOKEN_KEY, token);
      setAuthState({token, authenticated: true});
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return response.data;
    } catch (error) {
      console.log(error);
      return {error: true, message: (error as any).response.data.message};
    }
  };

  const onLogout = async () => {
    await EncryptedStorage.removeItem(TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    setAuthState({token: null, authenticated: false});
  };

  const authContext = {
    authState,
    onRegister,
    onLogin,
    onLogout,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
