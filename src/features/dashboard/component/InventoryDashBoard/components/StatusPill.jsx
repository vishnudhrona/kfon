import { Box } from '@kfonbss/bss-ui-components';

const StatusPill = ({ bg, color, border, label, dot = false }) => (
  <Box
    display='inline-flex' alignItems='center' gap='4px'
    px='10px' py='4px' borderRadius='100px'
    border={`1px solid ${border}`} bg={bg}
    fontSize='2xs' fontWeight='800' letterSpacing='0.4px'
    textTransform='uppercase' color={color} whiteSpace='nowrap'
  >
    {dot && <Box w='5px' h='5px' borderRadius='50%' bg='currentColor' flexShrink={0} />}
    {label}
  </Box>
);

export default StatusPill;
