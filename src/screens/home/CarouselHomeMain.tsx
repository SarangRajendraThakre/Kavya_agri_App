// src/screens/CarouselHomeMain.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { fontR, moderateScale, scale, screenWidth, verticalScale } from '../../utils/Scaling';
import CarouselCardItem from './CarouselCardItem';
import { StackScreenProps } from '@react-navigation/stack';

// --- MODIFIED: Import RootDrawerParamList for proper typing ---
import { navigate } from '../../utils/NavigationUtils';
import { RootDrawerParamList } from '../../types'; // Assuming your types.ts is in the root or a common 'types' folder
// --- END MODIFIED ---

// --- MODIFIED: Adjust RootStackParamList to reflect the actual navigation structure and types ---
// If HomeMain is part of a stack that *also* contains CareerAdda, then it should be here.
// However, given your types.ts, CareerAdda (Explore) is likely in a drawer navigator.
// We'll adjust this type to match the navigation behavior:
type HomeMainStackParamList = {
  HomeMain: undefined;
  // If CareerAdda is directly accessible from this stack
  // CareerAdda: { scrollToSection?: 'programBenefits' } | undefined;
  // Otherwise, it might be navigating via a Drawer/Tab navigator
};
// --- END MODIFIED ---

// --- MODIFIED: Update CarouselHomeMainProps to use the correct navigation type
// If CarouselHomeMain is in a Stack Navigator, and that Stack Navigator can push Drawer screens,
// then StackScreenProps<RootDrawerParamList, 'HomeMain'> might be more appropriate,
// or a combined type. For simplicity, we'll keep it as StackScreenProps for its own context
// but ensure `Maps` function properly handles the destination.
type CarouselHomeMainProps = StackScreenProps<HomeMainStackParamList, 'HomeMain'> & { // Keep HomeMainStackParamList for its direct stack context
  onExploreProgramOverview: () => void; // Existing prop for scrolling within HomeMain
};
// --- END MODIFIED ---

export interface CarouselItem {
  title: string;
  body: string;
  illustration: string | number;
}

const SPACING = moderateScale(15);
export const ITEM_WIDTH = Math.round(screenWidth * 0.8);
const FLAT_LIST_REF_WIDTH = ITEM_WIDTH + SPACING;

const originalData: CarouselItem[] = [
  {
    title: 'Program Introduction',
    body: 'Embark on a transformative journey with us! Discover what awaits you in this exciting program.',
    illustration: require('../../assets/images/Slider/2.png'),
  },
  {
    title: 'Program Overview', // Ensure this title matches exactly
    body: 'Get a comprehensive look at our curriculum, modules, and key learning outcomes. Your future starts here.',
    illustration: require('../../assets/images/Slider/ProgramOverview.jpg')
  },
  {
    title: 'Program Benefits',
    body: 'Unlock your full potential! Gain valuable skills, enhance your career prospects, and connect with experts.',
    illustration: require('../../assets/images/Slider/prob.jpg'),
  },
  {
    title: 'Certificates',
    body: 'Earn industry-recognized certifications that validate your expertise and boost your professional credibility.',
    illustration: require('../../assets/images/Slider/certi.jpg'),
  },
  {
    title: '', // Added a title for the enroll card to match switch case
    body: '',
    illustration: require('../../assets/images/Slider/enroll.jpg'),
  },
];

const LOOPS_COUNT = 1;
const REAL_DATA_LENGTH = originalData.length;

const loopedData: CarouselItem[] = [
  ...originalData.slice(REAL_DATA_LENGTH - LOOPS_COUNT),
  ...originalData,
  ...originalData.slice(0, LOOPS_COUNT),
];

const INITIAL_SCROLL_INDEX = LOOPS_COUNT;

const CarouselHomeMain: React.FC<CarouselHomeMainProps> = ({ navigation, onExploreProgramOverview }) => {
  const flatListRef = useRef<FlatList<CarouselItem> | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    autoPlayIntervalRef.current = setInterval(() => {
      setActiveSlide((prevOriginalIndex) => {
        const nextOriginalIndex = (prevOriginalIndex + 1) % REAL_DATA_LENGTH;

        let targetLoopedIndex = (prevOriginalIndex + 1) + LOOPS_COUNT;

        if (prevOriginalIndex === REAL_DATA_LENGTH - 1) {
          targetLoopedIndex = REAL_DATA_LENGTH + LOOPS_COUNT;
        }

        flatListRef.current?.scrollToIndex({
          index: targetLoopedIndex,
          animated: true,
        });

        return nextOriginalIndex;
      });
    }, 4000);
  }, []);

  const pauseAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const initialScrollTimeout = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: INITIAL_SCROLL_INDEX,
        animated: false,
      });
      startAutoPlay();
    }, 100);

    return () => {
      clearTimeout(initialScrollTimeout);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [startAutoPlay]);

  const onScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentLoopedIndex = Math.round(contentOffsetX / FLAT_LIST_REF_WIDTH);

    if (currentLoopedIndex >= REAL_DATA_LENGTH + LOOPS_COUNT) {
      flatListRef.current?.scrollToIndex({
        index: INITIAL_SCROLL_INDEX,
        animated: false,
      });
      setActiveSlide(0);
    } else if (currentLoopedIndex < LOOPS_COUNT) {
      flatListRef.current?.scrollToIndex({
        index: REAL_DATA_LENGTH - 1 + LOOPS_COUNT,
        animated: false,
      });
      setActiveSlide(REAL_DATA_LENGTH - 1);
    } else {
      setActiveSlide(currentLoopedIndex - LOOPS_COUNT);
    }

    startAutoPlay();
  }, [startAutoPlay]);

  const onScrollBegin = useCallback(() => {
    pauseAutoPlay();
  }, [pauseAutoPlay]);

  const handleExploreButtonPress = useCallback((item: CarouselItem) => {
    switch (item.title) {
      case 'Program Introduction':
        navigate('CareerAdda'); // Navigates to CareerAdda (Explore screen) without specific scroll
        break;
      case 'Program Overview':
        onExploreProgramOverview(); // Calls the prop to scroll within the *current* HomeMain screen
        break;
      case 'Program Benefits':
        // --- MODIFIED: Navigate to 'Explore' (your CareerAdda screen) and pass the scroll parameter ---
        navigate('CareerAdda', { scrollToSection: 'programBenefits' }); // 'Explore' should be the screen name in your navigator
        // --- END MODIFIED ---
        break;
     
      
      case 'Certificates':
        navigate('CertificateScreen');
        break;
      default:
        console.log(`No specific route for explore button on: ${item.title}`);
          navigate('PaymentDetail');
        break;
    }
    // --- MODIFIED: Add 'Explore' to dependencies because 'navigate' is used with it
  }, [navigate, onExploreProgramOverview]); // Added navigate to dependencies if it's imported
  // --- END MODIFIED ---

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={loopedData}
        renderItem={({ item, index }) => (
          <CarouselCardItem
            item={item}
            index={index}
            itemWidth={ITEM_WIDTH}
            onPressExplore={handleExploreButtonPress} // Pass the handler
          />
        )}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        snapToInterval={FLAT_LIST_REF_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContentContainer}
        getItemLayout={(data, index) => ({
          length: FLAT_LIST_REF_WIDTH,
          offset: FLAT_LIST_REF_WIDTH * index,
          index,
        })}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={onScrollBegin}
        initialScrollIndex={INITIAL_SCROLL_INDEX}
        onLayout={() => {
          flatListRef.current?.scrollToIndex({
            index: INITIAL_SCROLL_INDEX,
            animated: false,
          });
        }}
      />

      <View style={styles.paginationContainer}>
        {originalData.map((_, index: number) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  flatListContentContainer: {
    paddingHorizontal: SPACING / 2,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  paginationDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(5),
  },
  paginationDotActive: {
    backgroundColor: '#666',
  },
  paginationDotInactive: {
    backgroundColor: '#bbb',
  },
});

export default CarouselHomeMain;