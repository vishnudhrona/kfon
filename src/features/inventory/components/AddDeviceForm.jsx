import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Icons,
  SimpleGrid,
  Table,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';

import FadeSlide from '@/components/custom/FadeSlide';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import useCsvParser from '@/utils/useCsvParser';

import {
  API_ACTION_TYPES,
  createDevice,
  downloadSampleDeviceCSV,
  fetchAssetTypes,
  fetchDeviceModelDetails,
  fetchDeviceTypeFields,
  fetchDeviceVendorDetails,
  fetchDeviceVendorDropdown
} from '../actions';
import { INVENTORY_KEYS } from '../constants';
import {
  getAssetTypesDropdown,
  getDeviceModelDetails,
  getDeviceTypeFields,
  getDeviceVendorDetails,
  getDropdownData
} from '../selectors';
import { AddDeviceSchema } from '../validations';
import AddDeviceModal from './AddDeviceModal';
import DeviceInfoCard from './DeviceInfoCard';

const { BsArrowLeftCircle, BsCheckCircle } = Icons;

const toDeviceModels = (vendorMap = []) =>
  vendorMap.map(({ modelId: id, modelName, type }) => ({ id, name: `${modelName} (${type}) ` }));

const buildColumns = (deviceTypeName, allFields = {}) => {
  const dynamicColumns = (allFields[deviceTypeName] || []).map((field) => ({
    header: field.label,
    accessor: field.label,
    cell: (row) => {
      if (row[field.name]) return row[field.name];
      const key = Object.keys(row).find((k) => k.toLowerCase() === field.label.toLowerCase());
      return key ? row[key] : 'N/A';
    }
  }));
  return [{ header: 'Sl.No', accessor: 'slNo', cell: (_, i) => i + 1 }, ...dynamicColumns];
};

const buildCsvFile = (data) => {
  const keys = Array.from(new Set(data.flatMap(Object.keys)));
  // Strip commas from values so we don't break CSV without using quotes, 
  // since the backend parser apparently keeps literal quotes.
  const rows = data.map((row) => keys.map((k) => String(row[k] || '').replace(/,/g, '')).join(','));
  const content = [keys.join(','), ...rows].join('\n');
  return new File([new Blob([content], { type: 'text/csv' })], 'device_details.csv', { type: 'text/csv' });
};

const toDisplayDevice = (device, formValues, deviceTypeName, categoryName) => {
  const { _id, ...data } = device;
  const out = { _id, ...data };
  const fields = [
    ['PO Number', formValues.poNumber],
    ['Invoice Date', formValues.invoiceDate],
    ['Device Vendor', formValues.deviceVendor?.name],
    ['Device Model', formValues.deviceModel?.name],
    ['Device Type', deviceTypeName],
    ['Device Category', categoryName]
  ];
  fields.forEach(([key, val]) => {
    if (val) out[key] = val;
  });
  out['Device Count'] = 1;
  return out;
};

const AddDeviceForm = ({
  deviceVendors,
  assetTypes,
  deviceVendorById,
  deviceModelDetails,
  getDeviceVendors,
  getVendorDetails,
  getDeviceModelDetails,
  getAssetTypes,
  fetchDeviceTypeFields,
  createDevice,
  downloadSampleDeviceCSV
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: csvData, fileName, parseFile: handleFileChange, reset: resetCsvData } = useCsvParser();
  const [manualDevices, setManualDevices] = useState([]);
  const rawManualDevicesRef = useRef([]);
  const addDeviceModalRef = useRef(null);

  const isCreating = useSelector(getApiProgress)[API_ACTION_TYPES.CREATE_DEVICE]?.isLoading || false;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    name: 'addDeviceForm',
    resolver: yupResolver(AddDeviceSchema(t)),
    defaultValues: { addingMethod: 'normal' }
  });

  const deviceModelName = watch('deviceModel')?.name;
  const deviceVendorName = watch('deviceVendor')?.name;
  const addingMethod = watch('addingMethod');
  const deviceTypeName = deviceModelDetails?.typeName;

  const resetDeviceList = useCallback(() => {
    setManualDevices([]);
    rawManualDevicesRef.current = [];
  }, []);

  const handleManualAdd = useCallback(
    (device) => {
      const { _id } = device;
      // StrictMode dedup guard
      if (!_id || !rawManualDevicesRef.current.some((d) => d._id === _id)) {
        rawManualDevicesRef.current = [...rawManualDevicesRef.current, device];
      }
      const displayed = toDisplayDevice(device, getValues(), deviceTypeName, deviceModelDetails?.categoryName);
      setManualDevices((prev) => {
        if (_id && prev.some((d) => d._id === _id)) return prev;
        return [...prev, displayed];
      });
    },
    [deviceTypeName, deviceModelDetails, getValues]
  );

  const handleDeviceCreation = async (val) => {
    if (addDeviceModalRef.current && val.addingMethod === 'normal') {
      await addDeviceModalRef.current.submitPending();
    }

    const onSuccess = () => router.navigate({ to: '/app/inventory/device-list' });
    const request = {
      vendorId: val.deviceVendor.id,
      modelId: val.deviceModel.id,
      assetType: val.assetType.name,
      poNo: val.poNumber,
      invoiceDate: val.invoiceDate
    };

    if (val.addingMethod === 'csv') {
      const combinedData = [...manualDevices, ...csvData];
      if (!combinedData.length) return;
      createDevice({ file: buildCsvFile(combinedData), request: { ...request, csv: true }, onSuccess });
    } else {
      if (!rawManualDevicesRef.current.length) return;
      // eslint-disable-next-line no-unused-vars
      const devices = rawManualDevicesRef.current.map(({ _id, ...d }) => d);
      createDevice({ request: { ...request, csv: false, devices }, onSuccess });
    }
  };

  useEffect(() => {
    resetDeviceList();
    resetCsvData();
  }, [addingMethod, resetDeviceList, resetCsvData]);

  useEffect(() => {
    getDeviceVendors();
    getAssetTypes();
    fetchDeviceTypeFields();
  }, [getDeviceVendors, getAssetTypes, fetchDeviceTypeFields]);

  const deviceModels = useMemo(() => toDeviceModels(deviceVendorById?.vendorMap), [deviceVendorById]);
  const tableData = useMemo(() => [...manualDevices, ...csvData], [manualDevices, csvData]);
  const deviceTypeFields = useSelector(getDeviceTypeFields);
  const columns = useMemo(() => buildColumns(deviceTypeName, deviceTypeFields), [deviceTypeName, deviceTypeFields]);

  return (
    <VStack alignItems='stretch' h='full' mb='10'>
      <form onSubmit={handleSubmit(handleDeviceCreation)}>
        <SimpleGrid
          mt='7'
          px='8'
          columns={{ base: 1, lg: 2, xl: 3 }}
          columnGap={{ base: 4, md: 6, lg: 8, xl: 16 }}
          rowGap={10}
        >
          <FormController
            placeholder={t('enter', { 0: t('poNumber') })}
            labelName={t('poNumber')}
            name='poNumber'
            errors={errors}
            control={control}
            type='text'
            required
            maxLength={20}
          />
          <FormController
            placeholder={t('invoiceDate')}
            labelName={t('invoiceDate')}
            name='invoiceDate'
            errors={errors}
            control={control}
            type='date'
            disableFuture
            required
          />
          <FormController
            placeholder={t('choose', { 0: t('deviceVendor') })}
            labelName={t('deviceVendor')}
            name='deviceVendor'
            errors={errors}
            control={control}
            type='select'
            items={deviceVendors}
            onOptionSelect={(val) => {
              getVendorDetails(val.id);
              setValue('deviceModel', null);
              resetDeviceList();
              resetCsvData();
            }}
            required
          />
          <FormController
            placeholder={t('choose', { 0: t('deviceModel') })}
            labelName={t('deviceModel')}
            name='deviceModel'
            errors={errors}
            control={control}
            items={deviceModels}
            onOptionSelect={(val) => {
              getDeviceModelDetails(val.id);
              resetDeviceList();
            }}
            type='select'
            required
          />
          <FormController
            placeholder={t('enter', { 0: t('assetType') })}
            labelName={t('assetType')}
            name='assetType'
            errors={errors}
            control={control}
            items={assetTypes}
            type='select'
            required
          />
        </SimpleGrid>

        <FadeSlide show={!!(deviceTypeName && deviceModelName)}>
          <Box px='8' mt='7'>
            <DeviceInfoCard
              deviceVendor={deviceVendorName}
              deviceModel={deviceModelName}
              deviceType={deviceTypeName}
              deviceMake={deviceModelDetails?.makeName}
              deviceCategory={deviceModelDetails?.categoryName}
            />
          </Box>
        </FadeSlide>

        <FadeSlide show={!!deviceTypeName} animationKey={`${deviceTypeName}-${addingMethod}`}>
          <AddDeviceModal
            ref={addDeviceModalRef}
            isOpen={true}
            onClose={() => {}}
            deviceType={deviceTypeName}
            allFields={deviceTypeFields}
            onAdd={handleManualAdd}
            addingMethod={addingMethod}
            parentControl={control}
            parentErrors={errors}
            fileName={fileName}
            onFileSelect={handleFileChange}
            onDownloadSample={() => downloadSampleDeviceCSV({ deviceType: deviceTypeName })}
          />
        </FadeSlide>

        <FadeSlide show={tableData.length > 0}>
          <Box px='8' mt='4' overflowX='auto'>
            <Box mt='2' overflowX='auto' borderRadius='md'>
              <Table
                headerColor='table_header.primary'
                data={tableData}
                columns={columns}
                emptyMessage={t('noRecordsFound')}
                pagination={false}
              />
            </Box>
          </Box>
        </FadeSlide>

        <Flex w='full' justify='flex-end' pr='8' py='5' mt='4'>
          <ButtonGroup variant='solid'>
            <Button width='fit-content' h='10' px='4' py='2' variant='outline' onClick={() => router.history.back()}>
              <BsArrowLeftCircle />
              {t('back')}
            </Button>
            <Button type='submit' width='fit-content' h='10' px='4' py='2' variant='solid' loading={isCreating}>
              {t('submit')}
              <BsCheckCircle />
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </VStack>
  );
};

const mapStateToProps = (state) => ({
  deviceVendors: getDropdownData(INVENTORY_KEYS.DEVICE_VENDOR_LIST)(state),
  deviceVendorById: getDeviceVendorDetails(state),
  deviceModelDetails: getDeviceModelDetails(state),
  assetTypes: getAssetTypesDropdown(state)
});

const mapDispatchToProps = {
  getDeviceVendors: fetchDeviceVendorDropdown,
  getVendorDetails: fetchDeviceVendorDetails,
  getDeviceModelDetails: fetchDeviceModelDetails,
  fetchDeviceTypeFields,
  getAssetTypes: fetchAssetTypes,
  createDevice,
  downloadSampleDeviceCSV
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDeviceForm);
