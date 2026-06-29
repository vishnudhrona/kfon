import { Box, Preview, useForm } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { downloadAgnpListCsv, fetchSingleOnboardingData, resetPassword } from '../action';
import { transformRowToPreviewData } from '../constants';
import { getSingleOnboardingData } from '../selector';
import AddPonPort from './pop-up/AddPonPort';
import AddServiceArea from './pop-up/AddServiceArea';

const PartnerPreviewList = ({ getRowListData, detailedData, resetPassword }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams({ strict: false });
    const id = params.id;

    const [isServiceAreaOpen, setIsServiceAreaOpen] = useState(false);
    const [isPonPortOpen, setIsPonPortOpen] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (id) {
            getRowListData(id);
        }
    }, [id, getRowListData]);

    const handleBackClick = () => {
        navigate({ to: '..' }); 
    };

    const handleResetPassword = () => {
        if (detailedData?.basicDetails?.id) {
            resetPassword(detailedData.basicDetails.id);
        }
    };

    const handleAddServiceArea = () => {
        setIsServiceAreaOpen(true);
    };

    const handleAddPonPort = () => {
        setIsPonPortOpen(true);
    }

    const previewData = transformRowToPreviewData(detailedData, t, {
        onAddServiceArea: handleAddServiceArea,
        onAddPonPort: handleAddPonPort
    });

    if (!detailedData) {
        return <Box p={4}>{t('loading')}</Box>;
    }
    
    return (
        <Box position='relative' h='full' w='full'>
            <Box h='full' overflowY='auto'>
                <Preview
                    data={previewData}
                    control={control}
                    errors={errors}
                    submitButtonText={t('save')}
                    onBack={handleBackClick}
                    onSubmit={handleSubmit((data) => console.log(data))}
                    onResetPassword={handleResetPassword}
                />
            </Box>
            <AddServiceArea isOpen={isServiceAreaOpen} onClose={() => setIsServiceAreaOpen(false)} id={detailedData?.basicDetails?.id} />
            <AddPonPort isOpen={isPonPortOpen} onClose={() => setIsPonPortOpen(false)} id={detailedData?.basicDetails?.id} />
        </Box>
    );
};

const mapStateToProps = (state) => ({
    detailedData: getSingleOnboardingData(state)
});

const mapDispatchToProps = {
    getRowListData: fetchSingleOnboardingData,
    resetPassword: resetPassword,
    downloadCsv: downloadAgnpListCsv
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerPreviewList);
