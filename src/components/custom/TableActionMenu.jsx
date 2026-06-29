import { Box, Icons, Menu, Portal } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import PermissionGuard from '@/components/common/PermissionGuard';

const { ThreeDotActionIcon } = Icons;

const TableActionMenu = ({ actionItems = [], row = {}, disabled = false, zIndex = 100 }) => {
  const { t } = useTranslation();
  const visibleItems = actionItems.filter((item) => !item.hidden);
  if (visibleItems.length === 0 || disabled) return null;
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <Box
          display='flex'
          alignItems='center'
          bg={'gray.100'}
          justifyContent='center'
          borderRadius={'sm'}
          width='30px'
          height='30px'
          cursor='pointer'
          _hover={{ bg: 'primary.500', color: 'white' }}
        >
          <ThreeDotActionIcon
            boxSize='6'
            viewBox='-2.5 -2.5 25 25'
            style={{ transform: 'rotate(90deg)' }}
          />
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content bg='white' borderRadius='md' boxShadow='lg' py={2} zIndex={zIndex} minW='160px'>
            {visibleItems.map((item, idx) => {
              const itemContent = (
                <Menu.Item
                  key={item.id ?? item.label ?? idx}
                  px={4}
                  py={2}
                  cursor='pointer'
                  _hover={{ bg: 'gray.100' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.(row);
                  }}
                >
                  {item.component ? <item.component row={row} /> : t(item.label)}
                </Menu.Item>
              );

              if (item.permission) {
                return (
                  <PermissionGuard key={item.id ?? item.label ?? idx} action={item.permission} menuKey={item.menuKey}>
                    {itemContent}
                  </PermissionGuard>
                );
              }

              return itemContent;
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default TableActionMenu;
