import { Link } from "@kfonbss/bss-ui-components";
import { useTranslation } from 'react-i18next';

const SignUp = () => {
    const { t } = useTranslation();
    return (
        <>
            {t("newToUs")}
            <Link color="teal.500" href="#">
                {t("signUp")}
            </Link>
        </>
    )
}

export default SignUp