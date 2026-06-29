import { Accordion, Box, Button, HStack, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createCorporateCustomerRoute } from '../routes';
import CorporateCustomerBasicDetails from './CorporateCustomerBasicDetails';
import CorporateCustomerGSTDetails from './CorporateCustomerGSTDetails';
import CorporateCustomerPANDetails from './CorporateCustomerPANDetails';

const CreateCorporateCustomer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customerId, enquiryId } = createCorporateCustomerRoute.useSearch();

  const [openAccordions, setOpenAccordions] = useState(['step1']);
  const skipAccordionChange = useRef(false);

  const setProgrammatic = (value) => {
    skipAccordionChange.current = true;
    setOpenAccordions(value);
    requestAnimationFrame(() => { skipAccordionChange.current = false; });
  };

  const handleAccordionChange = (details) => {
    if (skipAccordionChange.current) return;
    const newValue = Array.isArray(details) ? details : details?.value;
    if (Array.isArray(newValue)) {
      setOpenAccordions(newValue);
    }
  };

  const handleStep1Success = () => setProgrammatic(['step2']);
  const handleStep2Success = () => setProgrammatic(['step3']);
  const handleStep3Success = () => { };

  const handleAddKyc = () => {
    navigate({ to: '/app/corporate/enquiry-list' });
  };

  const handleBackFromStep3 = () => setProgrammatic(['step2']);

  return (
    <Box px={4} py={4}>
      <VStack alignItems='stretch' gap={4}>
        <Accordion multiple={false} value={openAccordions} onValueChange={handleAccordionChange}>
          <Box id='accordion-step1'>
            <CorporateCustomerBasicDetails
              isActive={openAccordions.includes('step1')}
              onSaveSuccess={handleStep1Success}
              customerId={customerId}
              enquiryId={enquiryId}
            />
          </Box>

          <Box id='accordion-step2'>
            <CorporateCustomerPANDetails
              isActive={openAccordions.includes('step2')}
              onSaveSuccess={handleStep2Success}
              customerId={customerId}
              onBasicDetailsRequired={() => setProgrammatic(['step1'])}
            />
          </Box>

          <Box id='accordion-step3'>
            <CorporateCustomerGSTDetails
              isActive={openAccordions.includes('step3')}
              onSaveSuccess={handleStep3Success}
              onBack={handleBackFromStep3}
              onBasicDetailsRequired={() => setProgrammatic(['step1'])}
            />
          </Box>
        </Accordion>

        <Box mt={6} display="flex" justifyContent="flex-end">
          <HStack spacing={4}>
            <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} borderRadius="full" minW="140px" onClick={handleBackFromStep3}>
              &larr; {t('back')}
            </Button>
            <Button variant="solid" bg="#8D0247" color="white" px={8} py={2} borderRadius="full" minW="140px" _hover={{ bg: '#700138' }} onClick={handleAddKyc}>
              {t('addKyc')}
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateCorporateCustomer;
