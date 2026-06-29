import GenericCardPage from '@/components/custom/GenericCardPage';

import { fetchWorkOrderList } from '../actions';
import { WORK_ORDER_TABLE_KEY } from '../constants';
import { getWorkOrderList } from '../selectors';
import WorkOrderCard from './WorkOrderCard';

const WorkOrderCardList = ({ actions }) => {
  return (
    <GenericCardPage
      dataSelector={getWorkOrderList}
      fetchAction={fetchWorkOrderList}
      tableKey={WORK_ORDER_TABLE_KEY}
      CardComponent={WorkOrderCard}
      columns={[]}
      actions={actions}
    />
  );
};

export default WorkOrderCardList;
