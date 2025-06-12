import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 2 * 15 - 15) / 2;

const images = [
  { url: '', props: { source: require('../../assets/pastEvents/1.jpg') } },
  { url: '', props:{ source: require('../../assets/pastEvents/4.jpg') } },
  { url: '', props: { source: require('../../assets/pastEvents/5.jpg') } },
  { url: '', props:{ source: require('../../assets/pastEvents/6.jpg') } },
  { url: '', props: { source: require('../../assets/pastEvents/7.jpg') } },
];

const PastEvents = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = (index) => {
    console.log('--- Image Clicked! ---'); // DEBUG: Log when function is called
    console.log('Clicked index:', index);   // DEBUG: Log the index
    setCurrentImageIndex(index);
    setModalVisible(true);
    console.log('Modal visibility set to true.'); // DEBUG: Confirm state change
  };

  const closeImageViewer = () => {
    console.log('--- Closing Modal ---'); // DEBUG: Log when closing
    setModalVisible(false);
  };

  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.imageWrapper, {backgroundColor: 'lightblue'}]} // DEBUG: Add background to see touchable area
      onPress={() => openImageViewer(index)}
      activeOpacity={0.7}
    >
      <Image source={item.props.source} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FCFF" /> {/* Moved here for component control */}

      <Animatable.Text
        animation="bounceInDown"
        duration={1500}
        delay={300}
        style={styles.title}
      >
        Past Events
      </Animatable.Text>

      <FlatList
        data={images}
        renderItem={renderGalleryItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.galleryGrid}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeImageViewer}
        onBackButtonPress={closeImageViewer}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
      >
        {/* DEBUG: Add a simple Text inside Modal to check if modal itself is rendering */}
        {/* If you see "MODAL IS OPEN!" on click, then the ImageViewer might be the issue. */}
        {/* <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>MODAL IS OPEN!</Text> */}

        <ImageViewer
          imageUrls={images}
          index={currentImageIndex}
          enableSwipeDown={true}
          onSwipeDown={closeImageViewer}
          onClick={closeImageViewer}
          renderIndicator={() => null}
          backgroundColor="rgba(0,0,0,0.9)"
          enablePreload={true}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  galleryGrid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginHorizontal: 7.5,
    marginVertical: 7.5,
    borderRadius: 10,
    overflow: 'hidden',
    // backgroundColor: '#e0e0e0', // Original background
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modal: {
    margin: 0,
  },
});

export default PastEvents;