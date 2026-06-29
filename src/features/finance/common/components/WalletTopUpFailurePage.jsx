import { wrapperStyle } from '../constants';
import WalletTopUpFailure from './WalletTopUpFailure';

const WalletTopUpFailurePage = () => {
    return (
        <div style={wrapperStyle}>
            <WalletTopUpFailure isOpen={true} />
        </div>
    );
};

export default WalletTopUpFailurePage;
