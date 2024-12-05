import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import BottomNavigation from '../component/bottomNavigation';
import ProductItem from '../component/ProductItem';
import url from '../../ipconfig';
import { useNavigation } from '@react-navigation/native';


const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories/getall`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
        fetchProductsByCategory(response.data[0]._id);
      }
    } catch (error) {
      alert('Không thể tải danh mục!');
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products/category/${categoryId}`);
      setProducts(response.data);
    } catch (error) {
      alert('Không thể tải sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProductsByCategory(categoryId);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item._id && styles.selectedCategory,
      ]}
      onPress={() => handleCategoryPress(item._id)}
    >
      <Text style={styles.categoryText}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Mục Sản Phẩm</Text>
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          numColumns={4}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.categoryGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.productSection}>
        <Text style={styles.subtitle}>Sản Phẩm</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ff6600" style={styles.loader} />
        ) : (
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <ProductItem product={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginTop:50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoryGrid: {
    alignItems: 'center',
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    width: '22%',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#ff6600',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  productSection: {
    flex: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  loader: {
    marginTop: 20,
  },
  listContent: {
    justifyContent: 'space-between',
  },
  productItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
});

export default CategoryScreen;
