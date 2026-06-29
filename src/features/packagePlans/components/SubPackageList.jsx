import { Button } from "@kfonbss/bss-ui-components";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import GenericPageTable from "@/components/custom/GenericPageTable"
import { ROUTE_APP, ROUTE_FEATURES } from "@/constants/routes";
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from "@/features/others/Pagination/selectors";
import { selectorWithKey } from "@/utils/commonUtils";

import { fetchSubpackageList, submitPlanSubPackage } from "../action";
import { VISIBLE_COLUMNS_SUB_PACKAGE } from "../constants";

const SubPackageList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { packageId } = useParams({ strict: false });

    const subPackageList = selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.SUB_PACKAGE_LIST_TABLE) || []; 

    const handleDelete = () => {
        const selectedIds = subPackageList.map((item) => item?.subPackageId);
        const payload = {
            subPackages: [],
            deletedSubPackageIds: selectedIds
        }
        dispatch(submitPlanSubPackage({ details: payload }));
    }

    const handleEdit = () => {
        navigate({
            to: `/${ROUTE_APP}/${ROUTE_FEATURES.PACKAGE_PLANS.PACKAGES}/${ROUTE_FEATURES.PACKAGE_PLANS.SUB_PACKAGE}`,
            params: { packageId },
            state: {
                packageData: { id: packageId, serviceCategoryId: subPackageList[0]?.serviceCategoryId },
                isEditAll: true,
                subPackages: subPackageList
            }
        });
    }

    const actions = (
        <>
            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={handleEdit}
            >
                {t('editAll')}
            </Button>

            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={handleDelete}
            >
                {t('deleteAll')}
            </Button>
        </>
    );

    return (
        <>
            <GenericPageTable
                data={subPackageList}
                fetchAction={fetchSubpackageList}
                columns={VISIBLE_COLUMNS_SUB_PACKAGE}
                tableKey={SERVER_SIDE_TABLE_KEYS.SUB_PACKAGE_LIST_TABLE}
                staticParams={{ packageId }}
                actions={actions}
            />
        </>
    )
}

export default SubPackageList