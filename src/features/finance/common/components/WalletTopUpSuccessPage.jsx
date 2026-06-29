import { wrapperStyle } from '../constants';
import WalletTopUpSuccess from './WalletTopUpSuccess';

const WalletTopUpSuccessPage = () => {
    return (
        <div style={wrapperStyle}>
            <WalletTopUpSuccess isOpen={true} />
        </div>
    );
};

export default WalletTopUpSuccessPage;
