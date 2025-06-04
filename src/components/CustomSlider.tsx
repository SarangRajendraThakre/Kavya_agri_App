import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ViewToken, Image, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { Extrapolation, interpolate, interpolateColor, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, scrollTo, runOnJS } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

// ✨ Import screenWidth and fontR from your utility file ✨
import { fontR, moderateScale, screenWidth } from '../utils/Scaling';
// If you plan to use Ionicons, ensure you have react-native-vector-icons installed and linked
// import Ionicons from 'react-native-vector-icons/Ionicons';

// 1. Define the ImageSliderType interface (kept in this file for consistency)
interface ImageSliderType {
  id: number;
  title: string;
  description: string;
  image: any; // Can be a local require('image.png') or { uri: 'http://...' }
}

// =============================================================================
// SliderItem3 Component
// =============================================================================
type SliderItem3Props = {
  item: ImageSliderType;
  index: number;
  scrollX: SharedValue<number>;
  imageWidthPercentage?: number;
  imageHeightPercentage?: number;
  itemContainerHeightMultiplier?: number;
  cardBorderRadius?: number;
  cardMarginHorizontal?: number;
  titleFontSize?: number;
  descriptionFontSize?: number;
  textContainerPadding?: number;
};

const SliderItem3 = ({
  item,
  index,
  scrollX,
  imageWidthPercentage,
  imageHeightPercentage,
  itemContainerHeightMultiplier,
  cardBorderRadius,
  cardMarginHorizontal,
  titleFontSize,
  descriptionFontSize,
  textContainerPadding,
}: SliderItem3Props) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    // The total width for `pagingEnabled` is `screenWidth`.
    // If you have `cardMarginHorizontal`, the actual rendered card will be narrower than screenWidth,
    // so the interpolation range should still be based on `screenWidth` for smooth paging.
    // However, if you want the *visual* effect to account for margin in the interpolation,
    // you might need to adjust the range. For now, let's keep it based on screenWidth for standard paging.

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [
              (index - 1) * screenWidth, // Use imported screenWidth
              index * screenWidth,
              (index + 1) * screenWidth
            ],
            [
              -screenWidth * 0.25, // Adjust translation based on full screen width
              0,
              screenWidth * 0.25
            ],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth
            ],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          )
        }
      ],
    };
  });

  // ✨ Calculate dynamic sizes based on props or fall back to defaults
  const currentCardBorderRadius = cardBorderRadius ?? moderateScale(20);
  const currentTitleFontSize = fontR(titleFontSize ?? 22);
  const currentDescriptionFontSize = fontR(descriptionFontSize ?? 14);
  const currentTextContainerPadding = textContainerPadding ?? moderateScale(20);
  const currentCardMarginHorizontal = cardMarginHorizontal ?? 0;

  // IMPORTANT:
  // `itemContainer.width` should remain `screenWidth` for `pagingEnabled` to work correctly.
  // The `cardMarginHorizontal` should be applied to the `Animated.View` itself,
  // making the actual *content area* of the card narrower within that `screenWidth` slot.
  // The image and gradient then fill this reduced content area.

  // Calculate the width for the image based on the percentage and margins
  // The image's width should be the percentage of screenWidth minus the effective horizontal margins.
  const imageDisplayWidth = screenWidth * ((imageWidthPercentage ?? 80) / 100);
  const finalImageWidth = imageDisplayWidth - (currentCardMarginHorizontal * 2);

  // The image's height should be a percentage of screenWidth, WITHOUT subtracting horizontal margins.
  // Height is a vertical dimension.
  const finalImageHeight = screenWidth * ((imageHeightPercentage ?? 120) / 100);

  // Overall item container height for the FlatList item.
  const currentItemContainerHeight = screenWidth * (itemContainerHeightMultiplier ?? 1.5);

  return (
    <Animated.View style={[
      sliderItemStyles.itemContainer,
      {
        height: currentItemContainerHeight,
        marginHorizontal: currentCardMarginHorizontal, // Apply horizontal margin to the container
      },
      rnAnimatedStyle
    ]}>
      <Image
        source={item.image}
        style={[
          sliderItemStyles.image,
          {
            width: finalImageWidth,   // Apply calculated width
            height: finalImageHeight, // Apply calculated height
            borderRadius: currentCardBorderRadius,
          }
        ]}
        // ✨ Add onError for debugging image loading issues ✨
        onError={(error) => console.log("Image loading error for ID:", item.id, error.nativeEvent.error)}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={[
          sliderItemStyles.background,
          {
            borderRadius: currentCardBorderRadius, // Apply dynamic border radius
            padding: currentTextContainerPadding,  // Apply dynamic padding
            // Ensure gradient covers the image's dimensions within the container
            width: finalImageWidth,
            height: finalImageHeight,
          }
        ]}
      >
        <View style={sliderItemStyles.textContainer}>
          <Text style={[sliderItemStyles.title, { fontSize: currentTitleFontSize }]}>{item.title}</Text>
          <Text style={[sliderItemStyles.description, { fontSize: currentDescriptionFontSize }]}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const sliderItemStyles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth, // Crucial for pagingEnabled: each item must take full screen width
    // height and marginHorizontal are now dynamic via inline style
  },
  image: {
    // width, height, and borderRadius are now dynamic via inline style
    resizeMode: 'cover', // Ensures image covers the area, cropping if necessary
  },
  background: {
    position: "absolute",
    // width, height, borderRadius, and padding are now dynamic via inline style
    justifyContent: 'flex-end',
    // The gradient should align with the image's position
    // You might need to adjust positioning if the image is not exactly centered
    // For now, assuming image and gradient are centered within the itemContainer
  },
  textContainer: {
    gap: 10,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  description: {
    color: '#fff',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});

// ... (Pagination Component remains the same) ...

// =============================================================================
// Slider3 Component (Internal component used by CustomSlider)
// =============================================================================
type Slider3Props = {
  itemList: ImageSliderType[];
  imageWidthPercentage?: number;
  imageHeightPercentage?: number;
  itemContainerHeightMultiplier?: number;
  cardBorderRadius?: number;
  cardMarginHorizontal?: number;
  titleFontSize?: number;
  descriptionFontSize?: number;
  textContainerPadding?: number;
}

const Slider3 = ({
  itemList,
  imageWidthPercentage,
  imageHeightPercentage,
  itemContainerHeightMultiplier,
  cardBorderRadius,
  cardMarginHorizontal,
  titleFontSize,
  descriptionFontSize,
  textContainerPadding
}: Slider3Props) => {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState(itemList);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const offset = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<any>>();

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x;
      const newIndex = Math.round(e.contentOffset.x / screenWidth); // Still based on screenWidth for paging
      runOnJS(setPaginationIndex)(newIndex % itemList.length);
    }
  });

  useEffect(() => {
    if (isAutoPlay) {
      interval.current = setInterval(() => {
        const nextIndex = (paginationIndex + 1);
        const nextOffset = nextIndex * screenWidth; // Still based on screenWidth for scroll offset

        if (nextIndex < itemList.length) {
          offset.value = nextOffset;
        } else {
          offset.value = 0;
        }
      }, 3000);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [isAutoPlay, paginationIndex, itemList.length]);

  useDerivedValue(() => {
    scrollTo(flatListRef, offset.value, 0, true);
  });

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null) {
      setPaginationIndex(viewableItems[0].index % itemList.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View style={sliderStyles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem3
            item={item}
            index={index}
            scrollX={scrollX}
            imageWidthPercentage={imageWidthPercentage}
            imageHeightPercentage={imageHeightPercentage}
            itemContainerHeightMultiplier={itemContainerHeightMultiplier}
            cardBorderRadius={cardBorderRadius}
            cardMarginHorizontal={cardMarginHorizontal}
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
            textContainerPadding={textContainerPadding}
          />
        )}
        keyExtractor={(item, index) => `slider-item-${item.id || index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          runOnJS(setIsAutoPlay)(false);
        }}
        onScrollEndDrag={() => {
          runOnJS(setIsAutoPlay)(true);
        }}
      />

      <Pagination items={itemList} scrollX={scrollX} paginationIndex={paginationIndex} />
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// =============================================================================
// CustomSlider Component (The main exported component)
// =============================================================================
interface CustomSliderProps {
  itemList: ImageSliderType[];
  imageWidthPercentage?: number;
  imageHeightPercentage?: number;
  itemContainerHeightMultiplier?: number;
  cardBorderRadius?: number;
  cardMarginHorizontal?: number;
  titleFontSize?: number;
  descriptionFontSize?: number;
  textContainerPadding?: number;
   style?: ViewStyle;
}

export default function CustomSlider({
  itemList,
  imageWidthPercentage,
  imageHeightPercentage,
  itemContainerHeightMultiplier,
  cardBorderRadius,
  cardMarginHorizontal,
  titleFontSize,
  descriptionFontSize,
  textContainerPadding ,
  style
  
}: CustomSliderProps) {
  return (
    <View style={[appStyles.appContainer ,style ]}>
     

      <Slider3
        itemList={itemList}
        imageWidthPercentage={imageWidthPercentage}
        imageHeightPercentage={imageHeightPercentage}
        itemContainerHeightMultiplier={itemContainerHeightMultiplier}
        cardBorderRadius={cardBorderRadius}
        cardMarginHorizontal={cardMarginHorizontal}
        titleFontSize={titleFontSize}
        descriptionFontSize={descriptionFontSize}
        textContainerPadding={textContainerPadding}
      />

   
    </View>
  );
}

const appStyles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
 
  },
  appTitle: {
    fontSize: fontR(34),
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: moderateScale(30),
    textAlign: 'center',
    lineHeight: fontR(40),
  },
  appDescription: {
    marginTop: moderateScale(40),
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: moderateScale(20),
    maxWidth: screenWidth * 0.9,
    fontSize: fontR(16),
  },
});

type PaginationProps = {
  items: ImageSliderType[];
  paginationIndex: number;
  scrollX: SharedValue<number>;
}
const Pagination = ({ items, paginationIndex, scrollX }: PaginationProps) => {
  return (
    <View style={paginationStyles.container}>
      {items.map((_, index) => {
        const pgAnimationStyle = useAnimatedStyle<ViewStyle>(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [
              (index - 1) * screenWidth, // Use imported screenWidth
              index * screenWidth,
              (index + 1) * screenWidth
            ],
            [
              8, 20, 8
            ],
            Extrapolation.CLAMP
          );

          const dotOpacity = interpolate(
            scrollX.value,
            [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth
            ],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          );

          const animatedBackgroundColor = interpolateColor(
            scrollX.value,
            [
                (index - 1) * screenWidth,
                index * screenWidth,
                (index + 1) * screenWidth
            ],
            [
                '#aaa',
                '#222',
                '#aaa'
            ]
          );

          return {
            width: dotWidth,
            opacity: dotOpacity,
            backgroundColor: animatedBackgroundColor,
          };
        });
        return (
          <Animated.View
            key={index}
            style={[
              paginationStyles.dot,
              pgAnimationStyle,
            ]}
          />
        );
      })}
    </View>
  )
}

const paginationStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    height: 8,
    width: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#aaa',
  }
});

// =============================================================================
// Slider3 Component
// =============================================================================