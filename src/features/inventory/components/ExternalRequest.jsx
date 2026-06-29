import { Box, Button, CommonCard, Flex, Icons, Input, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDeviceTypeCategory, submitExternalRequest } from '../actions';
import { getDeviceTypeCategory } from '../selectors';
import ModalActionButtons from './ModalActionButtons';

const FALLBACK_STYLES = [
  { iconBg: '#05BCC3', bgIconColor: '#E0F7FA' },
  { iconBg: '#E91E63', bgIconColor: '#FCE4EC' },
  { iconBg: '#3F51B5', bgIconColor: '#E8EAF6' },
  { iconBg: '#FF9800', bgIconColor: '#FFF3E0' },
  { iconBg: '#4CAF50', bgIconColor: '#E8F5E9' },
  { iconBg: '#9C27B0', bgIconColor: '#F3E5F5' },
  { iconBg: '#00BCD4', bgIconColor: '#E0F7FA' },
  { iconBg: '#F44336', bgIconColor: '#FFEBEE' }
];

const parseItemName = (item) => {
  const raw = item.categoryName || item.title || item.deviceType || '';
  const match = raw.match(/^(.*?)\s*(\(.*?\))?$/);
  return { mainName: match?.[1] || raw, subName: match?.[2] || '' };
};

const getDisplayId = (item, index) => {
  if (item.categoryId && item.categoryId.length > 10) {
    return (parseInt(item.categoryId.substring(0, 4), 16) % 10000) + 10000;
  }
  return item.categoryId || 11340 + index;
};

const ExternalRequestRow = ({ item, index, onAdd }) => {
  const { t } = useTranslation();
  const [qty, setQty] = useState(0);

  const { mainName, subName } = parseItemName(item);
  const displayId = getDisplayId(item, index);

  const handleAdd = () => {
    if (qty > 0) {
      onAdd({ item, qty, mainName, displayId });
      setQty(0);
    }
  };

  return (
    <Flex
      align='center'
      justify='space-between'
      p='4'
      bg='white'
      borderRadius='md'
      border='1px solid'
      borderColor='gray.200'
      boxShadow='sm'
    >
      <Flex align='center' gap='4'>
        <Box bg='#FCECB8' px='3' py='1' borderRadius='md' fontSize='sm' fontWeight='bold' color='gray.800'>
          {t('id')} : {displayId}
        </Box>
        <Text fontWeight='bold' color='#8C1A4A' fontSize='md'>
          {mainName}
          {subName && (
            <Text as='span' color='gray.600' fontWeight='normal' ml='2'>
              {subName}
            </Text>
          )}
        </Text>
      </Flex>

      <Flex align='center' gap='3'>
        <Flex align='center' border='1px solid' borderColor='gray.200' borderRadius='md' overflow='hidden'>
          <Box
            as='button'
            px='3'
            py='2'
            fontSize='md'
            fontWeight='bold'
            color='gray.600'
            bg='white'
            _hover={{ bg: 'gray.100' }}
            onClick={() => setQty((q) => Math.max(0, q - 1))}
          >
            -
          </Box>
          <Input
            value={qty}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setQty(val === '' ? 0 : Math.min(100, Number(val)));
            }}
            inputMode='numeric'
            pattern='[0-9]*'
            size='sm'
            border='none'
            borderLeft='1px solid'
            borderRight='1px solid'
            borderColor='gray.200'
            borderRadius='0'
            minW='50px'
            textAlign='center'
            fontWeight='medium'
            _focus={{ boxShadow: 'none', borderColor: 'gray.200' }}
          />
          <Box
            as='button'
            px='3'
            py='2'
            fontSize='md'
            fontWeight='bold'
            color='gray.600'
            bg='white'
            _hover={{ bg: 'gray.100' }}
            onClick={() => setQty((q) => Math.min(100, q + 1))}
          >
            +
          </Box>
        </Flex>
        <Box
          as='button'
          px='4'
          py='2'
          border='1px solid'
          borderColor='primary.500'
          borderRadius='md'
          color='primary.500'
          fontSize='sm'
          fontWeight='medium'
          bg='white'
          _hover={{ bg: 'primary.50' }}
          opacity={qty === 0 ? 0.5 : 1}
          cursor={qty === 0 ? 'not-allowed' : 'pointer'}
          onClick={handleAdd}
        >
          {t('add')}
        </Box>
      </Flex>
    </Flex>
  );
};

const SelectedTag = ({ label, qty, onRemove }) => (
  <Flex align='center' gap='4' bg='white' border='1px solid' borderColor='#FFDE74' borderRadius='8px' p='2'>
    <Flex align='center' gap='4'>
      <Text
        fontWeight='600'
        fontSize='14px'
        color='black'
        whiteSpace='nowrap'
      >
        {label}
      </Text>
      <Box
        bg='#FFDE74'
        borderRadius='4px'
        px='4px'
        py='8px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        w='7'
        h='7'
      >
        <Text fontWeight='600' fontSize='14px' color='black'>
          {String(qty).padStart(2, '0')}
        </Text>
      </Box>
    </Flex>
    <Box
      as='button'
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexShrink={0}
      _hover={{ opacity: 0.7 }}
      onClick={onRemove}
      color='gray.400'
    >
      <Icons.BsXCircle boxSize={5} cursor='pointer' />
    </Box>
  </Flex>
);

const ExternalRequestPopup = ({ isOpen, onClose, addedItems, selectedCardTitle, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Popup
      title={t('request')}
      titleMain={t('device')}
      isOpen={isOpen}
      onOpenChange={onClose}
      size='xl'
      closeButton={false}
    >
      <Box px='28px' pt='20px' pb='8px'>
        <VStack spacing={3} align='stretch' maxH='60vh' overflowY='auto'>
          {addedItems.map((a, idx) => (
            <Flex
              key={a.key}
              align='center'
              p='4'
              bg='white'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
              boxShadow='sm'
              gap='4'
            >
              <Box
                bg='#FCECB8'
                px='3'
                py='1'
                borderRadius='md'
                fontSize='sm'
                fontWeight='bold'
                color='gray.800'
                minW='36px'
                textAlign='center'
              >
                {String(idx + 1).padStart(2, '0')}
              </Box>
              <Text fontWeight='semibold' color='gray.700' flex='none'>
                {selectedCardTitle}
              </Text>
              <Box w='1px' h='20px' bg='gray.300' />
              <Text fontWeight='bold' color='gray.800' flex='1'>
                {a.label}
              </Text>
              <Box
                border='1px solid'
                borderColor='gray.200'
                borderRadius='md'
                px='4'
                py='2'
                fontSize='sm'
                bg='white'
                color='gray.700'
                whiteSpace='nowrap'
              >
                {t('requestNos')}:{' '}
                <Text as='span' fontWeight='bold' color='gray.900'>
                  {String(a.qty).padStart(2, '0')}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>
      <ModalActionButtons onClose={onClose} onSubmit={onSubmit} submitLabel='submit' />
    </Popup>
  );
};

const ExternalRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceTypeCategory = useSelector(getDeviceTypeCategory);

  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDeviceTypeCategory());
  }, [dispatch]);

  const cards = useMemo(() => {
    if (!deviceTypeCategory || deviceTypeCategory.length === 0) return [];
    return deviceTypeCategory.map((item, index) => {
      const style = FALLBACK_STYLES[index % FALLBACK_STYLES.length];
      return {
        typeId: item.typeId,
        title: item.typeName,
        iconBg: style.iconBg,
        bgIconColor: style.bgIconColor,
        categories: item.categories || []
      };
    });
  }, [deviceTypeCategory]);

  const selectedCard = useMemo(() => cards.find((c) => c.typeId === selectedTypeId) || null, [cards, selectedTypeId]);

  const visibleRows = useMemo(() => {
    if (!selectedCard) return [];
    return selectedCard.categories.map((cat, idx) => ({ ...cat, _idx: idx }));
  }, [selectedCard]);

  const selectedCardTitle = selectedCard?.title || null;

  const handleCardClick = (typeId) => {
    setSelectedTypeId((prev) => (prev === typeId ? null : typeId));
  };

  const handleAdd = ({ item, qty, mainName, displayId }) => {
    const key = item.categoryId || displayId;
    setAddedItems((prev) => {
      const existing = prev.findIndex((a) => a.key === key);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], qty: updated[existing].qty + qty };
        return updated;
      }
      return [
        ...prev,
        {
          key,
          label: mainName,
          qty,
          categoryId: item.categoryId || null,
          categoryName: item.categoryName || mainName
        }
      ];
    });
  };

  const handleRemoveTag = (key) => {
    setAddedItems((prev) => prev.filter((a) => a.key !== key));
  };

  const handleSubmitRequest = () => {
    dispatch(
      submitExternalRequest({
        deviceType: selectedCard?.typeId || selectedCardTitle,
        request: addedItems.map((a) => ({
          categoryId: a.categoryId,
          categoryName: a.categoryName,
          count: a.qty
        })),
        remarks: '',
        onSuccess: () => {
          setIsPopupOpen(false);
          setAddedItems([]);
          setSelectedTypeId(null);
        }
      })
    );
  };

  return (
    <Flex direction='column' gap='4' w='100%'>
      <Flex wrap='wrap' gap={4}>
        {cards.map((card) => {
          const isActive = selectedTypeId === card.typeId;
          return (
            <Box
              key={card.typeId}
              minW='250px'
              flex='1'
              cursor='pointer'
              onClick={() => handleCardClick(card.typeId)}
              transition='transform 0.15s'
              _hover={{ transform: 'translateY(-2px)' }}
              outline={isActive ? '2px solid' : 'none'}
              outlineColor={isActive ? 'primary.400' : 'transparent'}
              borderRadius='lg'
            >
              <CommonCard title={card.title} icon={card.icon} iconBg={card.iconBg} bgIconColor={card.bgIconColor} />
            </Box>
          );
        })}
      </Flex>

      {addedItems.length > 0 && (
        <Flex
          align='center'
          justify='space-between'
          bg='#FFFDF8'
          border='1px solid'
          borderColor='rgba(0,0,0,0.1)'
          borderRadius='8px'
          px='2'
          py='2'
          minH='56px'
          w='full'
        >
          <Flex align='center' gap='4' wrap='wrap' flex='1'>
            {addedItems.map((a) => (
              <SelectedTag key={a.key} label={a.label} qty={a.qty} onRemove={() => handleRemoveTag(a.key)} />
            ))}
          </Flex>

          {addedItems.length > 0 && (
            <Button
              as='button'
              px='4'
              h='32px'
              bg='primary.500'
              color='white'
              borderRadius='8px'
              fontSize='14px'
              fontWeight='500'
              align='center'
              gap='6px'
              _hover={{ bg: 'primary.600' }}
              onClick={() => setIsPopupOpen(true)}
              flexShrink={0}
              alignItems='center'
              justifyContent='center'
              minW='120px'
            >
              {t('next')}
              <Icons.BsArrowRightCircle boxSize='5' />
            </Button>
          )}
        </Flex>
      )}

      {selectedCardTitle && (
        <Flex direction='column' gap='3' mt='1' flex='1' minH='0' maxH='400px' overflowY='auto' pb='4'>
          {visibleRows.length > 0 ? (
            visibleRows.map((item) => (
              <ExternalRequestRow key={item.categoryId || item._idx} item={item} index={item._idx} onAdd={handleAdd} />
            ))
          ) : (
            <Text color='gray.500'>{t('noRecordsFound')}</Text>
          )}
        </Flex>
      )}

      <ExternalRequestPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        addedItems={addedItems}
        selectedCardTitle={selectedCardTitle}
        onSubmit={handleSubmitRequest}
      />
    </Flex>
  );
};

export default ExternalRequest;
