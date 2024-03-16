import * as React from 'react';
import { Trans } from 'react-i18next';
import { TextField } from '@mui/material';

export const Input = (props:any) => {
  const [state, setState] = React.useState(props.entity??{
    value: '',
    valid: false
  });

  const label = <>{props.label??''}{props.require?'*':''}</>;

  const calcValid = (value:string) => {
    let response = true;
    if (props.require && value.length === 0) {
      response = false;
    }

    return response;
  }

  const giveHelper = () => {
    if (props.require && !state.valid) {
      return <Trans>Champs obligatoire</Trans>
    }

    return <></>;
  }

  return (
    <TextField
      label={label}
      variant="standard"
      size="small"
      error={!state.valid}
      value={state.value}
      helperText={giveHelper()}
      onChange={(e) => { 
        e.preventDefault();
        const isValid = calcValid(e.target.value);
        setState({
          value: e.target.value,
          valid: isValid
        });
        if(props.onChange) {
          props.onChange({
            value: e.target.value,
            valid: isValid
          });
        }
      }}
    />
  )
}