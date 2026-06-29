import { Box, Button, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CustomCheckbox from '@/components/custom/CustomCheckbox';
import { warningToast } from '@/components/custom/Toast';

const { BsCheckCircle } = Icons;

const Declaration = ({
  onSubmit,
  onIncompleteSubmit,
  isAllStepsCompleted = false,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [isAccepted, setIsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleButtonClick = () => {
    if (!isAllStepsCompleted) {
      if (onIncompleteSubmit) {
        onIncompleteSubmit();
      } else {
        warningToast({ description: t('validations.fillPreviousSteps') });
      }
      return;
    }
    if (!isAccepted) {
      setShowError(true);
      warningToast({ description: t('pleaseAcceptTermsAndConditions') });
    } else {
      onSubmit();
    }
  };

  return (
    <Box mt={6} p={4} borderWidth={1} borderRadius='md' borderColor='gray.200'>
      <VStack alignItems='flex-start' gap={3}>
        <Text fontSize='lg' fontWeight='semibold'>
          {t('declaration')}
        </Text>

        <Text fontSize='sm' textAlign='justify' color='gray.600'>
          {t('declarationText')}
        </Text>

        <VStack align='flex-start' gap={1}>
          <CustomCheckbox
            checked={isAccepted}
            onCheckedChange={({ checked }) => {
              setIsAccepted(checked);
              if (checked) setShowError(false);
            }}
            pt={2}
          >
            <Text fontWeight='400' cursor={'pointer'} fontSize='md'>
              {t('acceptTerms')}
            </Text>
          </CustomCheckbox>
          {showError && !isAccepted && (
            <Text color='red.500' fontSize='xs' mt={1}>
              {t('validations.mustAcceptTerms')}
            </Text>
          )}
        </VStack>

        <HStack justifyContent='flex-end' gap={4} mt={4} w='full'>
          <Button
            bg='#8D0247'
            color='white'
            borderRadius='40px'
            fontSize='18px'
            w='142px'
            h='47px'
            gap='6px'
            _hover={{ bg: '#720139' }}
            _disabled={{
              bg: '#EBEBEB',
              color: '#BDBDBD',
              cursor: 'not-allowed',
              _hover: { bg: '#EBEBEB' }
            }}
            fontWeight='400'
            onClick={handleButtonClick}
            loading={isLoading}
          >
            {t('submit')}
            <BsCheckCircle size={18} />
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Declaration;
