import { wrapperStyle } from '../constants';
import SubscriberWalletTopUpSuccess from './SubscriberWalletTopUpSuccess';

const SubscriberWalletTopUpSuccessPage = () => {
    return (
        <div style={wrapperStyle}>
            <SubscriberWalletTopUpSuccess isOpen={true} />
        </div>
    );
};

export default SubscriberWalletTopUpSuccessPage;
