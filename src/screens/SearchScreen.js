import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ProductItem from '../component/ProductItem';
import BottomNavigation from '../component/bottomNavigation';
import axios from 'axios';
import url from '../../ipconfig';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    try {
      setNoResults(false); // Reset trạng thái trước khi tìm kiếm
      const response = await axios.get(`${url}/api/products/search`, {
        params: {
          title: query,
          minPrice,
          maxPrice,
        },
      });

      if (response.data.length === 0) {
        setNoResults(true); // Không tìm thấy sản phẩm
      } else {
        setProducts(response.data); // Lưu sản phẩm trả về
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm sản phẩm.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập từ khóa tìm kiếm..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Giá thấp nhất"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Giá cao nhất"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>

        {noResults ? (
          <Text style={styles.noResultsText}>Không tìm thấy sản phẩm phù hợp.</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => console.log('Navigate to product detail', item)}
                style={styles.productItem}>
                <ProductItem product={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <BottomNavigation style={styles.bottomNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop:20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    height: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  productItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Chiều cao của thanh bottomNavigation
    backgroundColor: '#007AFF',
  },
});

export default SearchScreen;
