export enum REGEX {
  LOGIN = '^([a-zA-Z]){3,50}$',
  PASSWORD = '^([a-zA-Z0-9@$!%*?&]){3,50}$',
  CHEST_CODE = '^([a-zA-Z0-9])+$',
  CHEST_LABEL = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&\s]){3,50}$',
  CHEST_KEY = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&]){3,50}$',
  CHEST_DESCRIPTION = '^([a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_\\-\\\'\\.\\/+@$!%*?&\s]){3,250}$',
}
