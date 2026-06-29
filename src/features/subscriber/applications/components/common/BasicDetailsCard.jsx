import { Box, Flex, Grid, Image, Text } from '@kfonbss/bss-ui-components';

function StatusPill({ value }) {
  if (!value) return null;
  return (
    <Box
      border='1px solid'
      borderColor='background.light_gray_bg'
      bg='white'
      color='text.pink'
      p={4}
      height='28px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      borderRadius='31px'
      fontSize='md'
      fontWeight='semibold'
      gap={2}
    >
      <Box w='6px' h='6px' borderRadius='full' bg='text.pink' />
      {value}
    </Box>
  );
}


function FieldValue({ field }) {
  const { value, type } = field;
  const isEmpty = value === undefined || value === null || value === '' || value === '-';

  if (isEmpty) {
    return (
      <Text fontSize='15.5px' fontWeight='500' color='#A3A3A3'>
        -
      </Text>
    );
  }

  if (type === 'status') return <StatusPill value={value} />;

  return (
    <Text
      fontSize='15.5px'
      fontWeight={type === 'mono' ? '500' : '600'}
      color='#272727'
      wordBreak='break-word'
      overflowWrap='anywhere'
      lineHeight='1.35'
      display='flex'
      alignItems='center'
      gap='6px'
    >
      {field.icon && (
        <Box as='span' color='#A3A3A3' flexShrink={0} display='inline-flex'>
          {field.icon}
        </Box>
      )}
      {value}
    </Text>
  );
}

function BasicDetailsCard({ title = 'Basic Details', columns = 3, photo, fields = [], actions }) {
  return (
    <Box
      bg='white'
      overflow='hidden'
      border='1px solid #f0eff2'
      borderRadius='22px'
      boxShadow='0 1px 2px rgba(20,19,26,.04), 0 18px 40px -22px rgba(20,19,26,.22)'
    >
      <Flex align='center' justify='space-between' gap='12px' px='30px' pt='24px' pb='4px' bg='white'>
        <Flex align='center' gap='10px'>
          <Box w='8px' h='8px' borderRadius='full' bg='#8D0247' flexShrink={0} />
          <Text as='h3' m={0} fontSize='17px' fontWeight='700' color='#272727' letterSpacing='-0.015em' whiteSpace='nowrap'>
            {title}
          </Text>
        </Flex>
        {actions && (
          <Flex align='center' gap='6px' flexShrink={0}>
            {actions}
          </Flex>
        )}
      </Flex>

      <Flex align='stretch' gap='36px' px='30px' pt='18px' pb='30px'>
        {photo?.src && (
          <Box flexShrink={0} alignSelf='flex-start'>
            <Image
              src={photo.src}
              alt='Applicant'
              width='124px'
              minH='152px'
              objectFit='cover'
              display='block'
              borderRadius='16px'
              boxShadow='0 0 0 1px #eeedf0, 0 14px 30px -14px rgba(20,19,26,.3)'
              bg='#F5F6FA'
            />
          </Box>
        )}

        <Grid
          flex={1}
          minW={0}
          templateColumns={`repeat(${columns}, minmax(0, 1fr))`}
          columnGap='44px'
          rowGap='26px'
        >
          {fields.map((field, i) => (
            <Box key={i} display='flex' flexDirection='column' gap='7px' minW={0}>
              <Text
                fontSize='10.5px'
                fontWeight='600'
                color='#A3A3A3'
                textTransform='uppercase'
                letterSpacing='0.09em'
                lineHeight='1.3'
              >
                {field.label}
              </Text>
              <FieldValue field={field} />
            </Box>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
}

export default BasicDetailsCard;
