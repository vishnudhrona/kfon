import { Box } from "@kfonbss/bss-ui-components"

import { EditActionIcon } from "@/components/custom"

const CustomEditIcon = ({ onClick }) => {
    return (
        <Box
            cursor='pointer'
            border='1px solid #E2E8F0'
            borderRadius='full'
            h='32px'
            w='32px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            _hover={{
                bg: 'primary.500'
            }}
            bg={'gray.200'}
            onClick={onClick}
        >
            <EditActionIcon transform='translate(3px, 3px)' color={'primary.500'} _hover={{ color: 'white' }} />
        </Box>
    )
}

export default CustomEditIcon