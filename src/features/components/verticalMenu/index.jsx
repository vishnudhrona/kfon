import { VerticalMenu as CustomVerticalMenu } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getActiveSideMenuKey, getCurrentSideMenu } from '../selector';
const VerticalMenu = () => {
  const navigate = useNavigate();
  const currentSideMenu = useSelector(getCurrentSideMenu);
  const activeItem = useSelector(getActiveSideMenuKey);

  const handleItemSelect = useCallback(
    (item) => {
      if (item?.path) {
        navigate({ to: item.path });
      }
    },
    [navigate]
  );

  return <CustomVerticalMenu activeItem={activeItem} onItemSelect={handleItemSelect} items={currentSideMenu} />;
};

export default VerticalMenu;
