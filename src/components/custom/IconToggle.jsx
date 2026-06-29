import { Box, Flex } from '@kfonbss/bss-ui-components';

const PRIMARY = '#8D0247';
const MUTED = '#B1B1B1';

/**
 * Two-icon pill toggle. activeIndex: 0 or 1.
 * icons: array of Chakra icon components (created via createIcon).
 */
const IconToggle = ({ icons, activeIndex, onChange, ariaLabels = [] }) => {
  return (
    <Flex
      align="center"
      bg="#ebebeb"
      borderRadius="8px"
      p="4px"
      gap="1px"
      display="inline-flex"
    >
      {icons.map((IconComponent, i) => {
        const isActive = activeIndex === i;
        return (
          <Box
            key={i}
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="30px"
            h="30px"
            borderRadius="5px"
            border="none"
            cursor="pointer"
            bg={isActive ? 'white' : 'transparent'}
            boxShadow={isActive ? '0px 4px 1.6px rgba(0,0,0,0.08)' : 'none'}
            transition="background 0.15s, box-shadow 0.15s"
            aria-label={ariaLabels[i]}
            aria-pressed={isActive}
            onClick={() => onChange?.(i)}
            p="0"
          >
            <IconComponent w="22px" h="22px" color={isActive ? PRIMARY : MUTED} />
          </Box>
        );
      })}
    </Flex>
  );
};

export default IconToggle;
