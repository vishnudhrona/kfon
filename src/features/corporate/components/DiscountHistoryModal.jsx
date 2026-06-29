import { Box, Button, Flex, Icons, Popup, Table } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const DiscountHistoryModal = ({ isOpen, onClose, data }) => {
  const { t } = useTranslation();
  const { BsArrowRightCircle } = Icons;

  const columns = [
    { header: t('discountPercent'), accessor: 'discountPercent' },
    { header: t('proposedBy'), accessor: 'proposedBy' },
    { header: t('createDate'), accessor: 'createDate' }
  ];

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title=" "
      titleMain={t('discountHistory')}
      size='md'
      footer={
        <Flex justify='flex-end' w='full' p={4}>
          <Button
            onClick={onClose}
            bg='#911F49'
            color='white'
            borderRadius='full'
            rightIcon={<BsArrowRightCircle size={14} />}
            px={8}
            _hover={{ bg: '#7a1a3d' }}
            fontSize='sm'
            fontWeight='medium'
          >
            {t('done')}
          </Button>
        </Flex>
      }
    >
      <Box bg='#FFF9EB' p={6} borderRadius='lg'>
        <Table
          headerColor='table_header.primary'
          data={data || []}
          columns={columns}
          showPagination={false}
          variant='simple'
          size='sm'
          bg='white'
          borderRadius='md'
          overflow='hidden'
        />
      </Box>
    </Popup>
  );
};

export default DiscountHistoryModal;
