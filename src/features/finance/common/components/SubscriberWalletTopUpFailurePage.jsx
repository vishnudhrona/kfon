import { wrapperStyle } from '../constants';
import SubscriberWalletTopUpFailure from './SubscriberWalletTopUpFailure';

const SubscriberWalletTopUpFailurePage = () => {
    return (
        <div style={wrapperStyle}>
            <SubscriberWalletTopUpFailure isOpen={true} />
        </div>
    );
};

export default SubscriberWalletTopUpFailurePage;
