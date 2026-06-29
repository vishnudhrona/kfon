import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormController,
  Icons,
  SimpleGrid,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { createDarkFiberDetails, fetchPopList } from '../action';
import { MOCK_DATA } from '../constants';
import { DarkFiberDetailsSchema } from '../validation';
import LinkDetailsModal from './LinkDetailsModal';

const { ForwardArrowIcon, AddIcon, DocumentIcon } = Icons;

const DarkFiberDetails = () => {
  const { t } = useTranslation();
  const { enquiryId } = useParams({ strict: false });
  const router = useRouter();
  const dispatch = useDispatch();

  const [linkDetails, setLinkDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selectors
  const popList = useSelector((state) => state.darkFiber?.popList?.data || []);

  useEffect(() => {
    dispatch(fetchPopList());
  }, [dispatch]);

  const enquiryDetails = useMemo(() => {
    return MOCK_DATA.find((item) => item.requestId === enquiryId) || {};
  }, [enquiryId]);

  const schema = useMemo(() => DarkFiberDetailsSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      linkDetails,
      requestId: enquiryId,
      onSuccess: () => {
        router.history.back();
      }
    };
    dispatch(createDarkFiberDetails(payload));
  };

  const handleAddLinkDetails = () => {
    setIsModalOpen(true);
  };

  const handleModalAdd = (data) => {
    setLinkDetails((prev) => [...prev, data]);
  };

  const detailRows = useMemo(() => {
    const detailsLabels = [
      { label: 'companyName', key: 'companyName' },
      { label: 'contactName', key: 'contactPersonName' },
      { label: 'contactNumber', key: 'companyPhone' },
      { label: 'emailId', key: 'email' }
    ];

    const rows = [];
    for (let i = 0; i < detailsLabels.length; i += 2) {
      const row = detailsLabels.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  }, []);

  const DetailItem = ({ label, value }) => (
    <Flex alignItems='center' borderBottom='1px solid #E2E8F0' pb={3} w='full' gap={36}>
      <Text fontSize='14px' color='gray.500' fontWeight='medium'>
        {t(label)}
      </Text>
      <Text fontSize='14px' pl={10} fontWeight='semibold' color='gray.700'>
        {value || 'N/A'}
      </Text>
    </Flex>
  );

  return (
    <VStack alignItems='stretch' h='full' position='relative' spacing={4} p={7} bg='white' borderRadius='md'>
      <Box>
        <VStack align='stretch' spacing={0} mb={10}>
          {detailRows.map((row, rowIdx) => (
            <Flex key={rowIdx} py={4} gap={16}>
              {row.map((item, colIdx) => (
                <Box key={colIdx} flex={1}>
                  <DetailItem
                    label={item.label}
                    value={
                      item.key === 'email' && !enquiryDetails[item.key]
                        ? 'sriharsha@gmail.com'
                        : enquiryDetails[item.key]
                    }
                  />
                </Box>
              ))}
              {row.length === 1 && <Box flex={1} />}
            </Flex>
          ))}
        </VStack>
      </Box>

      <Text fontSize='lg' fontWeight='bold' mb={4}>
        {t('locationDetails')}
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} columnGap={8} rowGap={6}>
          <FormController
            name='startPop'
            labelName={t('startPop')}
            placeholder={t('chooseStartPop')}
            type='select'
            items={
              popList.length
                ? popList
                : [
                    { id: 'pop1', name: 'POP 1 (Mock)' },
                    { id: 'pop2', name: 'POP 2 (Mock)' }
                  ]
            }
            control={control}
            errors={errors}
            required
            h='45px'
            borderRadius='6px'
            borderColor='#A0A0A0'
          />

          <FormController
            name='endPop'
            labelName={t('endPop')}
            placeholder={t('chooseEndPop')}
            type='select'
            items={
              popList.length
                ? popList
                : [
                    { id: 'pop1', name: 'POP 1 (Mock)' },
                    { id: 'pop2', name: 'POP 2 (Mock)' }
                  ]
            }
            control={control}
            errors={errors}
            required
            h='45px'
            borderRadius='6px'
            borderColor='#A0A0A0'
          />

          <Box>
            <Text mb={2} fontSize='sm' fontWeight='medium'>
              {t('commissionDocument')} *
            </Text>
            <FormController
              name='commissionDoc'
              labelName=''
              placeholder={t('dragAndDropFilesHere')}
              type='file'
              control={control}
              errors={errors}
              required
            />
            <Text fontSize='xs' color='gray.500' mt={1}>
              {t('acceptedFormatsPop', { formats: 'JPEG/JPG/PNG/PDF', size: '5MB' })}
            </Text>
          </Box>

          <FormController
            name='otcCharge'
            labelName={t('otcCharge')}
            placeholder='10000.00'
            control={control}
            errors={errors}
            required
            h='45px'
            borderRadius='6px'
            borderColor='#A0A0A0'
          />
        </SimpleGrid>

        <Box mt={6}>
          <Flex gap={6} flexWrap='wrap'>
            {linkDetails.map((item) => (
              <Box
                key={item.id}
                bg='primary.600'
                color='white'
                borderRadius='lg'
                p={6}
                position='relative'
                overflow='hidden'
                minH='160px'
                w='320px'
              >
                <Box
                  position='absolute'
                  top='-50%'
                  right='-20%'
                  height='200%'
                  width='200%'
                  bgGradient='radial(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
                  pointerEvents='none'
                />

                <VStack alignItems='flex-start' spacing={1}>
                  <Text fontSize='lg' fontWeight='bold'>
                    {item.linkName} - {item.fiberType}
                  </Text>
                  <Text fontSize='sm'>
                    {t('chosenStrands')}: {item.chosenStrands}
                  </Text>
                  <Text fontSize='sm'>
                    {t('lengthInKm')}: {item.length}
                  </Text>
                </VStack>

                <Button
                  position='absolute'
                  bottom={4}
                  right={4}
                  size='sm'
                  variant='outline'
                  colorScheme='whiteAlpha'
                  color='white'
                  borderColor='white'
                  _hover={{ bg: 'whiteAlpha.200' }}
                  rightIcon={<DocumentIcon size={14} />}
                >
                  {t('viewDetails')}
                </Button>
              </Box>
            ))}

            <Box
              borderStyle='dashed'
              borderWidth='1px'
              borderColor='primary.500'
              borderRadius='12px'
              display='flex'
              justifyContent='center'
              alignItems='center'
              bg='#F5F6FA'
              cursor='pointer'
              onClick={handleAddLinkDetails}
              h='140px'
              w='257px'
            >
              <VStack spacing={2}>
                <Center bg='white' borderRadius='full' boxSize={12}>
                  <AddIcon id='addLinkDetailsIcon' size={4} boxSize={4} color='primary.500' viewBox='0 0 15 15' />
                </Center>
                <Text color='primary.500' fontWeight='medium' fontSize='14px'>
                  {t('addLinkDetails')}
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Box>

        <Box mt={10} display='flex' justifyContent='flex-end'>
          <ButtonGroup variant='solid' spacing={4}>
            <Button variant='outline' h='10' px='6' borderRadius='full' onClick={() => router.history.back()}>
              <ForwardArrowIcon style={{ transform: 'rotate(180deg)', marginRight: '8px' }} /> {t('back')}
            </Button>

            <Button type='submit' h='10' px='6' borderRadius='full' colorScheme='purple'>
              {t('createGroup')}
              <ForwardArrowIcon style={{ marginLeft: '8px' }} />
            </Button>
          </ButtonGroup>
        </Box>
      </form>
      <LinkDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleModalAdd} />
    </VStack>
  );
};

export default DarkFiberDetails;
