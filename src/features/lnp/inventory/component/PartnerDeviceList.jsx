import { Box, Button, Headline, HStack, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DownloadCsv, SearchIcon } from '@/components/custom';

import DevicePartnerRequest from './DevicePartnerRequestPopup';

const PartnerDeviceList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const createNewRequest = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Headline headName={t('partnerDeviceList')} editButton={true} onEdit={createNewRequest} />

      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <InputGroup endElement={<SearchIcon />} width='280px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
        <HStack>
          {/* <Select /> */}
          <Button variant='outline' borderRadius='md' height='40px'>
            <DownloadCsv />
            {t('downloadCSV')}
          </Button>
        </HStack>
      </Box>

      <Box overflow='hidden'>
        <Table />
      </Box>

      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>

      {isOpen && <DevicePartnerRequest isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
};

export default PartnerDeviceList;
