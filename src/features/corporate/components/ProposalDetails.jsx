import { Box, Button, Flex, Icons, Table, Text, VStack } from '@kfonbss/bss-ui-components';
import { useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchProposalDetails } from '../action';
import { DUMMY_PROPOSAL_DETAILS_DATA, getConnectionBreakupColumns } from '../constants';
import { getProposalDetailsData } from '../selector';
import DiscountHistoryModal from './DiscountHistoryModal';

const { DocumentIcon, BackwardArrowIcon } = Icons;

const PROPOSAL_DETAILS_LABELS = [
  { label: 'Customer Name', key: 'customerName' },
  { label: 'Proposal Name', key: 'proposalName' },
  { label: 'Billing Frequency', key: 'billingFrequency' },
  { label: 'Remarks', key: 'remarks' },
  { label: 'Standard Terms & Conditions', key: 'standardTerms', isLink: true },
  { label: 'Special Terms & Conditions', key: 'specialTerms', isLink: true }
];

const ProposalDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { proposalId, revisionId } = useParams({ strict: false });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const router = useRouter();
  const detailLabels = useMemo(() => {
    if (revisionId) {
      return PROPOSAL_DETAILS_LABELS.filter((item) => !item.isLink);
    }
    return PROPOSAL_DETAILS_LABELS;
  }, [revisionId]);

  const detailRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < detailLabels.length; i += 2) {
      const row = detailLabels.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  }, [detailLabels]);

  const proposalDetails = useSelector(getProposalDetailsData);
  const data = proposalDetails?.data?.customerName ? proposalDetails.data : DUMMY_PROPOSAL_DETAILS_DATA;
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress[ACTION_TYPES.FETCH_PROPOSAL_DETAILS];

  useEffect(() => {
    if (proposalId) {
      dispatch(fetchProposalDetails({ proposalId, revisionId }));
    }
  }, [dispatch, proposalId, revisionId]);

  const columns = useMemo(() => {
    return getConnectionBreakupColumns().map((col) => {
      if (col.accessor === 'discountPercent') {
        return {
          ...col,
          header: t(col.header),
          cell: (row) => (
            <Flex align='center' justify='space-between' gap={1} width='full'>
              <Text fontSize='xs'>{row.discountPercent}</Text>
              <Flex
                align='center'
                gap={1}
                color='primary.500'
                cursor='pointer'
                onClick={() => setIsHistoryModalOpen(true)}
              >
                <Text fontSize='xs' fontWeight='medium'>
                  {t('history')}
                </Text>
                <DocumentIcon size={12} />
              </Flex>
            </Flex>
          )
        };
      }
      return {
        ...col,
        header: t(col.header)
      };
    });
  }, [t]);

  const DetailItem = ({ label, value, isLink }) => (
    <Flex alignItems='center' borderBottom='1px solid #E2E8F0' pb={1} w='full' gap={36}>
      <Text fontSize='14px' color='gray.500' fontWeight='medium'>
        {t(label)}
      </Text>
      {isLink ? (
        <Flex alignItems='center' color='primary.500' cursor='pointer'>
          <DocumentIcon size={14} />
          <Text fontSize='14px' textDecoration='underline'>
            {t('viewDetails')}
          </Text>
        </Flex>
      ) : (
        <Text fontSize='14px' fontWeight='semibold' color='gray.700'>
          {value || 'N/A'}
        </Text>
      )}
    </Flex>
  );

  return (
    <CustomLoaderProvider isLoading={isLoading}>
    <>
      <Box p={6} color='#333333'>
        <Box bg='white' p={12} mb={6} position='relative'>
          <Button
            variant='outline'
            colorScheme='primary'
            size='xs'
            borderRadius='md'
            position='absolute'
            top={6}
            right={8}
            fontSize='14px'
            px={4}
            borderColor='primary.500'
            color='primary.500'
            _hover={{ bg: 'primary.50' }}
          >
            {t('viewProposal')}
            <DocumentIcon size={14} />
          </Button>

          <VStack align='stretch' spacing={0} mb={10}>
            {detailRows.map((row, rowIdx) => (
              <Flex key={rowIdx} py={4} gap={16}>
                {row.map((item, colIdx) => (
                  <Box key={colIdx} flex={1}>
                    <DetailItem label={item.label} value={data[item.key]} isLink={item.isLink} />
                  </Box>
                ))}
                {row.length === 1 && <Box flex={1} />}
              </Flex>
            ))}
          </VStack>

          <Box mt={12}>
            <Text fontWeight='bold' mb={4} color='primary.500' fontSize='20px'>
              {t('connectionBreakupDetails')}
            </Text>
            <Box overflow='hidden' borderRadius='8px' border='1px solid #E2E8F0'>
              <Table
                headerColor='table_header.primary'
                data={data.connectionBreakup || []}
                columns={columns}
                showPagination={false}
                variant='simple'
                size='sm'
                mb={0}
              />
              <Flex align='center' bg='white' py={2} px={3} borderTop='1px solid #E2E8F0'>
                <Box minW='12.5%'></Box>
                <Box minW='12.5%'>
                  <Text fontWeight='bold' fontSize='xs'>
                    {t(data.connectionBreakupTotal?.packageName)}
                  </Text>
                </Box>
                <Box minW='12.5%'>
                  <Text fontWeight='bold' fontSize='xs'>
                    {data.connectionBreakupTotal?.packageCost}
                  </Text>
                </Box>
                <Box minW='12.5%'>
                  <Text fontWeight='bold' fontSize='xs'>
                    {data.connectionBreakupTotal?.otcCharges}
                  </Text>
                </Box>
                <Box minW='12.5%'>
                  <Text fontWeight='bold' fontSize='xs'>
                    {data.connectionBreakupTotal?.noOfConnections}
                  </Text>
                </Box>
                <Box minW='12.5%'>
                  <Text fontWeight='bold' fontSize='xs'>
                    {data.connectionBreakupTotal?.totalAmount}
                  </Text>
                </Box>
                <Box minW='12.5%'></Box>
                <Box minW='12.5%'></Box>
              </Flex>
            </Box>
          </Box>

          <Flex w='full' justify='flex-end' mt={6}>
            <Button
              variant='outline'
              h='10'
              px='6'
              width={'12%'}
              fontSize={'14px'}
              gap={2}
              borderRadius='full'
              borderColor='#911F49'
              color='#911F49'
              _hover={{ bg: '#FFF5F7' }}
              onClick={() => router.history.back()}
            >
              <BackwardArrowIcon boxSize={4} />
              {t('back')}
            </Button>
          </Flex>

          <Box mt={16} maxW='600px' border='1px solid #E2E8F0' borderRadius='16px' p={8} bg='#FCFCFC'>
            <VStack align='stretch' spacing={10}>
              {data.history?.map((item, idx) => (
                <Box key={idx} position='relative'>
                  <Text
                    fontSize='14px'
                    color='#911F49'
                    fontWeight='bold'
                    textAlign={item.isRight ? 'right' : 'left'}
                    mb={3}
                    px={14}
                  >
                    {item.role} {item.date}
                  </Text>
                  <Flex justify={item.isRight ? 'flex-end' : 'flex-start'} align='center' gap={4}>
                    {!item.isRight && (
                      <Box
                        bg='#005CB9'
                        w='32px'
                        h='32px'
                        borderRadius='full'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        boxShadow='sm'
                      >
                        <Text fontSize='14px' fontWeight='bold' color='white'>
                          {item.role?.[0] || 'K'}
                        </Text>
                      </Box>
                    )}
                    <Box
                      bg='#F0F7FF'
                      p={4}
                      px={8}
                      borderRadius='12px'
                      maxW='85%'
                      borderWidth='1px'
                      borderColor='blue.50'
                      boxShadow='sm'
                      position='relative'
                    >
                      <Flex align='center' gap={4}>
                        <Box bg='#911F49' color='white' px={4} py={1} borderRadius='full' boxShadow='sm'>
                          <Text fontSize='14px' fontWeight='bold'>
                            {item.status}
                          </Text>
                        </Box>
                        <Text fontSize='14px' color='gray.700' fontWeight='medium'>
                          {item.message}
                        </Text>
                      </Flex>
                    </Box>
                    {item.isRight && (
                      <Box
                        bg='#005CB9'
                        w='32px'
                        h='32px'
                        borderRadius='full'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        boxShadow='sm'
                      >
                        <Text fontSize='14px' fontWeight='bold' color='white'>
                          {item.role?.[0] || 'M'}
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>

      <DiscountHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        data={data.discountHistory}
      />
    </>
    </CustomLoaderProvider>
  );
};

export default ProposalDetails;
