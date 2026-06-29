import { Button } from '@kfonbss/bss-ui-components';
// import PropTypes from 'prop-types';

const Toggle = ({ checked = false, onChange = () => {}, disabled = false, size = 'sm', checkedText = '', uncheckedText = '', textColor='' }) => {
  const hasText = !!checkedText || !!uncheckedText;
  const defaultWidth = size === 'sm' ? 36 : 48;
  const height = size === 'sm' ? 20 : 26;
  const knob = size === 'sm' ? 14 : 20;

  return (
    <Button
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
      role='switch'
      aria-checked={checked}
      variant='ghost'
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: hasText ? 'space-between' : (checked ? 'flex-end' : 'flex-start'),
        flexDirection: hasText && checked ? 'row-reverse' : 'row',
        width: hasText ? 'auto' : `${defaultWidth}px`,
        minWidth: hasText ? (size === 'sm' ? '70px' : '90px') : undefined,
        height: `${height}px`,
        padding: hasText ? '5px 8px' : '3px',
        borderRadius: `${height}px`,
        background: checked ? (textColor || 'var(--chakra-colors-primary-500)') : 'var(--chakra-colors-gray-200)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease'
      }}
    >
      <span
        style={{
          width: `${knob}px`,
          height: `${knob}px`,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          display: 'inline-block',
          flexShrink: 0
        }}
      />
      {hasText && (
        <span
          style={{
            fontSize: size === 'sm' ? '12px' : '14px',
            fontWeight: '600',
            color: 'var(--chakra-colors-gray-600)',
            padding: checked ? '0 8px 0 4px' : '0 4px 0 8px',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {checked ? checkedText : uncheckedText}
        </span>
      )}
    </Button>
  );
};

// Toggle.propTypes = {
//   checked: PropTypes.bool,
//   onChange: PropTypes.func,
//   disabled: PropTypes.bool,
//   size: PropTypes.oneOf(['sm', 'md'])
// };

export default Toggle;
