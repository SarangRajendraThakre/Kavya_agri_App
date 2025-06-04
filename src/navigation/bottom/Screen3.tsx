// Example for Screen3.tsx
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { screenWidth, verticalScale } from '../../utils/Scaling';
// ... other imports (e.g., useHeaderVisibility)

const HEADER_HEIGHT = verticalScale(60); // Ensure this matches context and CustomHeader

const Screen3: React.FC = () => {
  // ... useHeaderVisibility hook ...

  return (
    <View style={styles.container}> {/* Use a plain View as the top container */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }} // IMPORTANT
      >
        {/* Your screen content */}
        <Text>Screen 3 Content</Text>
        {/* ... other elements ... */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Keep marginBottom on the TouchableOpacity
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34A853', // Google Green (G)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
  },
  gamePlayText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#888',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  categoryItem: {
    width: (screenWidth - 60) / 4, // 4 items per row with some padding
    height: (screenWidth - 60) / 4 + 20, // Adjust height based on icon and text
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginHorizontal: 5,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});

export default Screen3;