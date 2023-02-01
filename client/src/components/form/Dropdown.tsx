import {
  FormControl,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

interface DropdownProps {
  name: string;
  title: string;
  value: string;
  onChange: (event: any) => void;

  testId: string;
  options: { id: string; value: string }[];
  hasError: boolean;
  errorMsg: string;
}

const Dropdown = ({
  name,
  title,
  value,
  onChange,

  testId,
  options,
  hasError = false,
  errorMsg,
}: DropdownProps) => {
  return (
    <FormControl sx={{ marginBottom: '1rem' }}>
      <FormGroup>
        <FormLabel htmlFor={name}>{title}</FormLabel>
        <Select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          data-testid={testId}
        >
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            );
          })}
        </Select>
        {hasError && <Typography sx={{ color: 'red' }}>{errorMsg}</Typography>}
      </FormGroup>
    </FormControl>
  );
};

export default Dropdown;
