import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const currentRoute = navigation.getState().routes[navigation.getState().index].name;

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.bottomButton}>
        <Ionicons
          name="home-outline"
          size={24}
          color={currentRoute === 'Home' ? '#007AFF' : '#555555'}
          style={styles.bottomIcon}
        />
        <Text style={[styles.bottomText, currentRoute === 'Home' && styles.activeTab]}>
          Trang chủ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen')} style={styles.bottomButton}>
        <Ionicons
          name="grid-outline"
          size={24}
          color={currentRoute === 'Categories' ? '#007AFF' : '#555555'}
          style={styles.bottomIcon}
        />
        <Text style={[styles.bottomText, currentRoute === 'CategoryScreen' && styles.activeTab]}>
          Danh mục
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CartPage')} style={styles.bottomButton}>
        <Ionicons
          name="cart-outline"
          size={24}
          color={currentRoute === 'Cart' ? '#007AFF' : '#555555'}
          style={styles.bottomIcon}
        />
        <Text style={[styles.bottomText, currentRoute === 'CartPage' && styles.activeTab]}>
          Giỏ hàng
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.bottomButton}>
        <Ionicons
          name="person-outline"
          size={24}
          color={currentRoute === 'Profile' ? '#007AFF' : '#555555'}
          style={styles.bottomIcon}
        />
        <Text style={[styles.bottomText, currentRoute === 'Profile' && styles.activeTab]}>
          Cá nhân
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  bottomIcon: {
    marginBottom: 5,
  },
  bottomText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  activeTab: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
