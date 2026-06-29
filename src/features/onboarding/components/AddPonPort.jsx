import { Box, Button, FormController, HStack, Popup, Table, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { BigRoundPluseIcon, Close, Save } from '@/components/custom';
import { mapObjectValues } from '@/utils/commonUtils';

import { fetchOltDeviceList } from '../action';
import { getOltDeviceList } from '../selector';
import { ADD_PON_PORT } from './constants';

const AddPonPort = ({ isOpen, onClose, fetchOltDeviceList, oltDeviceList }) => {
  const { t } = useTranslation();

  useEffect(() => {
    fetchOltDeviceList();
  }, [fetchOltDeviceList]);

  const {
    control,
    formState: { errors }
  } = useForm();

  const columns = useMemo(() => {
    const dataColumns = mapObjectValues(ADD_PON_PORT, t, ['header']);
    return [
      ...dataColumns,
      {
        header: t('action'),
        accessor: 'action',
        cell: () => (
          <Box cursor='pointer'>
            <DeleteIcon />
          </Box>
        )
      }
    ];
  }, [t]);

  return (
    <Popup title={t('add')} titleMain={t('ponPort')} isOpen={isOpen} onClose={onClose} size={'lg'}>
      <VStack alignItems={'stretch'} gap={6} px={5}>
        <HStack align='flex-end' spacing={4} width='100%' flexWrap='nowrap'>
          <Box flex={1}>
            <FormController
              placeholder={t('select', { 0: t('oltDeviceList') })}
              labelName={t('oltDeviceList')}
              name='oltDeviceList'
              control={control}
              errors={errors}
              type='select'
              items={oltDeviceList}
              getOptionLabel={(option) => option.name}
              required
            />
          </Box>

          <Box flex={1}>
            <FormController
              placeholder={t('select', { 0: t('ponPortNumber') })}
              labelName={t('ponPortNumber')}
              name='ponPortNumber'
              control={control}
              errors={errors}
              type='select'
              isMulti
              required
            />
          </Box>

          <Box
            as='button'
            height='44px'
            width='44px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            mb='2px'
          >
            <BigRoundPluseIcon />
          </Box>
        </HStack>

        <Table columns={columns} />

        <Box display={'flex'} justifyContent={'flex-end'} gap={3} mt={7} pb={5}>
          <Button variant={'outline'} onClick={() => onClose(false)}>
            <Close />
            {t('cancel')}
          </Button>
          <Button variant={'solid'}>
            <Save />
            {t('save')}
          </Button>
        </Box>
      </VStack>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  oltDeviceList: getOltDeviceList(state)
});

const mapDispatchToProps = {
  fetchOltDeviceList: fetchOltDeviceList
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPonPort);
