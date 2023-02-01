import {
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';

interface TextAreaProps {
  name: string;
  title: string;
  value: string;
  onChange: (event: any) => void;
  rows: number;
  hasError: boolean;
  errorMsg: string;
  testId: string;
}

const TextArea = ({
  name,
  title,
  value,
  onChange,
  rows,
  hasError,
  errorMsg,
  testId,
}: TextAreaProps) => {
  return (
    <FormControl sx={{ width: '100%' }}>
      <FormGroup>
        <FormLabel htmlFor={name}>{title}</FormLabel>
        <TextField
          multiline
          id={name}
          data-testid={testId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
        />
        {hasError && <Typography sx={{ color: 'red' }}>{errorMsg}</Typography>}
      </FormGroup>
    </FormControl>
  );
};

export default TextArea;
