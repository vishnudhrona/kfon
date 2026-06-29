import { Box, Grid, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { EmptyState } from './SharedUI';

export default function DistrictGrid({ districtId, districts, dispatch }) {
  const { t } = useTranslation();

  if (!districts.length) {
    return <EmptyState title={t('loading')} />;
  }

  return (
    <Grid
      gridTemplateColumns="repeat(7,1fr)"
      gap={3}
      sx={{
        '@media(max-width:1100px)': { gridTemplateColumns: 'repeat(5,1fr)' },
        '@media(max-width:820px)': { gridTemplateColumns: 'repeat(4,1fr)' }
      }}
    >
      {districts.map((d) => {
        const sel = districtId === d.id;
        return (
          <Box
            key={d.id}
            border="1.5px solid"
            borderColor={sel ? 'primary.500' : 'gray.100'}
            borderRadius="10px"
            p={3}
            cursor="pointer"
            bg={sel ? 'primary.500' : 'white'}
            color={sel ? 'white' : 'inherit'}
            boxShadow={sel ? '0 6px 14px rgba(141,2,71,.20)' : 'none'}
            transition="all .15s"
            position="relative"
            minH="64px"
            _hover={!sel ? { borderColor: '#e0c0d0', bg: '#fffafd' } : {}}
            onClick={() => dispatch({ type: 'PICK_DISTRICT', id: d.id })}
          >
            {sel && (
              <Box
                position="absolute" top="8px" right="8px"
                w="16px" h="16px" borderRadius="50%"
                bg="#ffd233"
                display="flex" alignItems="center" justifyContent="center"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7a0c3e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17 4 12" />
                </svg>
              </Box>
            )}
            <Text fontWeight={700} fontSize="12.5px" lineHeight={1.3}>{d.name}</Text>
          </Box>
        );
      })}
    </Grid>
  );
}
