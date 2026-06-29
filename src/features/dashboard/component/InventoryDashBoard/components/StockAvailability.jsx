import { Box, Flex, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SectionLabel from './SectionLabel';
import { BAR_COLORS, T } from './tokens';

const AvailRow = ({ row, idx }) => {
  const barColor = BAR_COLORS[idx % BAR_COLORS.length];
  return (
    <Box
      display='grid'
      gridTemplateColumns='60px 1.5fr 100px 140px 60px'
      gap='10px'
      alignItems='center'
      bg={T.card}
      border={`1px solid ${T.line}`}
      borderRadius='10px'
      p='12px 18px'
      transition='all 0.15s'
      cursor='pointer'
      _hover={{
        borderColor: T.maroon700,
        boxShadow: '0 4px 14px -6px rgba(107,26,61,0.15)',
        transform: 'translateY(-1px)'
      }}
    >
      <Text fontSize='xs' color={T.maroon800} fontWeight='400'>
        {String(row.no).padStart(2, '0')}
      </Text>
      <Box>
        <Text fontSize='xs' color={T.maroon800} fontWeight='400'>
          {row.district}
        </Text>
        <Text
          fontSize='2xs'
          color={T.inkFaint}
          fontWeight='600'
          letterSpacing='0.3px'
          display='block'
          mt='2px'
          textTransform='uppercase'
        >
          District
        </Text>
      </Box>
      <Text textAlign='right' fontSize='sm' color={T.rose} fontWeight='400'>
        {row.count.toLocaleString()}
      </Text>
      <HStack gap='8px'>
        <Box flex='1' h='5px' borderRadius='100px' bg={T.lineSoft} overflow='hidden'>
          <Box h='100%' w={`${row.pct}%`} bg={barColor} borderRadius='100px' />
        </Box>
        <Text fontSize='xs' color={T.inkSoft} minW='32px' textAlign='right'>
          {row.pct}%
        </Text>
      </HStack>
      <Flex justify='flex-end'>
        <Box
          as='button'
          w='28px'
          h='28px'
          borderRadius='7px'
          bg={T.paper}
          border={`1px solid ${T.line}`}
          color={T.maroon700}
          display='flex'
          alignItems='center'
          justifyContent='center'
          cursor='pointer'
          transition='all 0.15s'
          _hover={{ bg: T.maroon700, color: T.yellow, borderColor: T.maroon700 }}
        >
          <Icons.ExpandIcon w='12px' h='12px' />
        </Box>
      </Flex>
    </Box>
  );
};

const FilterDropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => (o.id ?? o.value) === value);
  const displayLabel = selected ? (selected.name ?? selected.label) : label;

  return (
    <Box position='relative'>
      <HStack
        as='button'
        gap='6px'
        bg={value ? '#FFF5F9' : T.card}
        border={`1px solid ${value ? T.maroon700 : T.line}`}
        borderRadius='8px'
        px='12px'
        h='34px'
        fontSize='xs'
        fontWeight='600'
        color={value ? T.maroon700 : T.inkSoft}
        cursor='pointer'
        _hover={{ borderColor: T.maroon700 }}
        onClick={() => setOpen((p) => !p)}
      >
        <Text fontSize='2xs' fontWeight='800' letterSpacing='0.4px' textTransform='uppercase' color={T.inkSoft}>
          {label}
        </Text>
        <Text fontWeight='700' color={value ? T.maroon700 : T.ink}>
          {displayLabel}
        </Text>
        <Icons.ChevronDownIcon w='10px' h='10px' color='inherit' />
      </HStack>

      {open && (
        <Box
          position='absolute'
          top='38px'
          left='0'
          zIndex='100'
          minW='180px'
          bg={T.card}
          border={`1px solid ${T.line}`}
          borderRadius='10px'
          boxShadow='0 8px 24px -6px rgba(0,0,0,0.12)'
          py='4px'
          maxH='220px'
          overflowY='auto'
        >
          <Box
            px='14px'
            py='8px'
            fontSize='xs'
            fontWeight='600'
            color={T.inkSoft}
            cursor='pointer'
            _hover={{ bg: T.paper }}
            onClick={() => { onChange(null); setOpen(false); }}
          >
            {label}
          </Box>
          {options.map((opt) => {
            const id = opt.id ?? opt.value;
            const name = opt.name ?? opt.label ?? '';
            return (
              <Box
                key={id}
                px='14px'
                py='8px'
                fontSize='xs'
                fontWeight='600'
                color={value === id ? T.maroon700 : T.ink}
                bg={value === id ? '#FFF5F9' : 'transparent'}
                cursor='pointer'
                _hover={{ bg: T.paper }}
                onClick={() => { onChange(id); setOpen(false); }}
              >
                {name}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const StockAvailability = ({ districtBreakdown, districtList = [], deviceTypes = [], onFilterChange }) => {
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleDistrictChange = (id) => {
    setSelectedDistrict(id);
    onFilterChange?.({ districtId: id, typeId: selectedType });
  };

  const handleTypeChange = (id) => {
    setSelectedType(id);
    onFilterChange?.({ districtId: selectedDistrict, typeId: id });
  };

  const rows = (Array.isArray(districtBreakdown) ? districtBreakdown : []).filter((r) => {
    if (selectedDistrict && r.districtId !== selectedDistrict && r.district !== selectedDistrict) return false;
    if (selectedType && r.typeId !== selectedType && r.type !== selectedType) return false;
    return true;
  });

  return (
    <>
      <SectionLabel badge='B' title={t('stockAvailability')} meta={`${rows.length} ${t('custodialEntriesMeta')}`} />

      <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='12px' p='10px 14px' mb='14px'>
        <HStack gap='10px' flexWrap='wrap'>
          <FilterDropdown
            label={t('allDistricts')}
            value={selectedDistrict}
            options={districtList}
            onChange={handleDistrictChange}
          />
          <FilterDropdown
            label={t('allTypes')}
            value={selectedType}
            options={deviceTypes}
            onChange={handleTypeChange}
          />
          <Box flex='1' />
          <HStack
            as='button'
            gap='6px'
            bg={T.card}
            border={`1px solid ${T.line}`}
            borderRadius='100px'
            px='14px'
            h='34px'
            fontSize='xs'
            fontWeight='700'
            color={T.maroon700}
            cursor='pointer'
            _hover={{ borderColor: T.maroon700 }}
          >
            <Icons.DownloadCsv w='11px' h='11px' />
            <Text>CSV</Text>
          </HStack>
        </HStack>
      </Box>

      <Box
        display='grid'
        gridTemplateColumns='60px 1.5fr 100px 140px 60px'
        gap='10px'
        alignItems='center'
        px='18px'
        mb='8px'
        fontSize='2xs'
        fontWeight='800'
        letterSpacing='0.8px'
        textTransform='uppercase'
        color={T.inkSoft}
      >
        <Text>{t('colNo')}</Text>
        <Text>{t('colDistrict')}</Text>
        <Text textAlign='right'>{t('colCount')}</Text>
        <Text>{t('colShareOfDistrict')}</Text>
        <Text></Text>
      </Box>

      <VStack gap='8px' align='stretch'>
        {rows.map((row, idx) => (
          <AvailRow key={row.no} row={row} idx={idx} />
        ))}
      </VStack>
    </>
  );
};

export default StockAvailability;
