// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import ProductItem from '../component/ProductItem';
import Header from '../component/Header';
import BottomNavigation from '../component/bottomNavigation';
import url from '../../ipconfig';
import { TouchableOpacity } from 'react-native';

const Home = ({ navigation }) => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products/getAll`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Thành công', `${product.title} đã được thêm vào giỏ hàng.`);
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen'); // Chuyển tới màn hình tìm kiếm
  };
  const handleMessagesPress = () => {
    navigation.navigate('ConversationListScreen'); // Chuyển tới màn hình nhắn tin
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D9CDB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chợ đồ cũ online" onSearchPress={handleSearchPress}
      onMessagesPress={handleMessagesPress}  />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <ProductItem product={item} onAddToCart={() => handleAddToCart(item)} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Màu nền nhẹ nhàng, dễ nhìn
    paddingTop: 10,
    marginTop:20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Màu nền cho phần loading
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 90,
    paddingTop: 10,
    justifyContent: 'space-between', // Giữ khoảng cách đều giữa các phần tử
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 8,
    elevation: 5, // Tạo hiệu ứng bóng cho các sản phẩm
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    overflow: 'hidden',
    width: '45%',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#2D9CDB',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28a745', // Nút xanh cho thêm vào giỏ hàng
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
