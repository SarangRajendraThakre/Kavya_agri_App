// components/ImageCard.tsx
import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native'; // Removed TouchableOpacity

interface ImageCardProps {
  title: string;
  imageSource: ImageSourcePropType; // Type for image require() or URI
  // Removed onPress prop as the card is no longer clickable
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageSource }) => { // Removed onPress from props
  return (
    <View style={styles.card}> {/* Changed from TouchableOpacity to View */}
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.textOverlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222222',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#444444',
    marginHorizontal: 10,
    width: 250, // Slightly wider for images
    height: 180, // Consistent height
    overflow: 'hidden', // Ensures image and overlay stay within rounded corners
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default ImageCard;