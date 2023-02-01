import {
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import { forwardRef } from 'react';

interface InputProps {
  name: string;
  value: string;
  title: string;
  placeholder?: string;
  type?: string;
  testId: string;
  onChange: (event: any) => void;
  errorMsg: string;
  hasError?: boolean;
}

const Input = forwardRef(
  (
    {
      name,
      value,
      title,
      placeholder = '',
      type = 'text',
      testId = '',
      errorMsg = '',
      onChange,
      hasError = false,
    }: InputProps,
    ref
  ) => {
    console.log({ hasError, errorMsg, name });
    return (
      <FormControl sx={{ width: '100%', marginBottom: '1rem' }}>
        <FormGroup>
          <FormLabel htmlFor={name}>{title}</FormLabel>
          <TextField
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputProps={{
              'data-testid': testId,
            }}
            inputRef={ref}
            size="small"
          />
          {hasError && (
            <Typography sx={{ color: 'red' }}>{errorMsg}</Typography>
          )}
        </FormGroup>
      </FormControl>
    );
  }
);

export default Input;
