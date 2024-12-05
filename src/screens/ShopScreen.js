import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Header from "../component/Header";
import BottomNavigation from "../component/bottomNavigation";
import axios from "axios";
import ProductItem from "../component/ProductItem";
import { TouchableOpacity } from "react-native";
import url from "../../ipconfig";

const ShopScreen = ({ route, navigation }) => {
  const { shop } = route.params; // Lấy shop ID từ route params
  const [shopInfo, setShopInfo] = useState(null); // Trạng thái thông tin shop
  const [products, setProducts] = useState([]); // Trạng thái danh sách sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Gọi API để lấy thông tin shop và danh sách sản phẩm
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // Gọi API lấy thông tin shop
        const shopResponse = await axios.get(
          `${url}/api/shop/shop/${shop}`
        );
        setShopInfo(shopResponse.data);

        // Gọi API lấy danh sách sản phẩm của shop
        const productsResponse = await axios.get(
          `${url}/api/products/shop/${shop}`
        );
        setProducts(productsResponse.data);

        setLoading(false); // Dừng trạng thái loading
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shop._id]);

  // Hiển thị trạng thái loading hoặc lỗi
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hiển thị thông tin shop */}
        {shopInfo && (
          <View style={styles.shopInfo}>
            <Image
              source={{ uri: shopInfo.shop_logo }}
              style={styles.shopImage}
            />
            <Text style={styles.shopName}>{shopInfo.shop_name}</Text>
            <Text style={styles.shopAddress}>
              Địa chỉ: {shopInfo.shop_address}
            </Text>
            <Text style={styles.shopDescription}>
              {shopInfo.description || "Shop chưa có mô tả."}
            </Text>
            <TouchableOpacity
                style={styles.messageButton}
                onPress={() =>
                  navigation.navigate("ChatBotGemini", {
                    // shopId: shopInfo._id,
                    // shopName: shopInfo.shop_name,
                  })
                }
              >
                <Text style={styles.messageButtonText}>Nhắn tin với Shop</Text>
              </TouchableOpacity>
          </View>
        )}
        <Text style={styles.sectionTitle}>Sản phẩm của shop</Text>
        <FlatList
  data={products}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item })
      }
    >
      <ProductItem
        product={item}
        onAddToCart={() => handleAddToCart(item)}
      />
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item._id}
  horizontal={true} // Cuộn ngang
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.listContent}
/>

      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
  },
  listContent: {
    flexDirection: "row", // Hiển thị sản phẩm thành hàng ngang
    flexWrap: "wrap", // Cho phép gói các sản phẩm lại (dùng trong trường hợp nhiều hàng)
  },
  shopInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  shopAddress: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  shopDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  messageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#ff5555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff5555",
    fontSize: 16,
  },
});

export default ShopScreen;
