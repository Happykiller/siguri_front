import * as React from 'react';
import { Trans } from 'react-i18next';

import '@presentation/footer.scss';
import { CODES } from '@src/common/codes';
import { version } from '../../package.json';
import inversify from '@src/common/inversify';
import { SystemInfoUsecaseModel } from '@usecase/system/model/systemInfo.usecase.model';

export const Footer = () => {
  const [backVersion, setBackVersion] = React.useState('Loading...');

  if (backVersion === 'Loading...') {
    inversify.systemInfoUsecase.execute()
      .then((response:SystemInfoUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setBackVersion(response.data.version);
        } else {
          setBackVersion(`Error! ${response.error}`);
        }
      })
      .catch((error:any) => {
        setBackVersion(`Error! ${error}`);
      });
  }

  return (
    <div className='footer'>
      Projet Siguri - <a href="mailto:fabrice.rosito@gmail.com">Envoyer Email</a> - <Trans>footer.version.front</Trans>{version} - <Trans>footer.version.back</Trans>{backVersion} - <a href="https://github.com/Happykiller/seguri_front/issues" target="_blank"><Trans>footer.issues</Trans></a>  - <a href="https://github.com/users/Happykiller/projects/2/views/1" target="_blank"><Trans>footer.roadmap</Trans></a>
    </div>
  )
}