// screens/CareerDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// --- Scaling Utility (Re-used from ExploreScreen for consistency) ---
const scale = (size: number) => width / 375 * size;
const verticalScale = (size: number) => (Dimensions.get('window').height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const fontR = (size: number) => size * Math.min(width, Dimensions.get('window').height) / 375 / 1.5;

// --- Color Palette (Re-used for consistency) ---
const Colors = {
    primaryGreen: '#4CAF50',
    secondaryBlue: '#1976D2',
    accentPurple: '#6A5ACD',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    darkText: '#333333',
    subtleText: '#666666',
    white: '#FFFFFF',
    gold: '#FFC107',
    buttonBg: '#6A5ACD',
    buttonText: '#FFFFFF',
    cardOverlay: 'rgba(0,0,0,0.4)', // Dark overlay for text readability on images
};

// Define the type for route params for Stack Navigator
type RootStackParamList = {
    Explore: undefined;
    CareerDetail: {
        key: string;
        title: string;
        fullDescription: string;
        image: any; // Use any for require() paths or specific ImageSourcePropType
        icon: string;
    };
};

type CareerDetailScreenProps = StackScreenProps<RootStackParamList, 'CareerDetail'>;

const CareerDetailScreen: React.FC<CareerDetailScreenProps> = ({ route, navigation }) => {
    const { title, fullDescription, image, icon } = route.params;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={scale(24)} color={Colors.darkText} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={styles.placeholderRight} /> {/* To balance the header */}
                </View>

                {/* Main Image/Icon Section */}
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={image} style={styles.mainImage} resizeMode="cover" />
                    ) : (
                        <Icon name={icon} size={scale(100)} color={Colors.accentPurple} style={styles.mainIconPlaceholder} />
                    )}
                </View>

                {/* Description Section */}
                <View style={styles.descriptionCard}>
                    <Text style={styles.descriptionTitle}>About {title} Industry</Text>
                    <Text style={styles.descriptionText}>{fullDescription}</Text>
                </View>

                {/* Call to Action (Repeat from ExploreScreen for consistency) */}
                <View style={styles.ctaContainer}>
                    <Text style={styles.ctaText}>Ready to shape your future in {title}?</Text>
                    <TouchableOpacity style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Enroll Now!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    container: {
        flexGrow: 1,
        paddingBottom: verticalScale(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(15),
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.mediumGray,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: moderateScale(5),
    },
    headerTitle: {
        fontSize: fontR(20),
        fontWeight: '600',
        color: Colors.darkText,
        flex: 1, // Allows title to take available space
        textAlign: 'center',
        marginHorizontal: moderateScale(10),
    },
    placeholderRight: { // To keep title centered
        width: scale(34), // Same width as back button + padding
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: verticalScale(20),
    },
    mainImage: {
        width: width - moderateScale(40), // Full width minus padding
        height: verticalScale(200), // Fixed height
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
        overflow: 'hidden',
    },
    mainIconPlaceholder: {
        padding: moderateScale(20),
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    descriptionCard: {
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginHorizontal: moderateScale(20),
        padding: moderateScale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: verticalScale(20),
    },
    descriptionTitle: {
        fontSize: fontR(18),
        fontWeight: '600',
        color: Colors.accentPurple,
        marginBottom: verticalScale(10),
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: fontR(15),
        color: Colors.darkText,
        lineHeight: verticalScale(24),
        textAlign: 'justify',
    },
    ctaContainer: {
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        marginTop: verticalScale(10),
    },
    ctaText: {
        fontSize: fontR(16),
        color: Colors.darkText,
        marginBottom: verticalScale(15),
        textAlign: 'center',
        fontWeight: '500',
    },
    ctaButton: {
        backgroundColor: Colors.gold,
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(30),
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    ctaButtonText: {
        color: Colors.darkText,
        fontSize: fontR(18),
        fontWeight: '600',
    },
});

export default CareerDetailScreen;