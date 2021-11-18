/*
 * forgerock-sample-web-react
 *
 * login.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import BackHome from '../components/utilities/back-home';
import Card from '../components/layout/card';
import { AppContext } from '../global-state';
import KeyIcon from '../components/icons/key-icon';
import { TokenManager, UserManager } from '@forgerock/javascript-sdk';
import Loading from '../components/utilities/loading';
import Alert from '../components/journey/alert';

/**
 * @function Login - React view for Login
 * @returns {Object} - React component object
 */
export default function Login({ location }) {
  const [state, methods] = useContext(AppContext);
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const query = {
    code: searchParams.get('code'),
    state: searchParams.get('state'),
  };

  useEffect(() => {
    async function getTokens() {
      if (!state.isAuthenticated && !query.code) {
        console.log('not authenticated and no code');
        await TokenManager.getTokens({ login: 'redirect' });
      } else if (query.code) {
        console.log('Authenticated and has code');
        await TokenManager.getTokens({ query });
        const user = await UserManager.getCurrentUser();
        methods.setUser(user.name);
        methods.setEmail(user.email);
        methods.setAuthentication(true);
        history.push('/');
      } else {
        console.log('we should redirect to home');
        history.push('/');
      }
    }
    getTokens();
  }, []);

  if (!state.isAuthenticated) {
    return <Loading message='Checking your session ...' />;
  }
  return (
    <div className='cstm_container_v-centered container-fluid d-flex align-items-center'>
      <div className='w-100'>
        <BackHome />
        <Card>
          <div className='cstm_form-icon  align-self-center mb-3'>
            <KeyIcon size='72px' />
          </div>
          <Alert message="Success! You're logged in." type='success' />
        </Card>
      </div>
    </div>
  );
}
