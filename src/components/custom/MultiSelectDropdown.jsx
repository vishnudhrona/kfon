import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';

/**
 * Generic multi-select dropdown with checkbox list and optional search.
 *
 * Props (react-select-style):
 *   options          {object[]}   List of option objects. Default shape: { value, label }.
 *   value            {object[]}   Array of selected option objects (controlled).
 *   onChange         {Function}   (selectedOptions: object[]) => void
 *   placeholder      {string}     Trigger label when nothing selected. Default: 'Select'
 *   icon             {node}       Optional prefix rendered inside the trigger button.
 *   searchable       {boolean}    Show search input. Default: true
 *   valueKey         {string}     Key used as the unique identifier. Default: 'value'
 *   labelKey         {string}     Key used as the display label.    Default: 'label'
 *   renderOption     {Function}   (option, isSelected) => ReactNode  Custom row renderer.
 *   renderTriggerLabel {Function} (selectedOptions) => string         Custom trigger text.
 *   menuWidth        {string}     CSS width of the dropdown panel. Default: '260px'
 *   maxMenuHeight    {string}     CSS max-height of the option list. Default: '240px'
 *   isDisabled       {boolean}    Disable the trigger. Default: false
 */
const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select',
  icon,
  searchable = true,
  valueKey = 'value',
  labelKey = 'label',
  renderOption,
  renderTriggerLabel,
  menuWidth = '260px',
  maxMenuHeight = '240px',
  isDisabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getOptValue = (opt) => opt[valueKey];
  const getOptLabel = (opt) => opt[labelKey];
  const isOptSelected = (opt) => value.some((v) => v[valueKey] === getOptValue(opt));

  const toggle = (opt) => {
    if (!onChange) return;
    onChange(isOptSelected(opt) ? value.filter((v) => v[valueKey] !== getOptValue(opt)) : [...value, opt]);
  };

  const clearAll = () => onChange?.([]);

  const filtered =
    searchable && query ? options.filter((o) => getOptLabel(o).toLowerCase().includes(query.toLowerCase())) : options;

  const triggerLabel = renderTriggerLabel
    ? renderTriggerLabel(value)
    : value.length === 0
      ? `${placeholder}: All`
      : value.length === 1
        ? getOptLabel(value[0])
        : `${placeholder} (${value.length})`;

  return (
    <Box ref={ref} position='relative' display='inline-block'>
      {/* Trigger button */}
      <Flex
        as='button'
        type='button'
        align='center'
        gap='6px'
        h='38px'
        px='12px'
        border='1.5px solid'
        borderColor={open ? 'primary.500' : 'gray.200'}
        borderRadius='8px'
        bg={open ? 'primary.50' : 'white'}
        color={open ? 'primary.700' : 'gray.700'}
        fontSize='13px'
        fontWeight='500'
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        opacity={isDisabled ? 0.5 : 1}
        transition='all 0.15s'
        _hover={!isDisabled ? { borderColor: 'primary.400' } : undefined}
        whiteSpace='nowrap'
        userSelect='none'
        onClick={() => !isDisabled && setOpen((o) => !o)}
      >
        {icon && (
          <Box as='span' lineHeight='1' flexShrink={0}>
            {icon}
          </Box>
        )}
        <Text as='span' fontSize='13px' fontWeight='500'>
          {triggerLabel}
        </Text>
        {value.length > 0 && (
          <Flex
            as='span'
            bg='primary.500'
            color='white'
            borderRadius='full'
            fontSize='10px'
            fontWeight='700'
            minW='18px'
            h='18px'
            align='center'
            justify='center'
            px='4px'
          >
            {value.length}
          </Flex>
        )}
        <Text as='span' opacity={0.5} fontSize='10px'>
          {open ? '▴' : '▾'}
        </Text>
      </Flex>

      {/* Dropdown panel */}
      {open && (
        <Box
          position='absolute'
          top='calc(100% + 6px)'
          left='0'
          zIndex={50}
          bg='white'
          border='1px solid'
          borderColor='gray.200'
          borderRadius='10px'
          boxShadow='0 8px 24px rgba(0,0,0,0.10)'
          p='10px'
          w={menuWidth}
          minW='180px'
        >
          {searchable && (
            <Box
              as='input'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search…'
              fontSize='12px'
              w='100%'
              px='10px'
              py='7px'
              border='1px solid'
              borderColor='gray.200'
              borderRadius='6px'
              mb='8px'
              display='block'
              outline='none'
            />
          )}

          <Box maxH={maxMenuHeight} overflowY='auto'>
            {filtered.length === 0 ? (
              <Text fontSize='12px' color='gray.400' px='10px' py='8px' textAlign='center'>
                No options found
              </Text>
            ) : (
              filtered.map((opt) => {
                const selected = isOptSelected(opt);
                if (renderOption) {
                  return (
                    <Box key={getOptValue(opt)} onClick={() => toggle(opt)} cursor='pointer'>
                      {renderOption(opt, selected)}
                    </Box>
                  );
                }
                return (
                  <Flex
                    key={getOptValue(opt)}
                    as='label'
                    align='center'
                    gap='9px'
                    px='10px'
                    py='7px'
                    borderRadius='6px'
                    fontSize='13px'
                    cursor='pointer'
                    bg={selected ? 'primary.50' : 'transparent'}
                    _hover={{ bg: 'primary.50' }}
                    transition='background 0.12s'
                  >
                    <input
                      type='checkbox'
                      checked={selected}
                      onChange={() => toggle(opt)}
                      style={{ accentColor: 'var(--chakra-colors-primary-500)', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <Text flex='1' fontSize='13px' color='gray.700' noOfLines={1}>
                      {getOptLabel(opt)}
                    </Text>
                    {opt.count !== undefined && (
                      <Text fontSize='11px' color='gray.400' fontWeight='600' flexShrink={0}>
                        {opt.count}
                      </Text>
                    )}
                  </Flex>
                );
              })
            )}
          </Box>

          <Flex
            justify='space-between'
            align='center'
            pt='8px'
            mt='6px'
            borderTop='1px solid'
            borderColor='gray.100'
            fontSize='12px'
          >
            <Text
              as='button'
              type='button'
              border='none'
              bg='transparent'
              color='primary.500'
              fontWeight='600'
              cursor='pointer'
              _hover={{ color: 'primary.700' }}
              onClick={clearAll}
            >
              Clear all
            </Text>
            <Text
              as='button'
              type='button'
              border='none'
              bg='transparent'
              color='primary.500'
              fontWeight='600'
              cursor='pointer'
              _hover={{ color: 'primary.700' }}
              onClick={() => setOpen(false)}
            >
              Apply
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default MultiSelectDropdown;
