import { Box, Button, Flex, Popup, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Close,Save } from '@/components/custom';

import { rolePermissionSubmit, updateRolePermission, updateUserMapping, userMappingSubmit } from '../action';

const PermissionPreview = ({
  showPreview,
  setShowPreview,
  selectedRows,
  payload,
  isEditMode,
  submit,
  update,
  fetchAction,
  submitUserMapping,
  preSetRole,
  updateUserMapping
}) => {
  const { t } = useTranslation();

  const hasExistingMapping = preSetRole && Object.keys(preSetRole?.roles ?? {}).length > 0;

  const handleSubmitRole = () => {
    if (isEditMode) {
      update(payload);
    } else if (fetchAction && hasExistingMapping) {
      updateUserMapping(payload);
    } else if (fetchAction) {
      submitUserMapping(payload);
    } else {
      submit(payload);
    }
  };

  return (
    <Popup
      title={t('preview')}
      isOpen={showPreview}
      size='xl'
      closeButton
      placement='center'
      onOpenChange={() => {
        setShowPreview(false);
      }}
    >
      <Flex
        align='center'
        gap='2'
        px='6'
        py={{ base: '6px', md: '0' }}
        bg={{ base: 'background.text_bg', md: 'none' }}
      >
        <Text fontWeight={'semibold'} color={'font_color.primary'} fontSize='md' whiteSpace='nowrap'>
          {t('selectedMenus')}
        </Text>
      </Flex>

      <Box
        maxHeight='400px'
        overflowY='auto'
        pt='16px'
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        <Box
          px={6}
          pb={6}
          css={{
            columnCount: 3,
            columnGap: '16px',
            '@media (max-width: 1200px)': {
              columnCount: 2
            },
            '@media (max-width: 768px)': {
              columnCount: 1
            }
          }}
        >
          {Object.entries(
            selectedRows?.permissions?.reduce((acc, curr) => {
              const section = curr.parentSection || 'Other';
              if (!acc[section]) {
                acc[section] = [];
              }
              acc[section].push(curr);
              return acc;
            }, {}) || {}
          ).map(([section, items]) => (
            <Box
              key={section}
              bg={'white'}
              p={4}
              borderRadius='md'
              boxShadow='sm'
              mb={3}
              css={{ breakInside: 'avoid' }}
            >
              <Text color={'#626262'} fontSize={'14px'} fontWeight={'400'} mb={3}>
                {section}
              </Text>

              {items.map((item, idx) => (
                <Flex key={idx} justifyContent={'space-between'} mb={2}>
                  <Text fontSize={'14px'} fontWeight={'600'}>
                    {item.name}
                  </Text>
                </Flex>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Flex gap={2} right={0} mt={7} px={6} pb={6} justifyContent='flex-end'>
        <Button variant={'outline'} onClick={() => setShowPreview(false)}>
          <Close /> {t('close')}
        </Button>
        <Button onClick={handleSubmitRole}>
          <Save /> {isEditMode ? t('update') : t('save')}
        </Button>
      </Flex>
    </Popup>
  );
};

const mapDispatchToProps = {
  submit: rolePermissionSubmit,
  update: updateRolePermission,
  submitUserMapping: userMappingSubmit,
  updateUserMapping: updateUserMapping
};

export default connect(null, mapDispatchToProps)(PermissionPreview);