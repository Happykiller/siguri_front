import * as React from 'react';
import { Trans } from 'react-i18next';

import '@presentation/common.scss';
import Bar from '@presentation/bar';
import { Footer } from '@presentation/footer';

export const Bank = () => {
  return (
    <div>
      <Bar/>
      <div className="container">
        <div className='title'>
          <Trans>bank.title</Trans>
        </div>
      </div>
      <Footer />
    </div>
  )
};