import { Box, Button, Popup, Span, VStack } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Close, Save } from "@/components/custom";

const ConfirmPopup = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const handelClick = () => {
        onClose(false);
        navigate({ to: '/app/darkfiber/purchase-order-list' })
    };
    return (
        <Popup title={t("createPurchaseOrder")} isOpen={isOpen} onClose={onClose} size={'xs'}>
            <VStack>
                <Box>
                    <Span>{t("confirmPopupMessage")}</Span>
                </Box>
                <Box display="flex" gap="10px" ml={'auto'} justifyContent={'flex-end'} mt={5}>
                    <Button variant="outline"><Close />{t("cancel")}</Button>
                    <Button variant="solid" onClick={handelClick}>{t("confirm")}<Save /></Button>
                </Box>
            </VStack>
        </Popup>
    );
};

export default ConfirmPopup;
