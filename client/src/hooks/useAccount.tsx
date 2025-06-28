import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContextProvider';

export default function useAccount() {
  const { user } = useContext(GlobalContext).account;
  const isLoggedIn = user !== null;

  return {
    isLoggedIn,
    user,
  };
}
