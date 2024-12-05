import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from "react-native-elements";
import url from '../../ipconfig';

const Checkout = ({ route, navigation }) => {
  const { selectedItems } = route.params;
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${url}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = response.data;
          setRecipientName(userData.username);
          setPhoneNumber(userData.phone);
          setUserID(userData._id);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      }
    };
    loadUserData();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const groupItemsByShop = () => {
    const groupedItems = {};
  
    selectedItems.forEach(item => {
      // Lấy giá trị shop_id chính xác
      const shopId = item.shop_id._id || item.shop_id;
  
      // Kiểm tra xem shop_id đã có trong nhóm chưa
      if (!groupedItems[shopId]) {
        groupedItems[shopId] = [];
      }
  
      // Thêm sản phẩm vào mảng tương ứng với shop_id
      groupedItems[shopId].push(item);
    });
  
    return groupedItems;
  };
  

  const handlePlaceOrder = async () => {
    try {
      // Nhóm sản phẩm theo shop_id
      const ordersByShop = groupItemsByShop();
      
      // Gửi yêu cầu tạo đơn hàng cho mỗi shop
      for (const [shopId, products] of Object.entries(ordersByShop)) {
        const orderDetails = {
          buyer_id: userID,
          shop_id: shopId,
          cart: products,
          totalPrice: products.reduce((total, item) => total + item.price * item.quantity, 0),
          recipientName: recipientName,
          address: address,
          phoneNumber: phoneNumber,
        };
  
        const response = await axios.post(`${url}/api/orders/create`, orderDetails);
        console.log(shopId);
        
        console.log("Order created:", response.data);
      }
  
      Alert.alert('Thành công', 'Đặt hàng thành công');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
       // Kiểm tra nếu lỗi có liên quan đến số lượng vượt quá
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.message || 'Đặt hàng không thành công, vui lòng thử lại';
      // Nếu thông báo lỗi là về số lượng vượt quá, hiển thị thông báo cho người dùng
      if (errorMessage.includes('quantity exceeds available stock')) {
        Alert.alert('Lỗi', 'Số lượng sản phẩm vượt quá số lượng trong kho. Vui lòng điều chỉnh lại số lượng.');
      } else {
        Alert.alert('Lỗi', errorMessage);
      }
    } else {
      Alert.alert('Lỗi', 'Đặt hàng không thành công, vui lòng thử lại');
    }
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin người nhận</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên người nhận"
        value={recipientName}
        onChangeText={setRecipientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Hiển thị danh sách sản phẩm */}
      <Text style={styles.title}>Sản phẩm đã chọn</Text>
      {selectedItems.length > 0 ? (
        selectedItems.map((item) => (
          <View key={item._id} style={styles.productContainer}>
            <Image source={{ uri: item.img_url[0] }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.title}</Text>
              <Text style={styles.productPrice}>{formatPrice(item.price)} ₫</Text>
              <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
              <Text style={styles.productTotal}>Tổng: {formatPrice(item.price * item.quantity)} ₫</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>Giỏ hàng trống</Text>
      )}

      <Text style={styles.total}>Tổng cộng: {formatPrice(getTotalPrice())} ₫</Text>
      <Button title="Đặt hàng" onPress={handlePlaceOrder} buttonStyle={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  productTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
  },
});

export default Checkout;
