import { Box, Flex } from '@kfonbss/bss-ui-components';
import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Renders children in a wrapping flex row with vertical dividers between items.
 * Dividers are automatically hidden for items that wrap to a new line.
 * Each direct child is treated as one item; wrap multi-element groups in a single element.
 */
const DividerRow = ({ children, rowGap = '8px', dividerColor = '#D1D5DB', dividerMx = '12px', ...rest }) => {
  const containerRef = useRef(null);
  const [firstOnRow, setFirstOnRow] = useState(new Set());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const items = Array.from(container.children);
      const newFirstOnRow = new Set();
      let prevTop = null;
      items.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        if (prevTop === null || Math.abs(top - prevTop) > 2) {
          newFirstOnRow.add(i);
          prevTop = top;
        }
      });
      setFirstOnRow(newFirstOnRow);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [children]);

  const items = [];
  let idx = 0;
  for (const child of Array.isArray(children) ? children : [children]) {
    if (!child) continue;
    items.push(
      <Box
        key={idx}
        display='flex'
        alignItems='center'
        gap={dividerMx}
        flexShrink={0}
      >
        {idx > 0 && (
          <Box
            w='1px'
            h='20px'
            bg={firstOnRow.has(idx) ? 'transparent' : dividerColor}
            flexShrink={0}
          />
        )}
        {child}
      </Box>
    );
    idx++;
  }

  return (
    <Flex ref={containerRef} flexWrap='wrap' alignItems='center' gap={rowGap} {...rest}>
      {items}
    </Flex>
  );
};

export default DividerRow;
