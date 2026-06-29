import { Box } from '@kfonbss/bss-ui-components';

import { CUST_TAG_COLORS } from './tokens';

const CustodianTag = ({ type }) => {
  const tag = CUST_TAG_COLORS[type] ?? CUST_TAG_COLORS.DC;
  return (
    <Box
      fontSize='2xs'
      fontWeight='800'
      letterSpacing='0.5px'
      px='5px'
      py='1px'
      borderRadius='2px'
      textTransform='uppercase'
      bg={tag.bg}
      color={tag.color}
      border={`1px solid ${tag.border}`}
      flexShrink={0}
    >
      {type}
    </Box>
  );
};

export default CustodianTag;
