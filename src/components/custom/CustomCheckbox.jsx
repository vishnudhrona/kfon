import { Checkbox } from '@kfonbss/bss-ui-components';

const CustomCheckbox = ({ checked, onCheckedChange, children, ...props }) => {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      colorPalette='primary'
      cursor='pointer'
      {...props}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      {children && <Checkbox.Label>{children}</Checkbox.Label>}
    </Checkbox.Root>
  );
};

export default CustomCheckbox;
