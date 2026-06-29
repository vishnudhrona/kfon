import { HStack, Input } from '@kfonbss/bss-ui-components';
import { useRef } from 'react';

/**
 * Multi-box OTP input. value/onChange work on the joined string (e.g. "123456").
 */
const OtpInput = ({ length = 6, value = '', onChange, error, disabled = false, autoFocus = false }) => {
  const inputRefs = useRef([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = (idx, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    onChange(next.join(''));
    if (digit && idx < length - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(length).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next.join(''));
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <HStack gap='10px' justifyContent='space-between'>
      {digits.map((digit, idx) => (
        <Input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          value={digit}
          autoFocus={autoFocus && idx === 0}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          maxLength={1}
          inputMode='numeric'
          pattern='[0-9]*'
          textAlign='center'
          fontSize='20px'
          fontWeight={600}
          h='56px'
          w='56px'
          p={0}
          placeholder='-'
          borderColor={error ? 'red.400' : 'gray.300'}
          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
          borderRadius='8px'
        />
      ))}
    </HStack>
  );
};

export default OtpInput;
