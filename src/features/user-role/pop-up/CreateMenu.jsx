import { Box, Button, FormController, HStack, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useTranslation } from "react-i18next";

import { Close, Save } from "@/components/custom";

const CreateMenu = ({ open, setOpen}) => {
    const { t } = useTranslation();
  
    const {
      control,
      formState: { errors }
    } = useForm();
  
    return (
      <Popup title={t('createMenu')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
        <Box as={'form'} alignItems='stretch' gap={5} p={6}>
          <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5}>
            <FormController
              placeholder={t('enter', { 0: t('iconName') })}
              labelName={t('fontAwesomeIcon')}
              name='iconName'
              control={control}
              errors={errors}
              required
            />
  
            <FormController
              placeholder={t('choose', { 0: t('parentMenu') })}
              labelName={t('parentMenu')}
              name='parentMenu'  
              control={control}
              errors={errors}
              type="select"
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('name') })}
              labelName={t('name')}
              name='name'  
              control={control}
              errors={errors}
              required
            />

            <FormController
              placeholder={t('select', { 0: t('role') })}
              labelName={t('title')}
              name='menuDescription'  
              control={control}
              errors={errors}
              type="select"
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('link') })}
              labelName={t('link')}
              name='link'  
              control={control}
              errors={errors}
              type="select"
            />

            <FormController
              placeholder={t('choose', { 0: t('weight') })}
              labelName={t('weight')}
              name='weight'  
              control={control}
              errors={errors}
              required
            />

            <FormController
              placeholder={t('choose', { 0: t('linkTarget') })}
              labelName={t('linkTarget')}
              name='linkTarget'  
              control={control}
              errors={errors}
              type="select"
              required
            />

            <FormController
              placeholder={t('choose', { 0: t('linkType') })}
              labelName={t('linkType')}
              name='linkType'  
              control={control}
              errors={errors}
              type="select"
              required
            />
          </SimpleGrid>

          <FormController
          placeholder={t('enter', { 0: t('remarks') })}
          labelName={t('remarks')}
          name='businessUnit'
          control={control}
          errors={errors}
          type='textArea'
          size='xl'
          resize={'vertical'}
          required
        />
  
          <HStack justifyContent={'flex-end'} mt={5}>
            <Button
              variant='outline'
                onClick={() => setOpen(false)}
            >
              <Close />
              {t('close')}
            </Button>
  
            <Button variant='solid' type='submit' ml={3}>
              <Save />
              {t('submit')}
            </Button>
          </HStack>
        </Box>
      </Popup>
    );
  };
  
  export default CreateMenu;                                                                                                                                                          