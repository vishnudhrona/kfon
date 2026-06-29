import { Button, Icons } from '@kfonbss/bss-ui-components';

const { ThreeDotActionIcon } = Icons;

const CommonActionButton = ({ onClick }) => (
    <Button
        size='sm'
        variant='ghost'
        bg='gray.100'
        borderRadius='full'
        w='32px'
        h='32px'
        minW='32px'
        p={0}
        onClick={onClick}
        aria-label='action'
        _hover={{ bg: 'primary.500', color: 'white' }}
    >
        <ThreeDotActionIcon boxSize='24px' transform='translate(2px, 2px)' />
    </Button>
);

export default CommonActionButton;
