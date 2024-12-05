import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BottomNavigation from "../component/bottomNavigation";
import Header from "../component/Header";
import { useCart } from "../contexts/CartContext"; // Import useCart to access the cart context
import { Button } from "react-native-elements";
import axios from "axios"; // Import axios to fetch data from API
import url from "../../ipconfig";
const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart(); // Get addToCart function from the context
  const [reviews, setReviews] = useState([]); // State to store reviews

  useEffect(() => {
    // Fetch reviews for the product
    axios
      .get(`${url}/api/reviews/product/${product._id}`)
      .then((response) => {
        setReviews(response.data); // Store the fetched reviews
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [product._id]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: product.img_url[0] }} style={styles.image} />

        {/* Thông tin sản phẩm */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.category}>Danh mục: {product.category_id.category_name}</Text>
          <Text style={styles.description}>Mô tả: {product.description}</Text>
          <Text style={styles.condition}>
            Tình trạng: {product.condition === "used" ? "Đã qua sử dụng" : "Mới"}
          </Text>
          <Text style={styles.price}>Giá: {formatPrice(product.price)} ₫</Text>
          <Text style={styles.quantity}>Số lượng có sẵn: {product.quantity}</Text>
        </View>
        <View style={styles.infoShop}>
          <View style={styles.shopRow}>
            <Text style={styles.shopName}>{product.shop_id.shop_name}</Text>
            <Button
              title="Xem Shop"
              onPress={() =>
                navigation.navigate("ShopScreen", {
                  shop: product.shop_id._id, // Truyền dữ liệu của shop
                })
              }
              buttonStyle={styles.shopButton}
            />
          </View>
        </View>

        {/* Nút thêm vào giỏ hàng */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            product.quantity === 0 && styles.outOfStockButton, // Áp dụng style nếu hết hàng
          ]}
          onPress={() => product.quantity > 0 && addToCart(product)} // Ngăn chặn thêm vào giỏ nếu hết hàng
          disabled={product.quantity === 0} // Vô hiệu hóa nút nếu hết hàng
        >
          <Icon
            name={product.quantity === 0 ? "close-circle-outline" : "cart-outline"} // Biểu tượng thay đổi
            size={20}
            color="#fff"
          />
          <Text style={styles.addToCartText}>
            {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </Text>
        </TouchableOpacity>

        {/* Hiển thị đánh giá sản phẩm */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Đánh giá:</Text>
          <ScrollView style={styles.reviewsList}>
            {reviews.map((review) => (
              <View key={review._id} style={styles.reviewItem}>
                <Text style={styles.reviewUsername}>{review.user_id.username}</Text>
                <Text style={styles.reviewRating}>Đánh giá: {review.rating} ⭐</Text>
                <Text style={styles.reviewText}>{review.review}</Text>
                <Text style={styles.reviewDate}>
                  Ngày tạo: {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: "contain",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
  },
  infoShop: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
    marginBottom: 20,
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Đặt khoảng cách giữa Text và Button
    width: "100%", // Đảm bảo hàng nằm trong vùng hiển thị
  },
  shopName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginRight: 10, // Khoảng cách giữa Text và Button
  },
  shopButton: {
    minWidth: 100, // Đặt chiều rộng tối thiểu
    backgroundColor: "#007bff", // Màu nền cho nút
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  condition: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5555",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  outOfStockButton: {
    backgroundColor: "#d3d3d3", // Màu xám nhạt
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  reviewsContainer: {
    width: "100%",
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewsList: {
    width: "100%",
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewRating: {
    fontSize: 14,
    color: "#ff5555",
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});

export default ProductDetail;
