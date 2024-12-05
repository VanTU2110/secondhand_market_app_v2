import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ searchQuery, onSearchPress, onCartPress, onMessagesPress }) => {
  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Chợ Đồ Cũ</Text>
        <Ionicons name="storefront-outline" size={24} color="#007AFF" />
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={onSearchPress} // Nhấn vào sẽ chuyển sang màn hình tìm kiếm
      >
        <Ionicons name="search-outline" size={20} color="#888" />
        <Text style={styles.placeholderText}>
          {searchQuery || 'Tìm kiếm sản phẩm...'}
        </Text>
      </TouchableOpacity>

      {/* Action Icons */}
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={onCartPress}>
          <Ionicons name="cart-outline" size={24} color="#555" style={styles.icon} />
        </TouchableOpacity>
        {/* Biểu tượng nhắn tin */}
        <TouchableOpacity onPress={onMessagesPress}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#555" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    height: 40,
  },
  placeholderText: {
    marginLeft: 8,
    color: '#888',
    fontSize: 14,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15,
  },
});

export default Header;
