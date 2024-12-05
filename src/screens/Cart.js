import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from '../contexts/CartContext';
import BottomNavigation from '../component/bottomNavigation';

const Cart = ({ navigation }) => {
  const { cart, addToCart, removeFromCart, clearCart, decreaseQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set()); // Using Set for better performance

  const handleToggleSelect = (productId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const isSelected = (productId) => selectedItems.has(productId);

  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.has(item._id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleClearCart = () => {
    Alert.alert('Confirm', 'Are you sure you want to clear the cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => clearCart() },
    ]);
    setSelectedItems(new Set());
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      Alert.alert('Warning', 'You have not selected any products!');
      return;
    }

    navigation.navigate('CheckOut', {
      selectedItems: cart.filter((item) => selectedItems.has(item._id)),
    });
  };

  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <TouchableOpacity onPress={() => handleToggleSelect(item._id)} style={styles.checkboxContainer}>
          <Icon
            name={isSelected(item._id) ? 'check-circle' : 'circle-thin'}
            size={24}
            color={isSelected(item._id) ? '#28a745' : '#ddd'}
          />
        </TouchableOpacity>
        <Image source={{ uri: item.img_url[0] }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)} ₫</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => decreaseQuantity(item._id)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={String(item.quantity)}
              keyboardType="numeric"
              editable={false}
            />
            <TouchableOpacity onPress={() => addToCart({ _id: item._id })} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => removeFromCart(item._id)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyCartText}>Your cart is empty.</Text>}
        />
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: {formatPrice(calculateTotal())} ₫</Text>
          <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Buy Selected</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // Adjust for BottomNavigation
  },
  content: {
    flex: 1,
    padding: 15,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityInput: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  removeButton: {
    color: '#e74c3c',
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f39c12',
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyCartText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 20,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Chiều cao của thanh bottomNavigation
    backgroundColor: '#007AFF',
  }
})

export default Cart;
