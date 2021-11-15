/*
 * forgerock-sample-web-react
 *
 * form.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
import { FRAuth } from '@forgerock/javascript-sdk';
import React, { useEffect, useState } from 'react';
import Loading from '../utilities/loading';
import Alert from './alert';
import Password from './password';
import Text from './text';
import Unknown from './unknown';

/**
 * @function Form - React component for managing the user authentication journey
 * @returns {Object} - React component object
 */
export default function Form() {
  const [step, setStep] = useState(null);
  useEffect(() => {
    async function getStep() {
      try {
        const initialStep = await FRAuth.start();
        console.log(initialStep);
        setStep(initialStep);
      } catch (err) {
        console.error(`Error: request for initial step; ${err}`);
      }
    }
    getStep();
  }, []);
  function mapCallbacksToComponents(cb, idx) {
    const name = cb?.payload?.input?.[0].name;
    switch (cb.getType()) {
      case 'NameCallback':
        return <Text callback={cb} inputName={name} key='username' />;
      case 'PasswordCallback':
        return <Password callback={cb} inputName={name} key='password' />;
      default:
        // If current callback is not supported, render a warning message
        return <Unknown callback={cb} key={`unknown-${idx}`} />;
    }
  }
  if (!step) {
    return <Loading message='Checking your session ...' />;
  } else if (step.type === 'Step') {
    return (
      <form
        className='cstm_form'
        onSubmit={event => {
          event.preventDefault();
          async function getStep() {
            try {
              const nextStep = await FRAuth.next(step);
              console.log(nextStep);
              setStep(nextStep);
            } catch (err) {
              console.error(`Error: form submission; ${err}`);
            }
          }
          getStep();
        }}
      >
        {step.callbacks.map(mapCallbacksToComponents)}
        <button className='btn btn-primary w-100' type='submit'>
          Sign In
        </button>
      </form>
    );
  } else {
    return <Alert message={step.payload.message} />;
  }
}
