import { Box, Button, Flex, HStack, Popup, SimpleGrid, Text } from "@kfonbss/bss-ui-components";
import { useTranslation } from "react-i18next";

import { Close, Save } from "@/components/custom";

const Preview = ({ open, setOpen, onConfirm, previewData = [] }) => {
    const { t } = useTranslation();

    const handleEdit = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
    };

    return (
        <Popup title={
            <HStack fontSize="24px" fontWeight="600">
                <Text>{t('package')}</Text>
                <Text color="#FD1C7A">{t('preview')}</Text>
            </HStack>
        }
            size='xl'
            isOpen={open}
            onOpenChange={setOpen}
            placement='center'
        >
            <SimpleGrid columns={{ base: 1, lg: 4 }} gap={6} rowGap={5} px={5} pb={5}>
                {previewData.map((item, index) => (
                    <Box key={index}>
                        <Text color={'gray.600'} fontSize={'14px'} fontWeight={'400'}>{item.label}</Text>
                        <Text fontSize={'14px'} fontWeight={'600'}>
                            {item.value}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
            {/* </FormGroup> */}
            <Flex gap={2} justifyContent='flex-end'>
                <Button variant={'outline'} width={'165px'} height={'47px'} onClick={handleEdit}>
                    <Close /> {t('Close')}
                </Button>
                <Button width={'165px'} height={'47px'} onClick={handleConfirm}>
                    <Save /> {t('submit')}
                </Button>
            </Flex>
        </Popup>
    );
};

export default Preview;
