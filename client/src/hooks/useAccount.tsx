import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContextProvider';

export default function useAccount() {
  const { user } = useContext(GlobalContext).account;
  const isLoggedIn = user !== null && user !== undefined;
  const performAutoSignIn = user === undefined;

  return {
    isLoggedIn,
    performAutoSignIn,
    user,
  };
}
