/*
 * forgerock-sample-web-react
 *
 * login.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import React, { useContext, useEffect, useState } from 'react';
import qs from 'qs';
import { useHistory } from 'react-router';
// import { Link } from 'react-router-dom';
import BackHome from '../components/utilities/back-home';
import Card from '../components/layout/card';
import { AppContext } from '../global-state';
import KeyIcon from '../components/icons/key-icon';
// import Form from '../components/journey/form';
import {
  TokenManager,
  TokenStorage,
  UserManager,
} from '@forgerock/javascript-sdk';
import Loading from '../components/utilities/loading';
import Alert from '../components/journey/alert';

/**
 * @function Login - React view for Login
 * @returns {Object} - React component object
 */
export default function Login({ location }) {
  // const [state] = useContext(AppContext);
  const [code, setCode] = useState('');
  const [token, setToken] = useState(null);
  const [isAuthenticated, setAuthentication] = useState(false);
  const [_, methods] = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    async function getTokens() {
      setCode(qs.parse(location.search)['?code']);
      const initToken = await TokenStorage.get();
      setToken(initToken);
      if (!token && !code) {
        await TokenManager.getTokens({ login: 'redirect' });
      } else if (code) {
        await TokenManager.getTokens({
          query: {
            code: code,
            state: qs.parse(location.search)['state'],
          },
        });
        setToken(await TokenStorage.get());
        setAuthentication(true);
        const user = await UserManager.getCurrentUser();
        methods.setUser(user.name);
        methods.setEmail(user.email);
        methods.setAuthentication(true);
        history.push('/');
      }
    }
    getTokens();
  }, [code]);

  if (!isAuthenticated) {
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

  // <div className="cstm_container_v-centered container-fluid d-flex align-items-center">
  //   <div className="w-100">
  //     <BackHome />
  //     <Card>
  //       <div className="cstm_form-icon  align-self-center mb-3">
  //         <KeyIcon size="72px" />
  //       </div>
  //       <Form
  //         action={{ type: 'login' }}
  //         bottomMessage={
  //           <p
  //             className={`text-center text-secondary p-3 ${state.theme.textClass}`}
  //           >
  //             Don’t have an account? <Link to="/register">Sign up here!</Link>
  //           </p>
  //         }
  //       />
  //     </Card>
  //   </div>
  // </div>
}
