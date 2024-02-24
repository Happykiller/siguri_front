import * as React from 'react';
import { Trans } from 'react-i18next';

import '@presentation/home.scss';
import Bar from '@presentation/bar';
import { Footer } from '@presentation/footer';

export const Home = () => {
  return (
    <div>
      <Bar/>
      <div className="home">
        <div className='title'>
          <Trans>home.title</Trans>
        </div>
      </div>
      <Footer />
    </div>
  )
};