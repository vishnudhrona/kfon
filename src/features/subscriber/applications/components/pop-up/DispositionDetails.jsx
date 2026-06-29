import { Badge, Box, Button, Flex, Icons, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { dayjs } from '@/utils/dateUtils';

import { fetchDispositionHistoryList } from '../../actions';
import { STATUS_DISPLAY_MAP } from '../../constants';

const { BsXCircle, BsArrowRightCircle, ArrowRightCircle } = Icons;

// Removed local statusDisplayMap using global STATUS_DISPLAY_MAP instead.

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const dateObj = dayjs(dateStr);
  if (!dateObj.isValid()) return dateStr;
  return dateObj.format(DATE_FORMAT.DATE_TIME);
};

const formatFollowUp = (disposition, t) => {
  if (disposition.type === 'DATE' && disposition.date) {
    const formattedDate = dayjs(disposition.date).format(DATE_FORMAT.DATE);
    return (
      <Text fontSize='md' color='black'>
        {t('followUp')}:{' '}
        <Text as='span' fontWeight='bold'>
          {formattedDate}
        </Text>
      </Text>
    );
  }
  if (disposition.type === 'DAY' && disposition.day) {
    return (
      <Text fontSize='md' color='black'>
        {t('followUp')}:{' '}
        <Text as='span' fontWeight='bold'>
          {disposition.day} {t('days')}
        </Text>
      </Text>
    );
  }
  if (disposition.followUpCount) {
    return (
      <Text fontSize='md' color='black'>
        {t('followUp')}:{' '}
        <Text as='span' fontWeight='bold'>
          {disposition.followUpCount} {t('days')}
        </Text>
      </Text>
    );
  }
  return null;
};

const StyledBadge = ({ status }) => {
  const displayStatus = STATUS_DISPLAY_MAP[status?.toUpperCase()] || status;
  return (
    <Badge
      {...{
        border: 'none',
        bg: 'gray.100',
        color: 'secondary.800',
        p: 3,
        borderRadius: 'full',
        fontSize: 'md',
        fontWeight: 'medium',
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
      gap='0'
    >
      {displayStatus}
      <ArrowRightCircle boxSize={5} />
    </Badge>
  );
};

const DispositionDetails = ({ open, setOpen, enquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [dispositionList, setDispositionList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && enquiryId) {
      setLoading(true);
      dispatch(
        fetchDispositionHistoryList({
          customerEnquiryId: enquiryId,
          onSuccess: (data) => {
            setDispositionList(data || []);
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
          }
        })
      );
    } else {
      setDispositionList([]);
    }
  }, [open, enquiryId, dispatch]);

  const handleClose = (isOpen) => {
    setOpen(isOpen);
  };

  return (
    <Popup title={t('enquiry')} titleMain={t('dispositionStatus')} isOpen={open} onOpenChange={handleClose} size='lg'>
      <VStack spacing={4} px={6} py={4} align='stretch' maxH='60vh' overflowY='auto'>
        {loading ? (
          <Flex justify='center' align='center' py={10}>
            <Spinner color='pink.500' />
          </Flex>
        ) : dispositionList.length === 0 ? (
          <Text color='gray.500' textAlign='center' py={10}>
            {t('noRecordsFound')}
          </Text>
        ) : (
          [...dispositionList].reverse().map((disposition, index) => {
            const followUpComponent = formatFollowUp(disposition, t);
            return (
              <Box
                key={disposition.id || index}
                border='1px solid'
                borderColor='gray.100'
                borderRadius='xl'
                p={6}
                bg='white'
                boxShadow='0px 4px 20px rgba(0, 0, 0, 0.05)'
              >
                <Flex justify='space-between' align='center' mb={4}>
                  <Flex align='center' gap={3}>
                    <StyledBadge status={disposition.disposition} />
                    <Text fontWeight='400' fontSize='md' color='black'>
                      {STATUS_DISPLAY_MAP[disposition.reason?.toUpperCase()] || disposition.reason || '-'}
                    </Text>
                  </Flex>
                  <Text fontSize='sm' color='black'>
                    {formatDate(disposition.createdAt)}
                  </Text>
                </Flex>

                <VStack align='start' spacing={2} mb={4}>
                  <Text fontSize='xs' color='gray.400' lineHeight='1.2'>
                    {t('remarks')}
                  </Text>
                  <Text fontSize='md' color='black' lineHeight='tall'>
                    {disposition.remarks || '-'}
                  </Text>
                </VStack>

                {followUpComponent && (
                  <Flex align='center' gap={2} mt={2}>
                    {followUpComponent}
                  </Flex>
                )}
              </Box>
            );
          })
        )}
      </VStack>

      <Flex w='full' justify='flex-end' pb={5} pr={5} gap={3}>
        <Button
          variant='outline'
          onClick={() => handleClose(false)}
          colorScheme='pink'
          borderColor='#8D0247'
          color='#8D0247'
          h='47px'
          px='18px'
          borderRadius='48px'
          fontSize='18px'
          fontWeight='400'
        >
          <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} /> {t('cancel')}
        </Button>
        <Button
          variant='solid'
          colorScheme='pink'
          bg='#8D0247'
          onClick={() => handleClose(false)}
          h='47px'
          px='18px'
          borderRadius='48px'
          fontSize='18px'
          fontWeight='400'
        >
          {t('done')} <BsArrowRightCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
        </Button>
      </Flex>
    </Popup>
  );
};

export default DispositionDetails;
