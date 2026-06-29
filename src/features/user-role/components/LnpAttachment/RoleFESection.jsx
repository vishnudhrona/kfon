import { Box, Flex, Grid, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { Avatar, EmptyState } from './SharedUI';
import { feName } from './utils';

export default function RoleFESection({ districtId, feId, seats, dispatch }) {
  const { t } = useTranslation();

  if (!districtId) {
    return (
      <EmptyState
        icon={<path d='M3 9l9-6 9 6v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5h-2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />}
        title={t('lnpSelectDistrictFirst')}
        desc={t('lnpSelectDistrictFirstDesc')}
      />
    );
  }

  return (
    <Box>
      <Text fontWeight={600} fontSize='12.5px' color='gray.600' mb={2}>
        {t('lnpSelectFEPerson')}
      </Text>
      {seats.length === 0 ? (
        <EmptyState title={t('lnpNoFEs')} />
      ) : (
        <Grid gridTemplateColumns='repeat(auto-fill,minmax(240px,1fr))' gap={3}>
          {seats.map((s) => {
            const sel = feId === s.id;
            const displayName = feName(s);
            const seatLabel = s.name || s.seatName || '';
            return (
              <Flex
                key={s.id}
                align='center'
                gap={3}
                p={3}
                border='1.5px solid'
                borderColor={sel ? 'primary.500' : 'gray.100'}
                borderRadius='11px'
                bg={sel ? 'linear-gradient(135deg,#fff5f9,#fff)' : 'white'}
                boxShadow={sel ? '0 4px 12px rgba(122,12,62,.10)' : 'none'}
                cursor='pointer'
                transition='all .15s'
                _hover={!sel ? { borderColor: '#e0c0d0', bg: '#fffafd' } : {}}
                onClick={() => dispatch({ type: 'PICK_FE', id: s.id })}
              >
                <Avatar name={displayName || seatLabel} id={String(s.id)} />
                <Box flex={1} minW={0}>
                  <Text fontWeight={700} fontSize='13.5px' truncate>
                    {displayName || seatLabel}
                    {sel ? ' ✓' : ''}
                  </Text>
                  <Text fontSize='11px' color='gray.500' mt='2px' truncate>
                    {seatLabel}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
