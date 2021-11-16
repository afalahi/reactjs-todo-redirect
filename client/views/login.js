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
import qs from 'qs';
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
  const [_, methods] = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    async function getTokens() {
      if (!_.isAuthenticated && !qs.parse(location.search)['?code']) {
        console.log('not authenticated and no code');
        await TokenManager.getTokens({ login: 'redirect' });
      } else if (qs.parse(location.search)['?code']) {
        console.log('Authenticated and has code');
        await TokenManager.getTokens({
          query: {
            code: qs.parse(location.search)['?code'],
            state: qs.parse(location.search)['state'],
          },
        });
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

  if (!_.isAuthenticated) {
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
