import { Box, HStack } from '@kfonbss/bss-ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import MainCardBg from '@/assets/corporate/MainCardBg.png';

/**
 * Props:
 *  index            — serial number shown in col 1 (hidden on mobile)
 *  isExpanded       — controlled expand state
 *  onToggle         — called when header bg or toggle arrow is clicked
 *  toggleIcon       — JSX for the toggle icon (up/down arrow)
 *  collapsedContent — JSX for col 2 of the header row (grows, text selectable, stops propagation)
 *  expandedContent  — JSX rendered in the animated row below the header (white bg)
 *  actionMenu       — JSX shown below toggle icon (e.g. TableActionMenu)
 *  hideActionMenu   — suppresses actionMenu slot
 *  bg               — header background color (default '#FFFDF6')
 *  backgroundImage  — optional watermark image for header (default MainCardBg)
 *  borderColor      — { collapsed, expanded } border colors
 *  headerCursor     — cursor on header background area (default 'pointer')
 *  children         — rendered after the card box (e.g. portals: LocationViewPopup, MeetingList)
 */
const ExpandableCard = memo(({
  index,
  isExpanded,
  onToggle,
  toggleIcon,
  collapsedContent,
  expandedContent,
  actionMenu,
  hideActionMenu = false,
  bg = '#FFFDF6',
  backgroundImage = MainCardBg,
  backgroundSize = '40% auto',
  backgroundPosition = 'center',
  overlayOpacity = 0.9,
  watermarkFullCard = false,
  expandedBg = 'white',
  centerSideItemsOnExpand = false,
  borderColor = { collapsed: 'gray.200', expanded: '#EFDD9D' },
  headerCursor = 'pointer',
  children
}) => {
  // Watermark styling (bg + image + fading overlay). Applied to the whole card
  // when watermarkFullCard is set, otherwise only to the header section.
  const watermarkStyles = backgroundImage
    ? {
      bg,
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition,
      backgroundSize,
      css: { backgroundBlendMode: 'multiply' },
      _before: {
        content: '""',
        position: 'absolute',
        inset: 0,
        bg,
        opacity: overlayOpacity,
        pointerEvents: 'none'
      }
    }
    : { bg };

  return (
    <HStack w='full' spacing={0} alignItems='start'>
      <Box
        flex={1}
        position='relative'
        border='1px solid'
        borderColor={isExpanded ? borderColor.expanded : borderColor.collapsed}
        borderRadius='12px'
        overflow='hidden'
        {...(watermarkFullCard ? watermarkStyles : {})}
      >
        {/* Header: bg + watermark + 4-col grid */}
        <Box
          position='relative'
          {...(watermarkFullCard ? { bg: 'transparent' } : watermarkStyles)}
          cursor={headerCursor}
          onClick={onToggle}
        >
          <Box
            display='grid'
            gridTemplateColumns='auto 1fr auto'
            alignItems='center'
            px={4}
            py={3}
            gap={4}
            position='relative'
          >
            {/* Col 1: index (hidden-but-spaced when centered to full height on expand) */}
            {index !== undefined && (
              <Box
                fontWeight='bold'
                color='black'
                minW='20px'
                display={{ base: 'none', md: 'block' }}
                visibility={centerSideItemsOnExpand && isExpanded ? 'hidden' : 'visible'}
              >
                {index}
              </Box>
            )}

            {/* Col 2: content — userSelect enables copy; click bubbles to header for toggle */}
            <Box flex={1} minW={0} userSelect='text'>
              {collapsedContent}
            </Box>

            {/* Col 3: toggle arrow + action menu — stopPropagation prevents double-fire with header */}
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap={2}
              flexShrink={0}
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              cursor='pointer'
            >
              <Box
                w='30px'
                h='30px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                cursor='pointer'
                zIndex={2}
              >
                {toggleIcon}
              </Box>

              <AnimatePresence initial={false}>
                {!hideActionMenu && actionMenu && isExpanded && !centerSideItemsOnExpand && (
                  <motion.div
                    key='action-menu'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actionMenu}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Box>

        {/* Expanded content row */}
        <AnimatePresence initial={false}>
          {isExpanded && expandedContent && (
            <motion.div
              key='expanded-content'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <Box position='relative' bg={expandedBg} px={4} py={3} onClick={(e) => e.stopPropagation()}>
                {expandedContent}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full-height centered side items (opt-in, expanded only) */}
        {centerSideItemsOnExpand && isExpanded && index !== undefined && (
          <Box
            position='absolute'
            left={4}
            top='50%'
            transform='translateY(-50%)'
            fontWeight='bold'
            color='black'
            zIndex={2}
            pointerEvents='none'
            display={{ base: 'none', md: 'block' }}
          >
            {index}
          </Box>
        )}
        {centerSideItemsOnExpand && isExpanded && !hideActionMenu && actionMenu && (
          <Box
            position='absolute'
            right={4}
            top='50%'
            transform='translateY(-50%)'
            zIndex={2}
            onClick={(e) => e.stopPropagation()}
          >
            {actionMenu}
          </Box>
        )}
      </Box>

      {/* Portal siblings (popups, dialogs) */}
      {children}
    </HStack>
  );
});

ExpandableCard.displayName = 'ExpandableCard';

export default ExpandableCard;
