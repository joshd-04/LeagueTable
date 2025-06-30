import { GlobalContext } from '@/context/GlobalContextProvider';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useContext, useEffect } from 'react';
import Heading1 from '../text/Heading1';
import Logo from '../logo/logo';
import Paragraph from '../text/Paragraph';

export default function AutoSignIn() {
  const context = useContext(GlobalContext);
  const { setUser } = context.account;
  const { setError } = context.errors;

  useEffect(() => {
    async function doFetch() {
      const response = await fetchAPI(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.statusCode === 401) {
        setUser(null);
      } else if (response.status === 'success') {
        setUser({
          id: response.data._id,
          username: response.data.username,
          email: response.data.email,
          accountType: response.data.accountType,
        });
      } else {
        setError(response.data.message || response.message);
        setUser(null);
      }
    }

    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center">
      <Logo />
      <Paragraph>Loading..</Paragraph>
    </div>
  );
}
