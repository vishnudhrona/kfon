import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import carousalImg from '@/assets/landingPage/carousal_dummy.png';
import { Box, Button, Flex, HStack, Image } from '@/components/custom';

const MotionBox = motion.create(Box);

const Carousel = () => {
  const images = [carousalImg, carousalImg, carousalImg, carousalImg];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const timeoutRef = useRef(null);
  const dragThreshold = 80;

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, images.length, isPaused]);

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    if (offset > dragThreshold && index > 0) {
      setIndex(index - 1);
    } else if (offset < -dragThreshold && index < images.length - 1) {
      setIndex(index + 1);
    }
    setIsDragging(false);
  };

  return (
    <Flex
      direction='column'
      align='center'
      w='full'
      overflow='hidden'
      position='relative'
      maxW='90%'
      mx='auto'
      p={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Box w='full' overflow='hidden' borderRadius='xl' position='relative' h={{ base: '250px', md: '500px' }}>
        <AnimatePresence mode='wait'>
          <MotionBox
            key={index}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{
              x,
              cursor: isDragging ? 'grabbing' : 'grab',
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Image
              src={images[index]}
              alt={`Slide ${index}`}
              w='full'
              h='full'
              objectFit='cover'
              borderRadius='xl'
              draggable='false'
            />
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Dots Navigation */}
      <HStack
        spacing={3}
        pos={'absolute'}
        bottom={'40px'}
        left={'50%'}
        transform={'translateX(-50%)'}
        bg={'#FFFB00'}
        padding={'8px 16px'}
        borderRadius={'99px'}
      >
        {images.map((_, i) => (
          <Button
            key={i}
            onClick={() => setIndex(i)}
            minW={'9px'}
            width={i === index ? '24px' : '9px'}
            h={'9px'}
            p={0}
            borderRadius='99px'
            bg={i === index ? 'primary.500' : 'primary.200'}
            _hover={{ bg: 'primary.500' }}
          />
        ))}
      </HStack>
    </Flex>
  );
};

export default Carousel;
