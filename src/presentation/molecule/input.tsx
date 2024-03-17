import * as React from 'react';
import { Trans } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';

export const Input = (props:any) => {
  const [state, setState] = React.useState(props.entity??{
    value: '',
    valid: false
  });
  const [passVisible, setPassVisible] = React.useState(false);

  const label = <>{props.label??''}{props.require?'*':''}</>;

  const typeBase = (props.type??'text');

  let tooltip = null;
  if (props.tooltip) {
    tooltip = <InputAdornment
      position="end"
    >
      <Tooltip title={props.tooltip}>
        <IconButton><InfoIcon/></IconButton>
      </Tooltip>
    </InputAdornment>
  }

  const calcValid = (value:string) => {
    let response = true;
    if (props.require && value.length === 0) {
      response = false;
    } else if (props.regex) {
      const regex = new RegExp(props.regex, 'g');
      response = (!!value.match(regex));
    }

    return response;
  }

  const giveHelper = () => {
    if (props.require && !state.valid) {
      return <Trans>Champs obligatoire</Trans>
    }

    return null;
  }

  if (props.type === 'password') {
    return (
      <TextField
        label={label}
        variant="standard"
        size="small"
        autoComplete='false'
        type={(passVisible)?'text':'password'}
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
        InputProps={{
          endAdornment: (
            <InputAdornment 
              position="end"
            >
              <IconButton
                onClick={(e) => { 
                  e.preventDefault();
                  setPassVisible(!passVisible);
                }}
              >
                {(passVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
              </IconButton>
              {(props.tooltip)?(
                <Tooltip title={props.tooltip}>
                  <IconButton><InfoIcon/></IconButton>
                </Tooltip>
              ):null}
            </InputAdornment>
          ),
        }}
      />
    )
  } else {
    return (
      <TextField
        label={label}
        variant="standard"
        size="small"
        autoComplete='false'
        type={typeBase}
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
        InputProps={{
          endAdornment: (tooltip)
        }}
      />
    )
  }

  
}