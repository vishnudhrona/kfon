import { Box, Button, FormController, HStack, Popup, useForm, useWatch } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Close, Save } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchOnboardingPopName, updateOnboardingPop } from '../action';
import { getPopName } from '../selector';

const toSelectItems = (pops) =>
  (pops || []).map((pop) => {
    if (typeof pop === 'string') return { id: pop, name: pop };
    return { id: pop?.id ?? pop?.name, name: pop?.name ?? pop?.label ?? String(pop) };
  });

const UpdatePopPopup = ({
  isOpen,
  onClose,
  id,
  currentPrimaryPop,
  currentAdditionalPops,
  popNameOptions,
  fetchPopNames,
  onUpdate,
  isSaving
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (!popNameOptions?.length) fetchPopNames();
  }, [fetchPopNames, popNameOptions?.length]);

  useEffect(() => {
    if (!isOpen) return;
    const toItem = (p) => {
      if (!p) return '';
      if (typeof p === 'string') return { id: p, name: p };
      return { id: p.id, name: p.name };
    };
    reset({
      primaryPop: toItem(currentPrimaryPop),
      additionalPops: Array.isArray(currentAdditionalPops) ? currentAdditionalPops : []
    });
  }, [isOpen, currentPrimaryPop, currentAdditionalPops, reset]);

  const onSubmit = (data) => {
    const primaryPop = data.primaryPop?.id ? { id: data.primaryPop.id, name: data.primaryPop.name } : null;
    console.log('Submitting POP update with data:', { primaryPop, additionalPops: data.additionalPops });
    const additionalPops = (data.additionalPops || []).filter((p) => p?.id).map((p) => ({ id: p.id, name: p.name }));
    onUpdate({ id, primaryPop, additionalPops, onSuccess: onClose });
  };

  const selectedPrimary = useWatch({ control, name: 'primaryPop' });
  const primaryId = selectedPrimary?.id ?? null;

  const popItems = toSelectItems(popNameOptions);
  const additionalPopItems = primaryId ? popItems.filter((p) => p.id !== primaryId) : popItems;

  return (
    <Popup title={t('edit')} titleMain={t('pop')} isOpen={isOpen} onClose={onClose} size='lg'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={5} pt={2} pb={4} display='flex' flexDirection='column' gap={4}>
          <FormController
            labelName={t('primaryPop')}
            name='primaryPop'
            control={control}
            type='select'
            items={popItems}
            placeholder={t('select', { 0: t('primaryPop') })}
          />
          <FormController
            labelName={t('additionalPops')}
            name='additionalPops'
            control={control}
            type='select'
            isMulti
            items={additionalPopItems}
            placeholder={t('select', { 0: t('additionalPops') })}
          />
        </Box>
        <HStack justify='flex-end' px={5} pb={5} gap={3}>
          <Button variant='outline' onClick={onClose} type='button'>
            <Close />
            {t('cancel')}
          </Button>
          <Button type='submit' isLoading={isSaving}>
            <Save />
            {t('save')}
          </Button>
        </HStack>
      </form>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  popNameOptions: getPopName(state),
  isSaving: !!getApiProgress(state)?.[ACTION_TYPES.ONBOARDING_POP_UPDATE]
});

const mapDispatchToProps = {
  fetchPopNames: fetchOnboardingPopName,
  onUpdate: updateOnboardingPop
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePopPopup);
