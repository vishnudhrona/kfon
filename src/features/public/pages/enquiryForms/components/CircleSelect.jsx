import { FormController } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchStates } from '@/features/public/pages/login/action';
import { getSelectedTenant, getStates } from '@/features/public/pages/login/selector';
import { actions as loginActions } from '@/features/public/pages/login/slice';

// The alphabetic short code (e.g. "KL") is the unique tenant identifier the
// backend expects as `X-Tenant-ID`. Resolve it from whichever field carries it.
const getCode = (item) => item?.code || item?.tenantCode || item?.id || item?.stateId;

/**
 * Circle/State dropdown for the (guest) enquiry forms. Reuses the login
 * feature's `fetchStates` API + `setSelectedTenant`, so the chosen circle is
 * persisted to storage (SELECTED_TENANT) and the enquiry save APIs can attach
 * the `X-Tenant-ID` header when there is no auth token.
 */
const CircleSelect = ({ control, errors, setValue, name = 'circle', required = true }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const states = useSelector(getStates);
  const selectedTenant = useSelector(getSelectedTenant);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  // CustomSelect reads `name` for the label and `id`/`value` for the value,
  // so normalise the states list into that shape.
  const items = useMemo(
    () =>
      (Array.isArray(states) ? states : []).map((s) => ({
        ...s,
        id: getCode(s),
        name: s.name ?? s.stateName
      })),
    [states]
  );

  // Prefill with the circle already chosen during login (if any).
  useEffect(() => {
    if (!setValue || !selectedTenant || !items.length) return;
    const code = getCode(selectedTenant);
    const match = items.find((i) => getCode(i) === code);
    if (match) setValue(name, match, { shouldValidate: false });
  }, [items, selectedTenant, setValue, name]);

  const handleSelect = (option) => {
    if (option) dispatch(loginActions.setSelectedTenant(option));
  };

  return (
    <FormController
      labelName={t('circle')}
      name={name}
      type='select'
      items={items}
      placeholder={t('choose', { 0: t('circle') })}
      control={control}
      errors={errors}
      required={required}
      isSearchable
      onOptionSelect={handleSelect}
      width='100%'
    />
  );
};

export default CircleSelect;
