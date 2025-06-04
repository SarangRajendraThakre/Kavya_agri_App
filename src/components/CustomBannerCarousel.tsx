// components/BannerCarousel.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  Platform, // Import Platform for platform-specific styles
} from 'react-native';

// Import your responsive utility functions
import { screenWidth, moderateScale, verticalScale } from '../../src/utils/Scaling'; // Adjust path based on your file structure

// Adjust ITEM_WIDTH and SPACING using responsive scales
const ITEM_WIDTH = moderateScale(320);
const SPACING = moderateScale(15);

const AUTO_SCROLL_INTERVAL = 3000; // Auto-scroll every 3 seconds
// Increased CLONE_COUNT for a larger buffer, improving smoothness
const CLONE_COUNT = 5; // Number of items to clone at the beginning and end for infinite scroll (increased)

// Define the type for a single banner item
interface BannerItem {
  id: string;
  image: any;
}

// Define the type for the component's props
interface BannerCarouselProps {
  data: BannerItem[];
}

const CustomBannerCarousel: React.FC<BannerCarouselProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Index for the ORIGINAL data
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const userIsInteracting = useRef<boolean>(false);
  const isMounted = useRef(false); // To prevent state updates on unmounted component

  // Prepare data for infinite scroll (cloning items)
  const infiniteData = useMemo(() => {
    if (data.length === 0) return [];
    // Ensure enough clones for a smooth transition, even with small original data
    const effectiveCloneCount = Math.max(CLONE_COUNT, data.length); // Use CLONE_COUNT or originalDataLength, whichever is greater
    const clonedStart = data.slice(-effectiveCloneCount);
    const clonedEnd = data.slice(0, effectiveCloneCount);
    return [...clonedStart, ...data, ...clonedEnd];
  }, [data]);

  const originalDataLength = data.length;
  // The starting index of the *original* data within the infiniteData array
  const initialPaddedIndex = CLONE_COUNT; // This remains CLONE_COUNT, as it's the size of the initial clone buffer

  // Calculate the offset needed to bring the item's start to the visual center of the screen
  const centerOffset = (screenWidth - ITEM_WIDTH) / 2;
  // Calculate the full width of an item including its right margin
  const itemFullWidth = ITEM_WIDTH + SPACING;

  // --- Scroll Handlers and Logic for Infinite Loop ---

  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false } // Required for scrollX interpolation with Animated.View styles
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<any> }) => {
      if (viewableItems.length > 0) {
        const newVisiblePaddedIndex = viewableItems[0].index !== undefined ? viewableItems[0].index : 0;
        // Map the padded index back to the original data index
        let originalIndex = (newVisiblePaddedIndex - initialPaddedIndex);
        if (originalIndex < 0) {
          originalIndex = originalDataLength + originalIndex; // Handle negative indices from cloned start
        } else if (originalIndex >= originalDataLength) {
          originalIndex = originalIndex % originalDataLength; // Handle indices from cloned end
        }

        // Only update if the index is valid and different
        if (originalIndex >= 0 && originalIndex < originalDataLength && originalIndex !== activeIndex) {
            if (isMounted.current) { // Prevent state update on unmounted component
                setActiveIndex(originalIndex);
            }
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Consider item visible if 50% is in view
    minimumViewTime: 100, // Wait 100ms before considering it viewable
    waitForDebounce: 100, // Debounce viewability events
  }).current;

  // Function to perform the instant jump when reaching clones
  const onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    userIsInteracting.current = false; // User interaction has ended

    const contentOffset = event.nativeEvent.contentOffset.x;
    // Calculate the index based on the contentOffset and itemFullWidth
    const currentIndex = Math.round(contentOffset / itemFullWidth);

    if (originalDataLength === 0) {
      startAutoScroll();
      return;
    }

    let newScrollIndex = currentIndex;
    let shouldJump = false;

    // If we scrolled into the cloned start (items before original data)
    if (currentIndex < initialPaddedIndex) {
      // Jump to the corresponding index in the original data block at the end
      newScrollIndex = originalDataLength + currentIndex;
      shouldJump = true;
    }
    // If we scrolled into the cloned end (items after original data)
    else if (currentIndex >= originalDataLength + initialPaddedIndex) {
      // Jump to the corresponding index in the original data block at the beginning
      newScrollIndex = currentIndex - originalDataLength;
      shouldJump = true;
    }

    if (shouldJump && flatListRef.current) {
      // Perform an instant jump without animation
      flatListRef.current.scrollToIndex({
        index: newScrollIndex,
        animated: false,
        offset: (newScrollIndex * itemFullWidth),
        viewOffset: centerOffset,
      });
      // setActiveIndex will be handled by onViewableItemsChanged after the jump settles
    }
    startAutoScroll(); // Resume auto-scroll after momentum ends (and potential jump)
  }, [originalDataLength, itemFullWidth, centerOffset, initialPaddedIndex, startAutoScroll]);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    if (originalDataLength === 0) return;

    autoScrollTimer.current = setInterval(() => {
      if (!userIsInteracting.current) {
        // Calculate the next padded index.
        // We scroll to the logical "next" item in the infinite sequence.
        const currentPaddedIndex = Math.round(scrollX._value / itemFullWidth);
        let nextPaddedIndex = currentPaddedIndex + 1;

        // If we are at the very end of the infiniteData (last cloned item),
        // we smoothly scroll to that last cloned item.
        // The onMomentumScrollEnd will then instantly jump back to the start of the original section.
        if (nextPaddedIndex >= infiniteData.length) {
            nextPaddedIndex = initialPaddedIndex; // Wrap around to the start of the "original" section in the main block
            // This is the key change: we directly scroll to the initial padded index
            // and let onMomentumScrollEnd handle the true invisible jump
        }

        flatListRef.current?.scrollToIndex({
          index: nextPaddedIndex,
          animated: true,
          offset: (nextPaddedIndex * itemFullWidth),
          viewOffset: centerOffset,
        });
      }
    }, AUTO_SCROLL_INTERVAL);
  }, [originalDataLength, itemFullWidth, centerOffset, initialPaddedIndex, infiniteData.length, scrollX]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true; // Set ref to true when component mounts

    // Initial scroll to the start of the original data block
    if (flatListRef.current && infiniteData.length > 0 && originalDataLength > 0) {
      // Small delay to ensure FlatList layout is complete and stable
      // A small delay is often necessary for `scrollToIndex` to work reliably on initial render
      const initialScrollDelay = 50;
      const timeoutId = setTimeout(() => {
        if (flatListRef.current) { // Check ref again in case component unmounted during delay
            flatListRef.current.scrollToIndex({
              index: initialPaddedIndex,
              animated: false, // Initial jump should be instant
              offset: (initialPaddedIndex * itemFullWidth),
              viewOffset: centerOffset,
            });
            setActiveIndex(0); // Set initial active index to the first original item
            startAutoScroll(); // Start auto-scrolling after initial positioning
        }
      }, initialScrollDelay);
      return () => clearTimeout(timeoutId); // Clear timeout if component unmounts
    }

    return () => {
      isMounted.current = false; // Set ref to false when component unmounts
      stopAutoScroll(); // Clear on unmount
    };
  }, [startAutoScroll, stopAutoScroll, infiniteData.length, originalDataLength, initialPaddedIndex, itemFullWidth, centerOffset]);

  const onScrollBeginDrag = useCallback(() => {
    userIsInteracting.current = true;
    stopAutoScroll();
  }, [stopAutoScroll]);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<BannerItem>) => {
    // const isCloned = index < initialPaddedIndex || index >= originalDataLength + initialPaddedIndex;

    // Calculate the actual scroll position of the current item's center
    // The scale will be 1 when the item is perfectly centered.
    // It will scale down when the item is one full itemWidth to the left or right of center.
    const scrollForItemStart = (index * itemFullWidth); // Position of the item's left edge
    const scrollForItemCenter = scrollForItemStart - centerOffset; // ScrollX value when this item is truly centered

    const inputRange = [
      scrollForItemCenter - itemFullWidth,
      scrollForItemCenter,
      scrollForItemCenter + itemFullWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85], // Scales down to 85% when off-center
      extrapolate: 'clamp', // Clamps values to the outputRange
    });

    return (
      <Animated.View
        style={[
          styles.bannerContainer,
          {
            transform: [{ scale }],
            width: ITEM_WIDTH,
          },
          // Apply marginRight only if it's not the last item in the entire infiniteData array
          index < infiniteData.length - 1 && { marginRight: SPACING },
        ]}
      >
        <Image
          source={item.image}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        {/* Optional: Indicator for cloned items (for debugging) */}
        {/* {isCloned && (
          <View style={{position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,0,0,0.5)', padding: 5}}>
            <Text style={{color: 'white', fontSize: 10}}>CLONE</Text>
          </View>
        )} */}
      </Animated.View>
    );
  }, [scrollX, itemFullWidth, infiniteData.length, centerOffset]);


  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No banners to display.</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselWrapper}>
      <FlatList<BannerItem>
        ref={flatListRef}
        data={infiniteData} // Use the extended data array for FlatList
        renderItem={renderItem}
        // Key extractor should generate unique keys for cloned items as well
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={[
          styles.flatListContentContainer,
          {
            paddingLeft: centerOffset, // Centers the first item initially
            paddingRight: centerOffset, // Centers the last item by providing trailing space
          }
        ]}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={() => { /* Not used to restart auto-scroll, onMomentumScrollEnd does */ }}
        onMomentumScrollEnd={onMomentumScrollEnd} // Use the custom handler for jumps and auto-scroll restart
        // Calculate snapToOffsets based on the item's full width.
        // snapToAlignment="start" means the item's start will align with the calculated offset.
        // The snapToOffsets should align the START of each item.
        snapToOffsets={infiniteData.map((_, i) => i * itemFullWidth)}
        snapToAlignment="start" // Align the start of the item to the snap point
      />
      {/* Pagination Dots (still based on original data) */}
      <View style={styles.paginationDotsContainer}>
        {data.map((_, index) => {
          // The scrollX value when the *original* item `index` is truly centered.
          // This corresponds to the `initialPaddedIndex + index` item in `infiniteData`.
          const paddedItemEffectiveIndex = initialPaddedIndex + index;
          const centeredScrollPosition = (paddedItemEffectiveIndex * itemFullWidth) - centerOffset;

          const inputRange = [
            centeredScrollPosition - itemFullWidth,
            centeredScrollPosition,
            centeredScrollPosition + itemFullWidth,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [moderateScale(8), moderateScale(20), moderateScale(8)],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#ccc', '#333', '#ccc'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    paddingVertical: verticalScale(10),
    // Added horizontal padding for the entire carousel container
    paddingHorizontal: moderateScale(0), // Adjust this value to add space around the FlatList
  },
  flatListContentContainer: {
    // This is explicitly for the FlatList content.
    // The `paddingLeft` and `paddingRight` here are crucial to allow
    // the first and last items to be centered when snapped to.
    // They are calculated dynamically in the component.
    // No explicit paddingRight here, let `centerOffset` handle it.
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(200),
    width: screenWidth,
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#888',
  },
  bannerContainer: {
    // Width is now handled by inline style in renderItem for scaling consistency
    // marginRight is moved to inline style in renderItem for last item handling
    borderRadius: moderateScale(10),
    overflow: 'hidden', // Essential for shadow to work on rounded corners
    // Shadows for Android and iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bannerImage: {
    width: '100%',
    height: verticalScale(170),
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  dot: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginHorizontal: moderateScale(4),
    backgroundColor: '#ccc',
  },
});

export default CustomBannerCarousel;