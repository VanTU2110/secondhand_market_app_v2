import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../ipconfig';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Chờ xác nhận' },
    { key: 'processing', title: 'Đang xử lý' },
    { key: 'shipped', title: 'Đã giao hàng' },
    { key: 'paid', title: 'Đã thanh toán' },
  ]);
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${url}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
        fetchOrders(response.data._id);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    const fetchOrders = async (buyerId) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${url}/api/orders/buyer/${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const filterOrdersByStatus = (status) => orders.filter((order) => order.status === status);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <Text style={styles.orderTitle}>Mã đơn hàng: {item._id}</Text>
      <FlatList
        data={item.cart}
        renderItem={({ item: cartItem }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: cartItem.img_url[0] }} style={styles.productImage} />
            <View style={styles.cartItemDetails}>
              <Text style={styles.cartText}>{cartItem.title}</Text>
              <Text style={styles.cartSubText}>Số lượng: {cartItem.quantity}</Text>
              <Text style={styles.cartSubText}>Giá: {formatPrice(cartItem.price)} VND</Text>
            </View>
          </View>
        )}
        keyExtractor={(cartItem) => cartItem._id}
      />
    </TouchableOpacity>
  );

  const renderScene = ({ route }) => {
    const filteredOrders = filterOrdersByStatus(route.key);
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      );
    }
    if (filteredOrders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có đơn hàng trong trạng thái này.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri:'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{userInfo.username}</Text>
          <Text style={styles.profileEmail}>{userInfo.email}</Text>
          <Text style={styles.profilePhone}>{userInfo.phone}</Text>

          <TouchableOpacity style={styles.editProfileButton} onPress={() => {}}>
            <Text style={styles.editProfileText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#3498db" />
      )}

      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          pending: renderScene,
          processing: renderScene,
          shipped: renderScene,
          paid: renderScene,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor="#3498db"
            inactiveColor="#95a5a6"
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  profileContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3498db',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  profileEmail: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  profilePhone: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  editProfileButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  editProfileText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  tabBar: { backgroundColor: '#fff', elevation: 3 },
  tabIndicator: { backgroundColor: '#3498db', height: 3 },
  tabLabel: { fontSize: 14, fontWeight: '600' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#7f8c8d' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#95a5a6' },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  cartItem: { flexDirection: 'row', marginBottom: 10 },
  productImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  cartItemDetails: { flex: 1 },
  cartText: { fontSize: 14, color: '#2c3e50', fontWeight: '600' },
  cartSubText: { fontSize: 12, color: '#7f8c8d' },
});

export default ProfileScreen;
