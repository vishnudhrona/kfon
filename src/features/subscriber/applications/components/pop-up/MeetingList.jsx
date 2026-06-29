import { Box, Button, Flex, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMeetingList } from '../../actions';
import { getMeetingHistoryByEnquiryId } from '../../selectors';

const { MobileNewIcon, BsXCircle, BsArrowRightCircle } = Icons;

const MeetingList = ({ open, setOpen, enquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const meetingList = useSelector((state) => getMeetingHistoryByEnquiryId(state, enquiryId));

  useEffect(() => {
    if (open && enquiryId) {
      dispatch(fetchMeetingList(enquiryId));
    }
  }, [open, enquiryId, dispatch]);

  const handleClose = (isOpen) => {
    setOpen(isOpen);
  };

  const sortedMeetings = [...meetingList].reverse();

  return (
    <Popup title={t('enquiry')} titleMain={t('meetingStatus')} isOpen={open} onOpenChange={handleClose} size='lg'>
      <VStack spacing={4} px={6} py={4} align='stretch' maxH='60vh' overflowY='auto'>
        {meetingList.length === 0 ? (
          <Text color='gray.500' textAlign='center' py={10}>
            {t('noMeetingsFound')}
          </Text>
        ) : (
          sortedMeetings.map((meeting) => (
            <Box
              key={meeting.meetingId}
              border='1px solid'
              borderColor='gray.100'
              borderRadius='xl'
              p={6}
              bg='white'
              boxShadow='0px 4px 20px rgba(0, 0, 0, 0.05)'
            >
              {!meeting.conducted ? (
                <VStack align='start' spacing={2}>
                  <Flex justify='space-between' align='start' w='full'>
                    <Text fontWeight='bold' fontSize='lg' color='font_color.navy'>
                      {t('meetingNotConducted')}
                    </Text>
                    <Text fontSize='sm' fontWeight='400' color='black'>
                      {meeting.date}
                    </Text>
                  </Flex>
                  <VStack align='start' spacing={1}>
                    <Text fontSize='md' color='black' fontWeight='medium' lineHeight='tall'>
                      {meeting.remarks || '-'}
                    </Text>
                  </VStack>
                </VStack>
              ) : (
                <>
                  <Flex justify='space-between' align='start' mb={4}>
                    <VStack align='start' spacing={1}>
                      <Text fontWeight='bold' fontSize='lg' color='font_color.navy'>
                        {meeting.contactPerson || '-'}
                      </Text>
                      <Flex align='center' gap={2}>
                        <Box
                          bg='#B02052'
                          w='18px'
                          h='18px'
                          borderRadius='full'
                          display='flex'
                          alignItems='center'
                          justifyContent='center'
                        >
                          <MobileNewIcon style={{ fontSize: '10px', color: 'white' }} />
                        </Box>
                        <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
                          {meeting.contactMobile || '-'}
                        </Text>
                      </Flex>
                    </VStack>
                    <Text fontSize='sm' fontWeight='400' color='black'>
                      {meeting.date}
                    </Text>
                  </Flex>

                  <VStack align='start' spacing={2} mb={4}>
                    <Text
                      fontSize='xs'
                      fontWeight='bold'
                      color='gray.400'
                      textTransform='uppercase'
                      letterSpacing='wider'
                    >
                      {t('remarks')}
                    </Text>
                    <Text fontSize='md' color='black' fontWeight='medium' lineHeight='tall'>
                      {meeting.remarks || '-'}
                    </Text>
                  </VStack>

                  <Text fontSize='sm' color='gray.500' fontWeight='medium'>
                    {meeting.location || '-'}
                  </Text>
                </>
              )}
            </Box>
          ))
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

export default MeetingList;
