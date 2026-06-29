import { Box, HStack } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getDistrict } from '@/features/common/selectors';

import { PERIOD_LABEL_KEYS, PERIOD_OPTIONS } from '../constants';
import { Pill, Select } from './shared';

// Shared top-of-page filters. `period` drives efficiency + active list; `district`
// and `partnerType` drive the enquiry table + active list. State lives in the parent.
const FilterBar = ({ period, onPeriodChange, district, onDistrictChange, partnerType, onPartnerTypeChange }) => {
  const { t } = useTranslation();
  const districtList = useSelector(getDistrict);
  const districtOptions = useMemo(() => (districtList ?? []).map((d) => d?.name).filter(Boolean), [districtList]);

  return (
    <HStack gap='6px' mb='16px' flexWrap='wrap'>
      {PERIOD_OPTIONS.map((p) => (
        <Pill key={p} active={period === p} onClick={() => onPeriodChange(p)}>
          {t(PERIOD_LABEL_KEYS[p])}
        </Pill>
      ))}
      <Box ml='auto'>
        <Select value={district} onChange={(e) => onDistrictChange(e.target.value)}>
          <option value=''>{t('dashboard.allDistricts')}</option>
          {districtOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </Box>
      <Select value={partnerType} onChange={(e) => onPartnerTypeChange(e.target.value)}>
        <option value=''>{t('dashboard.allTypes')}</option>
        <option value='LNP'>LNP</option>
        <option value='AGNP'>AGNP</option>
      </Select>
    </HStack>
  );
};

export default FilterBar;
