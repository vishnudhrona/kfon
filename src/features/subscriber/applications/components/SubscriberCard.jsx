import { Box, HStack, Icons, Stack, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Divider = () => <Box h='16px' w='1px' bg='gray.300' display={{ base: 'none', md: 'block' }} />;

/* Yellow "ID : 4923" pill */
const IdPill = ({ label, value }) => (
  <HStack spacing={1} bg='#FFDE74' px={3} py={1} borderRadius='6px' flexShrink={0}>
    <Text fontSize='sm' fontWeight='semibold' color='primary.500'>
      {label} :
    </Text>
    <Text fontSize='sm' fontWeight='bold' color='primary.500'>
      {value}
    </Text>
  </HStack>
);

/* Rounded outline pill: "Package: ..." / "Franchisee: ..." */
const LabelPill = ({ label, value }) => (
  <HStack spacing={1} border='1px solid' borderColor='gray.300' px={3} py={1} borderRadius='31px' flexShrink={0}>
    <Text fontSize='sm' fontWeight='medium' color='font_color.secondary'>
      {label}:
    </Text>
    <Text fontSize='sm' fontWeight='semibold' color='font_color.primary'>
      {value}
    </Text>
  </HStack>
);

/* Magenta speed pill: "⚡ 45 Mbps" */
const SpeedPill = ({ speed }) => {
  const { t } = useTranslation();
  const { SpeedBoltIcon } = Icons;
  if (!speed) return null;
  return (
    <HStack spacing={1} bg='primary.500' color='white' px={3} py={1} borderRadius='full' flexShrink={0}>
      <SpeedBoltIcon boxSize='12px' />
      <Text fontSize='sm' fontWeight='semibold' whiteSpace='nowrap'>
        {speed} {t('mbps')}
      </Text>
    </HStack>
  );
};

const SubscriberCard = memo(({ data, index, expandAll = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(expandAll);
  const [isChecked, setIsChecked] = useState(false);
  const { MobileNewIcon, NewEmailIcon, UpArrowIcon, DownArrowIcon, TimerIcon } = Icons;

  useEffect(() => setIsExpanded(expandAll), [expandAll]);

  const toggleExpand = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleCheck = useCallback((e) => {
    e.stopPropagation();
    setIsChecked((prev) => !prev);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (!data.subscriberUuid) return;
    navigate({
      to: '/app/subscribers/subscribers-list/subscriber-details/$subscriberId',
      params: { subscriberId: data.subscriberUuid }
    });
  }, [navigate, data.subscriberUuid]);

  const idValue = data.appNo || data.subscriberId;
  const nameValue = data.name;
  const usernameValue = data.username;
  const packageValue = data.packageName || data.planCode;

  return (
    <HStack w='full' spacing={3} align='center'>
      {/* Selection checkbox */}
      <Box
        as='button'
        onClick={toggleCheck}
        flexShrink={0}
        w='20px'
        h='20px'
        borderRadius='4px'
        border='1.5px solid'
        borderColor={isChecked ? 'primary.500' : 'gray.300'}
        bg={isChecked ? 'primary.500' : 'white'}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        {isChecked && (
          <Text fontSize='12px' color='white' lineHeight='1'>
            ✓
          </Text>
        )}
      </Box>

      <Text fontWeight='bold' color='black' minW='24px' display={{ base: 'none', md: 'block' }}>
        {String(index).padStart(2, '0')}
      </Text>

      <Box
        flex={1}
        border='1px solid'
        borderColor='gray.200'
        borderRadius='12px'
        bg='white'
        boxShadow='sm'
        overflow='hidden'
        cursor='pointer'
        onClick={handleViewDetails}
        _hover={{ borderColor: 'primary.500' }}
        transition='border-color 0.2s'
      >
        {/* Top row */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'start', md: 'center' }}
          spacing={3}
          bg={isExpanded ? '#FFFAEB' : 'white'}
          px={4}
          py={3}
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={2}
            align={{ base: 'start', md: 'center' }}
            flexWrap='wrap'
          >
            {idValue && <IdPill label={t('id')} value={idValue} />}
            {(nameValue || usernameValue) && (
              <HStack spacing={0} align='start'>
                {nameValue && (
                  <Text
                    fontWeight='bold'
                    fontSize='md'
                    color='font_color.primary'
                    whiteSpace='nowrap'
                    textTransform='capitalize'
                  >
                    {nameValue}
                  </Text>
                )}
                {usernameValue && (
                  <Text fontSize='sm' color='font_color.secondary' whiteSpace='nowrap'>
                    {usernameValue}
                  </Text>
                )}
              </HStack>
            )}
            {packageValue && <LabelPill label={t('package')} value={packageValue} />}
          </Stack>

          <HStack spacing={3} flexShrink={0}>
            {data.expiryDate && (
              <Text fontSize='sm' color='font_color.primary' whiteSpace='nowrap'>
                {t('expires')}:{' '}
                <Text as='span' fontWeight='bold'>
                  {data.expiryDate}
                </Text>
              </Text>
            )}
            <SpeedPill speed={data.speed} />
            <Box as='button' onClick={toggleExpand} display='flex' alignItems='center' justifyContent='center'>
              {isExpanded ? <UpArrowIcon boxSize={5} /> : <DownArrowIcon boxSize={5} />}
            </Box>
          </HStack>
        </Stack>

        {/* Detail row */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <Stack
                direction={{ base: 'column', md: 'row' }}
                justify='space-between'
                align={{ base: 'start', md: 'center' }}
                spacing={3}
                px={4}
                py={3}
              >
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={3}
                  align={{ base: 'start', md: 'center' }}
                  flexWrap='wrap'
                >
                  {data.mobile && (
                    <HStack spacing={1}>
                      <MobileNewIcon boxSize={5} color='primary.700' />
                      <Text fontWeight='semibold' fontSize='md' color='#232F50'>
                        {data.mobile}
                      </Text>
                    </HStack>
                  )}
                  {data.email && (
                    <HStack spacing={1}>
                      <NewEmailIcon boxSize={5} color='primary.500' />
                      <Text fontSize='md' color='#232F50' fontWeight={600}>
                        {data.email}
                      </Text>
                    </HStack>
                  )}
                  {data.franchisee && (
                    <>
                      <Divider />
                      <LabelPill label={t('franchisee')} value={data.franchisee} />
                    </>
                  )}
                </Stack>

                <HStack spacing={3} flexShrink={0}>
                  {data.registrationDate && (
                    <Text fontSize='sm' color='font_color.primary' whiteSpace='nowrap'>
                      {t('registrationDate')}:{' '}
                      <Text as='span' fontWeight='bold'>
                        {data.registrationDate}
                      </Text>
                    </Text>
                  )}
                  {data.daysLeft != null && (
                    <HStack spacing={1}>
                      <TimerIcon boxSize={5} color='primary.500' />
                      <Text fontSize='sm' fontWeight='bold' color='primary.500' whiteSpace='nowrap'>
                        {data.daysLeft} {t('dayLeft')}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </HStack>
  );
});

export default SubscriberCard;
