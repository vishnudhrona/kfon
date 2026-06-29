import { RadioGroup, Stack } from '@kfonbss/bss-ui-components';

/**
 * Radio group using Chakra UI RadioGroup primitives.
 * Props:
 *   options  — array of { value, label }
 *   value    — currently selected value
 *   onChange — called with the new value string
 */
const DeviceRadioGroup = ({ options = [], value, onChange }) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(e) => onChange(e.value)}
      variant='outline'
      colorPalette='primary'
    >
      <Stack direction='row' gap='5'>
        {options.map((opt) => (
          <RadioGroup.Item key={opt.value} value={opt.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText fontSize='14px' color='font_color.secondary' fontWeight='normal'>
              {opt.label}
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </Stack>
    </RadioGroup.Root>
  );
};

export default DeviceRadioGroup;
