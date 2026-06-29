import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  ButtonGroup,
  FormController,
  Icons,
  QuillEditor,
  SimpleGrid,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { createDarkFiberProposal } from '../action';
import { CreateProposalFormSchema } from '../validation';

const { ForwardArrowIcon, BackwardArrowIcon, DocumentIcon } = Icons;

const CreateProposal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = useMemo(() => CreateProposalFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      onSuccess: () => {
        navigate({ to: '..' });
      }
    };
    dispatch(createDarkFiberProposal(payload));
  };

  return (
    <VStack alignItems='stretch' h='full' position='relative' spacing={6} p={8} bg='white' borderRadius='md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} columnGap={{ base: 4, md: 6, lg: 8, xl: 16 }} rowGap={10}>
          <FormController
            name='companyName'
            labelName={t('companyName')}
            placeholder={t('enter', { 0: t('companyName') })}
            control={control}
            errors={errors}
            required
          />

          <FormController
            name='contactPerson'
            labelName={t('contactPerson')}
            placeholder={t('enter', { 0: t('contactPerson') })}
            control={control}
            errors={errors}
            required
          />

          <FormController
            name='proposalName'
            labelName={t('proposalName')}
            placeholder={t('enter', { 0: t('proposalName') })}
            control={control}
            errors={errors}
            required
          />

          <FormController
            name='toAddress'
            labelName={t('toAddress')}
            placeholder={t('enterAddress')}
            control={control}
            errors={errors}
            required
          />

          <FormController
            name='remarks'
            labelName={t('remarks')}
            placeholder={t('enterRemarks')}
            control={control}
            errors={errors}
          />

          <Box />

          <Box gridColumn={{ base: 'span 1', lg: 'span 2', xl: 'span 3' }}>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Text fontSize='sm' fontWeight='medium'>
                {t('specialTermsConditions')}
              </Text>
              <Text fontSize='sm' color='primary.500' cursor='pointer' display='flex' alignItems='center' gap={1}>
                {t('standardTermsConditions')} <DocumentIcon />
              </Text>
            </Box>

            <Box>
              <QuillEditor height={200} onChange={(content) => setValue('specialTermsConditions', content)} />
            </Box>
          </Box>

          <VStack gridColumn={{ xl: 'span 3' }} alignItems='flex-end' mt={4} mb={10}>
            <ButtonGroup variant='solid' spacing={4}>
              <Button
                variant='outline'
                w='164.083px'
                h='47px'
                px='18px'
                fontSize='16px'
                py='8px'
                justifyContent='center'
                alignItems='center'
                gap='6px'
                borderRadius='40px'
                border='1px solid primary.500'
                onClick={() => navigate({ to: '..' })}
              >
                <BackwardArrowIcon />
                {t('back')}
              </Button>

              <Button
                variant='outline'
                type='submit'
                w='164.083px'
                h='47px'
                px='18px'
                py='8px'
                fontSize='16px'
                justifyContent='center'
                alignItems='center'
                gap='6px'
                borderRadius='40px'
                border='1px solid primary.500'
              >
                {t('save')}
              </Button>
              <Button
                type='button'
                w='164.083px'
                h='47px'
                px='18px'
                py='8px'
                fontSize='16px'
                justifyContent='center'
                alignItems='center'
                gap='6px'
                borderRadius='40px'
                border='1px solid primary.500'
                colorScheme='purple'
              >
                {t('preview')}
                <ForwardArrowIcon />
              </Button>
            </ButtonGroup>
          </VStack>
        </SimpleGrid>
      </form>
    </VStack>
  );
};

export default CreateProposal;
