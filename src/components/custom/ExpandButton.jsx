import { Box, Button, Icons } from "@kfonbss/bss-ui-components";

const ExpandButton = ({ isAllExpanded, setIsAllExpanded }) => {
    const { ExpandIcon, ContractIcon } = Icons;

    return (
        <Box display={'flex'} bg={'#F2F4F7'} borderRadius='md' p='4px' h={'40px'} alignItems={'center'} spacing={1}>
            <Button
                bg={!isAllExpanded ? 'white' : 'none'}
                w='32px'
                h='32px'
                boxShadow={!isAllExpanded ? 'sm' : 'none'}
                borderRadius='md'
                _hover={{ bg: !isAllExpanded ? 'white' : 'gray.300' }}
                onClick={() => setIsAllExpanded(false)}
            >
                <ContractIcon color={!isAllExpanded ? 'primary.500' : '#98A2B3'} />
            </Button>
            <Button
                bg={isAllExpanded ? 'white' : 'none'}
                w='32px'
                h='32px'
                boxShadow={isAllExpanded ? 'sm' : 'none'}
                borderRadius='md'
                _hover={{ bg: isAllExpanded ? 'white' : 'gray.300' }}
                onClick={() => setIsAllExpanded(true)}
            >
                <ExpandIcon color={isAllExpanded ? 'primary.500' : '#98A2B3'} />
            </Button>
        </Box>
    )
}

export default ExpandButton;