export enum REGEX {
  LOGIN = '^([a-zA-Z]){3,50}$',
  PASSWORD = '^([a-zA-Z0-9@$!%*?&]){3,50}$',
  CHEST_CODE = '^([a-zA-Z0-9])+$',
  CHEST_LABEL = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){3,50}$',
  CHEST_KEY = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"]){3,50}$',
  CHEST_DESCRIPTION = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){3,250}$',
  THING_LABEL = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){3,50}$',
  THING_DESCRIPTION = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){3,250}$',
  THING_CODE = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){3,250}$',
  THING_NOTE = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s\r\n|\r|\n]){3,500}$',
  THING_TOTP = '^[A-Za-z2-7]{3,50}$',
  THING_LOGIN = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){1,250}$',
  THING_PASSWORD = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&#"\s]){1,250}$',
  THING_ADDRESS = '^([a-zA-Z0-9_\\-\\.\\/+@$!%*?&#]){3,250}$',
  THING_CB_NUMBER = '^([0-9\s]){12,20}$',
  THING_CB_CODE = '^([0-9]){4}$',
  THING_CB_CRYPTO = '^([0-9]){3}$',
  THING_CB_NAME = '^([a-zA-Z\s]){3,50}$',
  THING_CB_EXPIRATION_DATE = '^([0-9\/\\-\s]){4-5}$'
}
