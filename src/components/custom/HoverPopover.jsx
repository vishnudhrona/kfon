import { Popover, Portal } from '@kfonbss/bss-ui-components';
import { useState } from 'react';

const HoverPopover = ({ trigger, content, placement = 'bottom', minW = '220px' }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={() => {}} positioning={{ placement }}>
      <Popover.Trigger asChild>
        <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          {trigger}
        </span>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width='auto'
            minW={minW}
            borderRadius='16px'
            boxShadow='0px 4px 24px rgba(0,0,0,0.10)'
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <Popover.Arrow />
            <Popover.Body p='0'>{content}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default HoverPopover;
