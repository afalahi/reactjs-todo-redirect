/*
 * forgerock-sample-web-react
 *
 * login.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
import { FRUser } from '@forgerock/javascript-sdk';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../components/utilities/loading';
import { AppContext } from '../global-state';

/**
 * @function Logout - React view for Logout
 * @returns {Object} - React component object
 */
export default function Logout() {
  const [_, { setAuthentication, setEmail, setUser }] = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    async function logout() {
      try {
        await FRUser.logout();

        setAuthentication(false);
        setEmail('');
        setUser('');

        history.push('/');
      } catch (error) {
        console.error(`Error: logout; ${error}`);
      }
    }
    logout();
  }, []);

  return <Loading classes='pt-5' message="You're being logged out ..." />;
}
