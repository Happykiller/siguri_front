import * as React from 'react';
import { Trans } from 'react-i18next';

import '@presentation/footer.scss';
import { version } from '../../package.json';

export const Footer = () => {
  let backVersion = '0.42.0';

  return (
    <div className='footer'>
      Projet Siguri - <a href="mailto:fabrice.rosito@gmail.com">Envoyer Email</a> - <Trans>footer.version.front</Trans>{version} - <Trans>footer.version.back</Trans>{backVersion} - <a href="https://github.com/Happykiller/seguri_front/issues" target="_blank"><Trans>footer.issues</Trans></a>  - <a href="https://github.com/users/Happykiller/projects/2/views/1" target="_blank"><Trans>footer.roadmap</Trans></a>
    </div>
  )
}