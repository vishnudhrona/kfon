import { Icons, Input, InputGroup } from '@kfonbss/bss-ui-components';

const { SearchIcon } = Icons;

const SearchInput = (props) => {
  const { onChange, width, border, height, bg, placeholder, onKeyDown, ...rest } = props;
  return (
    <InputGroup endElement={<SearchIcon size={'md'} color='font_color.primary' />} width={width || '282px'}>
      <Input
        paddingInline='16px'
        height={height || '40px'}
        placeholder={placeholder || 'Search'}
        border={border || '1px solid #D1D5DB'}
        borderRadius='6px'
        onChange={onChange}
        bg={bg}
        {...rest}
        onKeyDown={onKeyDown}
      />
    </InputGroup>
  );
};

export default SearchInput;
