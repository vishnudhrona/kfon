import { STATE_REDUCER_KEY } from './constants';
import saga from './saga';
import { reducer } from './slice';

export default { reducer, saga, STATE_REDUCER_KEY };
export { reducer, saga, STATE_REDUCER_KEY };
export { default as PartnerDashboard } from './PartnerDashboard';
