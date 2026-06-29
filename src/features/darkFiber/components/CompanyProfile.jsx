import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Heading,
  Icons,
  SimpleGrid,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDarkFiberEnquiryDetails, uploadCompanyProfile } from '../action';
import { getEnquiryDetails } from '../selector';
import { CompanyProfileSchema } from '../validation';

const { ForwardArrowIcon } = Icons;

const CompanyProfile = () => {
  const { t } = useTranslation();
  const { enquiryId } = useParams({ strict: false });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const enquiryDetails = useSelector(getEnquiryDetails);
  const isLoading = useSelector((state) => state.darkFiber.enquiryDetails.isLoading);

  useEffect(() => {
    if (enquiryId) {
      dispatch(fetchDarkFiberEnquiryDetails(enquiryId));
    }
  }, [dispatch, enquiryId]);

  const hasPanDetails = useMemo(() => !!enquiryDetails?.panNumber, [enquiryDetails]);

  const schema = useMemo(() => CompanyProfileSchema(t, hasPanDetails), [t, hasPanDetails]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      panNumber: '',
      gstinRequired: 'yes',
      taxPayerType: '',
      legalName: '',
      tradeName: '',
      serviceDescription: '',
      sac: ''
    }
  });

  useEffect(() => {
    if (enquiryDetails && enquiryDetails.panNumber) {
      reset({
        panNumber: enquiryDetails.panNumber,
        gstinRequired: 'yes',
        gstin: '',
        taxPayerType: '',
        legalName: '',
        tradeName: '',
        serviceDescription: '',
        sac: ''
      });
    }
  }, [enquiryDetails, reset]);

  const gstinRequired = watch('gstinRequired');
  const panNumber = watch('panNumber');

  const onSubmit = (data) => {
    dispatch(
      uploadCompanyProfile({
        ...data,
        requestId: enquiryId,
        onSuccess: () => navigate({ to: '/app/darkfiber/enquiry-list' })
      })
    );
  };

  const formControlProps = {
    h: '47px',
    borderRadius: '6px',
    borderColor: '#A0A0A0'
  };

  if (isLoading) {
    return <Box p={7}>{t('loading')}...</Box>;
  }

  return (
    <VStack alignItems='stretch' spacing='40px' p='28px' bg='white' borderRadius='8px'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing='48px' align='stretch'>
          {/* Pan Details Section */}
          <VStack align='stretch' spacing='24px'>
            <VStack align='stretch' spacing='8px'>
              <Heading fontSize='16px' fontWeight={600} color='gray.700'>
                {t('panDetails')}
              </Heading>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} columnGap='60px' rowGap='40px' alignItems='flex-end'>
              <FormController
                name='panNumber'
                labelName={t('panNumber')}
                placeholder={t('enterPanNumber')}
                control={control}
                errors={errors}
                required
                {...formControlProps}
                labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
              />

              <FormController
                name='customerId'
                labelName={t('customerId')}
                placeholder={t('autoCreateCustomerId')}
                control={control}
                errors={errors}
                disabled
                {...formControlProps}
                labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
              />

              {!hasPanDetails && (
                <Box>
                  <Flex alignItems='center' gap={1} mb={2}>
                    <Text fontSize='sm' fontWeight='bold' color='gray.700'>
                      {t('panDocument')}
                    </Text>
                  </Flex>
                  <FormController
                    name='panDoc'
                    type='file'
                    placeholder={t('dragAndDropFilesHere')}
                    control={control}
                    errors={errors}
                    required
                  />
                </Box>
              )}
            </SimpleGrid>
          </VStack>

          {/* GSTIN Details Section */}
          <VStack align='stretch' spacing='24px' mt='15px'>
            <VStack align='stretch' spacing='8px'>
              <Heading fontSize='16px' fontWeight={600} color='gray.700'>
                {t('gstinDetails')}
              </Heading>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} columnGap='60px' rowGap='40px' alignItems='flex-end'>
              <FormController
                name='gstinRequired'
                labelName={t('gstin')}
                type='radio'
                control={control}
                errors={errors}
                required
                items={[
                  { label: t('yes'), value: 'yes' },
                  { label: t('no'), value: 'no' }
                ]}
                labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
              />

              {gstinRequired === 'yes' ? (
                <>
                  <FormController
                    labelName={t('gstIn')}
                    name='gstin'
                    control={control}
                    errors={errors}
                    type='gstInput'
                    required
                    panNumber={panNumber}
                  />

                  <Box>
                    <FormController
                      name='gstDoc'
                      type='file'
                      labelName={
                        <Flex alignItems='center' justifyContent='space-between' width='100%'>
                          <Flex alignItems='center'>{t('gstinDocument')}</Flex>
                        </Flex>
                      }
                      placeholder={t('dragAndDropFilesHere')}
                      control={control}
                      errors={errors}
                      required={gstinRequired === 'yes'}
                    />
                  </Box>

                  <FormController
                    name='taxPayerType'
                    labelName={t('taxPayerType')}
                    placeholder={t('enterTaxPayerType')}
                    control={control}
                    errors={errors}
                    required
                    {...formControlProps}
                    labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
                  />
                  <FormController
                    name='legalName'
                    labelName={t('legalNameOfBusiness')}
                    placeholder={t('enterLegalName')}
                    control={control}
                    errors={errors}
                    required
                    {...formControlProps}
                    labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
                  />
                  <FormController
                    name='tradeName'
                    labelName={t('tradeName')}
                    placeholder={t('enterTradeName')}
                    control={control}
                    errors={errors}
                    required
                    {...formControlProps}
                    labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
                  />
                </>
              ) : (
                <>
                  <Box>
                    <FormController
                      name='supportingDoc'
                      type='file'
                      labelName={
                        <Flex alignItems='center' gap={1}>
                          {t('supportingDocument')}
                        </Flex>
                      }
                      placeholder={t('dragAndDropFilesHere')}
                      control={control}
                      errors={errors}
                      required
                    />
                  </Box>

                  <Box>
                    <FormController
                      name='lutDoc'
                      type='file'
                      labelName={
                        <Flex alignItems='center' gap={1}>
                          {t('lutDocument')}
                        </Flex>
                      }
                      placeholder={t('dragAndDropFilesHere')}
                      control={control}
                      errors={errors}
                    />
                  </Box>
                </>
              )}
            </SimpleGrid>
          </VStack>

          {/* Service Details Section */}
          {gstinRequired === 'yes' && (
            <VStack align='stretch' spacing='24px'>
              <SimpleGrid columns={{ base: 1, md: 3 }} columnGap='60px' rowGap='40px' alignItems='flex-end'>
                <FormController
                  name='serviceDescription'
                  labelName={t('serviceDescription')}
                  placeholder={t('enterServiceDescription')}
                  control={control}
                  errors={errors}
                  required
                  {...formControlProps}
                  labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
                />
                <FormController
                  name='sac'
                  labelName={t('sacLabelLong')}
                  placeholder={t('enterSac')}
                  control={control}
                  errors={errors}
                  required
                  {...formControlProps}
                  labelProps={{ fontWeight: 'bold', fontSize: 'sm' }}
                />

                <Box>
                  <FormController
                    name='supportingDoc'
                    type='file'
                    labelName={
                      <Flex alignItems='center' gap={1}>
                        {t('supportingDocument')}
                      </Flex>
                    }
                    placeholder={t('dragAndDropFilesHere')}
                    control={control}
                    errors={errors}
                    required
                  />
                </Box>

                <Box>
                  <FormController
                    name='lutDoc'
                    type='file'
                    labelName={
                      <Flex alignItems='center' gap={1}>
                        {t('lutDocument')}
                      </Flex>
                    }
                    placeholder={t('dragAndDropFilesHere')}
                    control={control}
                    errors={errors}
                  />
                </Box>
              </SimpleGrid>
            </VStack>
          )}

          {/* Buttons */}
          <Flex justifyContent='flex-end' mt={4}>
            <ButtonGroup spacing='12px'>
              <Button
                variant='outline'
                borderRadius='40px'
                h='47px'
                px='40px'
                border='1px solid #8D0247'
                color='#8D0247'
                _hover={{ bg: 'transparent' }}
                display='flex'
                alignItems='center'
                gap='8px'
                onClick={() => navigate({ to: '/darkfiber/enquiry-list' })}
              >
                <ForwardArrowIcon style={{ transform: 'rotate(180deg)' }} />
                {t('back')}
              </Button>

              <Button
                type='submit'
                borderRadius='40px'
                h='47px'
                px='40px'
                border='1px solid #8D0247'
                display='flex'
                alignItems='center'
                gap='8px'
                _hover={{ bg: '#6a193a' }}
              >
                {t('addKyc')}
                <ForwardArrowIcon />
              </Button>
            </ButtonGroup>
          </Flex>
        </VStack>
      </form>
    </VStack>
  );
};

export default CompanyProfile;
