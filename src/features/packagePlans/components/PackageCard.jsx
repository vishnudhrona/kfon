import { Box, Flex, HStack, Icons, Text } from '@kfonbss/bss-ui-components';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import CustomEditIcon from '@/components/custom/CustomEditIcon';
import TableActionMenu from '@/components/custom/TableActionMenu';
import Toggle from '@/components/custom/Toggle';
import { ROUTE_APP, ROUTE_FEATURES } from '@/constants/routes';
import { router } from '@/routes/routes';
import { formatDisplayDate, formatDisplayTime } from '@/utils/dateUtils';

import { updatePlanStatus } from '../action';
import SubPackagePopup from './SubPackagePopup';

const { UpArrowIcon, DownArrowIcon, PackageCardIcon, GlobeRoundIcon } = Icons;
const CardIcon = PackageCardIcon || GlobeRoundIcon;

const PLAN_TYPE_STYLE = {
  FUP: { bg: '#FEF9C3', color: '#854D0E' },
  UNLIMITED: { bg: '#F0FDF4', color: '#166534' }
};

const formatPlanType = (type) => {
  if (type == null) return '';
  if (typeof type === 'string') return type.toUpperCase();
  if (typeof type === 'object') return String(type?.code || type?.name || '').toUpperCase();
  return String(type).toUpperCase();
};
const formatPrice = (n) =>
  n != null && !Number.isNaN(Number(n)) ? `₹ ${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '—';
const formatVolume = (gb) => {
  if (gb == null || Number.isNaN(Number(gb))) return '—';
  const v = Number(gb);
  if (v < 1) return `${(v * 1024).toFixed(2)} MB`;
  return `${v.toLocaleString('en-IN', { maximumFractionDigits: 2 })} GB`;
};

const pickSpeed = (obj) => {
  if (obj?.speedInMbps != null) return { value: obj.speedInMbps, unit: 'mbps' };
  if (obj?.speedInKbps != null) {
    const k = Number(obj.speedInKbps);
    if (k >= 1000) return { value: k / 1000, unit: 'mbps' };
    return { value: k, unit: 'kbps' };
  }
  return null;
};

const buildDurationLabel = (months, t) => {
  if (months == null || months === '') return '';
  const m = Number(months);
  if (Number.isNaN(m)) return String(months);
  return m === 1 ? `1 ${t('month').toLowerCase()}` : `${m} ${t('months').toLowerCase()}`;
};

const TermPlanCard = ({ item, parentData, onAddSubPackage, onOpenSubPackageList, viewType }) => {
  const { t } = useTranslation();
  const speedInfo = pickSpeed(item) || pickSpeed(parentData);
  const validity = item?.validity ?? item?.renewPeriod ?? parentData?.validity ?? parentData?.renewPeriod;
  const fallback = item?.fallbackSpeed ?? parentData?.fallbackSpeed;
  const volume = item?.planVolumeGb ?? item?.allocatedVolume ?? parentData?.planVolumeGb ?? parentData?.allocatedVolume;
  const price = item?.totalRenewalFee ?? item?.renewalFee ?? parentData?.renewalFee ?? parentData?.totalRenewalFee;
  const subPkgs = item?.subPackageCount ?? parentData?.subPackageCount ?? 0;
  const hasSub = item?.hasSubPackages ?? parentData?.hasSubPackages ?? false;
  const termLabel =
    item?.termPlanLabel || (item?.__isMain ? parentData?.planType?.name : null) || item?.planType?.name || '';
  const title = termLabel
    ? `${termLabel} ${t('plan', { defaultValue: 'Plan' })}`
    : item?.packageName || parentData?.packageName;
  const code =
    item?.packageName ||
    parentData?.packageName ||
    item?.subServiceName ||
    parentData?.subServiceName ||
    parentData?.serviceCategoryName ||
    parentData?.subscriberProfile?.code ||
    '';
  const createdAt = item?.createdDate || item?.createdOn || parentData?.createdDate || parentData?.createdOn;
  const months = item?.trailPackage ?? (validity != null ? Math.max(1, Math.round(Number(validity) / 30)) : null);
  const duration = buildDurationLabel(months, t);
  const isActive = item?.isActive ?? parentData?.isActive ?? true;
  const speedDisplay = speedInfo ? `${speedInfo.value} ${speedInfo.unit === 'mbps' ? t('mbps') : t('kbps')}` : '—';

  return (
    <Box
      flexShrink={0}
      w='380px'
      border='1.5px solid'
      borderColor='#E5E7EB'
      borderRadius='14px'
      p='12px'
      bg='white'
      boxShadow='0 1px 4px rgba(0,0,0,0.05)'
      transition='all 0.2s ease'
      _hover={{ borderColor: '#F472B6', boxShadow: '0 4px 18px rgba(233,30,140,0.1)' }}
    >
      <Flex justify='space-between' align='center' mb='8px'>
        <HStack gap='8px' align='center'>
          <Box
            w='32px'
            h='32px'
            borderRadius='full'
            border='2px solid #E5E7EB'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            {CardIcon && <CardIcon boxSize='18px' />}
          </Box>
          <Box>
            <Text fontSize='13.5px' fontWeight={700} color='#1A1A2E' noOfLines={1} maxW='180px' title={title}>
              {title}
            </Text>
            {code && (
              <Text fontSize='11.5px' color='#9CA3AF' mt='1px'>
                {code}
              </Text>
            )}
          </Box>
        </HStack>
        <Box bg='#FDE68A' color='#92400E' fontSize='14px' fontWeight={800} px='10px' py='4px' borderRadius='6px'>
          {formatPrice(price)}
        </Box>
      </Flex>

      <Box bg='#F4F5F8' borderRadius='10px' p='8px 12px' mb='8px'>
        <Flex gap='8px' wrap='wrap' rowGap='8px'>
          {[
            { label: t('speed'), value: speedDisplay },
            { label: t('planVolueme', { defaultValue: 'Plan Volume' }), value: formatVolume(volume) },
            { label: t('validity'), value: validity ? `${validity} ${t('days')}` : '—' },
            { label: t('fallBackSpeed', { defaultValue: 'Fallback Speed' }), value: fallback || '—' },
            { label: t('createdOn'), value: formatDisplayDate(createdAt) },
            ...(viewType === 'retail'
              ? [{ label: t('subPackages', { defaultValue: 'Sub Pkgs' }), value: subPkgs }]
              : [])
          ].map((s, i) => (
            <Box key={i} w='calc(33.33% - 6px)'>
              <Text fontSize='10.5px' color='#9CA3AF' fontWeight={400} mb='1px' whiteSpace='nowrap' lineHeight='1.2'>
                {s.label}
              </Text>
              <Text fontSize='13px' fontWeight={500} color='#1A1A2E' lineHeight='1.3'>
                {s.value}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      <HStack gap='8px' align='center' pt='6px' justifyContent={viewType !== 'retail' ? 'space-between' : 'flex-start'}>
        {duration && (
          <Box bg='#E91E8C' color='white' fontSize='11px' fontWeight={700} px='9px' py='3px' borderRadius='4px'>
            {duration}
          </Box>
        )}
        <HStack gap='4px'>
          <Box w='7px' h='7px' borderRadius='full' bg={isActive ? '#22C55E' : '#EF4444'} />
          <Text fontSize='11.5px' fontWeight={600} color={isActive ? '#22C55E' : '#EF4444'}>
            {isActive ? t('active') : t('inActive')}
          </Text>
        </HStack>
        {viewType === 'retail' && (
          <Box
            as='button'
            type='button'
            ml='auto'
            display='flex'
            alignItems='center'
            gap='4px'
            px='10px'
            py='5px'
            borderRadius='6px'
            border='1.5px solid #7B1040'
            bg='white'
            color='#7B1040'
            fontSize='12px'
            fontWeight={600}
            cursor='pointer'
            transition='all 0.2s ease'
            _hover={{ bg: '#7B1040', color: 'white' }}
            onClick={() => (hasSub ? onOpenSubPackageList?.(item) : onAddSubPackage?.(item))}
          >
            {hasSub ? t('subPackageList') : `+ ${t('subPackage', { defaultValue: 'Sub Package' })}`}
          </Box>
        )}
      </HStack>
    </Box>
  );
};

const PackageCard = ({ data, index, isAllExpanded, viewType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLocalExpanded, setIsLocalExpanded] = useState(isAllExpanded);
  const [subPkgPopup, setSubPkgPopup] = useState({ open: false, item: null });
  const scrollRef = useRef(null);

  const scrollCards = (dir) => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  useEffect(() => {
    setIsLocalExpanded(isAllExpanded);
  }, [isAllExpanded]);

  const packageType = formatPlanType(data?.packageType ?? data?.planType);
  const badgeStyle = PLAN_TYPE_STYLE[packageType] || { bg: '#F3F4F6', color: '#6B7280' };
  const indexLabel = String((index ?? 0) + 1).padStart(2, '0');

  const hasTermPlans = Array.isArray(data?.termPlans) && data.termPlans.length > 0;
  const termPlans = hasTermPlans
    ? [
        {
          ...data,
          trailPackage: data?.trailPackage ?? 1,
          totalRenewalFee: data?.totalRenewalFee ?? data?.renewalFee,
          termPlanLabel: data?.termPlanLabel ?? data?.planType?.name ?? 'Monthly',
          __isMain: true
        },
        ...data.termPlans
      ]
    : [data];
  const subPkgCount = hasTermPlans ? termPlans.length : (data?.subPackageCount ?? 1);
  const isActive = data?.isActive ?? true;

  const handleAddSubPackage = (rowData = {}) => {
    setSubPkgPopup({
      open: true,
      item: rowData,
      packageId: rowData.id || data.id,
      initialSubPackages: undefined,
      isEditAll: false
    });
  };

  const handleOpenSubPackageList = (rowData = {}) => {
    setSubPkgPopup({
      open: true,
      item: rowData,
      packageId: rowData.id || data.id,
      initialSubPackages: undefined,
      isEditAll: true
    });
  };

  const closeSubPkgPopup = () => setSubPkgPopup({ open: false, item: null });

  const handleEdit = () => {
    const editPath = viewType === 'corporate' ? 'edit-corporate-package/$packageId' : 'edit-package/$packageId';
    router.navigate({
      to: `/${ROUTE_APP}/${ROUTE_FEATURES.PACKAGE_PLANS.PACKAGES}/${editPath}`,
      params: { packageId: data.id }
    });
  };

  const actionMenuItems = useMemo(() => {
    const items = [
      {
        label: 'changeStatus',
        component: ({ row }) => (
          <>
            {(row.isActive ?? true) ? t('inActive') : t('active')}
            <Toggle
              checked={row.isActive ?? true}
              onChange={() => {
                const { id, isActive: a } = row;
                dispatch(updatePlanStatus({ id, status: !a }));
              }}
              size='sm'
            />
          </>
        )
      }
    ];

    return items;
  }, [t, dispatch]);

  return (
    <Box bg='white' borderRadius='12px' boxShadow='0 2px 12px rgba(0,0,0,0.07)' mb='14px' overflow='hidden'>
      {/* Header */}
      <Flex
        align='center'
        gap='10px'
        px='20px'
        py='14px'
        cursor='pointer'
        onClick={() => setIsLocalExpanded((p) => !p)}
        borderBottom={isLocalExpanded ? '1px solid #E5E7EB' : '1px solid transparent'}
        transition='background 0.15s ease'
        _hover={{ bg: '#F4F5F8' }}
        flexWrap='wrap'
      >
        <Text fontSize='13px' fontWeight={500} color='#9CA3AF' minW='24px'>
          {indexLabel}
        </Text>
        {packageType && (
          <Box
            bg={badgeStyle.bg}
            color={badgeStyle.color}
            px='10px'
            py='3px'
            borderRadius='5px'
            fontSize='11.5px'
            fontWeight={700}
            flexShrink={0}
          >
            {packageType}
          </Box>
        )}
        <Text fontSize='14px' fontWeight={600} color='#1A1A2E' noOfLines={1} maxW={{ base: '180px', md: '360px' }}>
          {data?.packageName}
        </Text>
        {viewType === 'retail' && (
          <Text fontSize='12.5px' color='#9CA3AF' ml='4px'>
            {t('noOfPackages', { defaultValue: 'No.of Packages' })}: {subPkgCount}
          </Text>
        )}
        <HStack ml='auto' gap='10px' flexShrink={0}>
          <Text fontSize='12px' color='#9CA3AF'>
            {t('createdOn')}:&nbsp;
            <Text as='span' fontWeight={700} color='#1A1A2E'>
              {formatDisplayDate(data?.createdDate || data?.createdOn)}{' '}
              {formatDisplayTime(data?.createdDate || data?.createdOn)}
            </Text>
          </Text>
          {!isLocalExpanded && (
            <HStack gap='4px'>
              <Box w='7px' h='7px' borderRadius='full' bg={isActive ? '#22C55E' : '#EF4444'} />
              <Text fontSize='12px' fontWeight={600} color={isActive ? '#22C55E' : '#EF4444'}>
                {isActive ? t('active') : t('inActive')}
              </Text>
            </HStack>
          )}
          <Box onClick={(e) => e.stopPropagation()}>
            <CustomEditIcon onClick={handleEdit} />
          </Box>
          {isLocalExpanded && (
            <Box onClick={(e) => e.stopPropagation()}>
              <TableActionMenu actionItems={actionMenuItems} row={data} />
            </Box>
          )}
          <Box color='#9CA3AF'>{isLocalExpanded ? <UpArrowIcon boxSize={4} /> : <DownArrowIcon boxSize={4} />}</Box>
        </HStack>
      </Flex>

      {/* Expanded body */}
      <motion.div
        initial={false}
        animate={{ height: isLocalExpanded ? 'auto' : 0, opacity: isLocalExpanded ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <Box px='20px' py='16px'>
          <Box position='relative'>
            {termPlans.length > 1 && (
              <Box
                as='button'
                type='button'
                aria-label='Scroll left'
                onClick={() => scrollCards(-1)}
                position='absolute'
                top='50%'
                left='-14px'
                transform='translateY(-50%)'
                w='28px'
                h='28px'
                borderRadius='full'
                border='1.5px solid #E5E7EB'
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                fontSize='14px'
                color='#6B7280'
                boxShadow='0 2px 6px rgba(0,0,0,0.1)'
                zIndex={2}
                transition='all 0.2s ease'
                _hover={{ borderColor: '#7B1040', color: '#7B1040' }}
              >
                {'‹'}
              </Box>
            )}
            <Flex
              ref={scrollRef}
              gap='14px'
              overflowX='auto'
              css={{
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {termPlans.map((item, idx) => (
                <TermPlanCard
                  key={item?.id || idx}
                  item={item}
                  parentData={data}
                  viewType={viewType}
                  onAddSubPackage={handleAddSubPackage}
                  onOpenSubPackageList={handleOpenSubPackageList}
                />
              ))}
            </Flex>
            {termPlans.length > 1 && (
              <Box
                as='button'
                type='button'
                aria-label='Scroll right'
                onClick={() => scrollCards(1)}
                position='absolute'
                top='50%'
                right='-14px'
                transform='translateY(-50%)'
                w='28px'
                h='28px'
                borderRadius='full'
                border='1.5px solid #E5E7EB'
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                fontSize='14px'
                color='#6B7280'
                boxShadow='0 2px 6px rgba(0,0,0,0.1)'
                zIndex={2}
                transition='all 0.2s ease'
                _hover={{ borderColor: '#7B1040', color: '#7B1040' }}
              >
                {'›'}
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>

      <SubPackagePopup
        isOpen={subPkgPopup.open}
        onClose={closeSubPkgPopup}
        packageId={subPkgPopup.packageId}
        packageData={subPkgPopup.item || data}
        initialSubPackages={subPkgPopup.initialSubPackages}
        isEditAll={subPkgPopup.isEditAll}
      />
    </Box>
  );
};

export default PackageCard;
