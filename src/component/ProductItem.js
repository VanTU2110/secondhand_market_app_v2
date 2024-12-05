import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductItem = ({ product, onAddToCart }) => {
  const { img_url, title, price, discount, sold, tags, promotion } = product;

  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: img_url[0] }} style={styles.productImage} />
        {discount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {tags &&
          tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
      </View>

      {/* Sold */}
      <View style={styles.ratingSoldContainer}>
        <Text style={styles.sold}>Đã bán {sold || 0}</Text>
      </View>

      {/* Price */}
      <Text style={styles.price}>{formatPrice(price)} đ</Text>

      {/* Promotion */}
      {promotion && <Text style={styles.promotion}>{promotion}</Text>}

      {/* Thêm vào giỏ hàng
      <TouchableOpacity style={styles.iconContainer} onPress={() => onAddToCart(product)}>
        <Icon name="cart-outline" size={24} color="#fff" />
        <Text style={styles.iconText}>Thêm vào giỏ</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  discountTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FF5555",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    numberOfLines: 1, // Giới hạn văn bản trong một dòng
    ellipsizeMode: "tail",
    overflow: "hidden",
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 5,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#FFD700",
    color: "#fff",
    fontSize: 12,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 5,
  },
  ratingSoldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  sold: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5555",
  },
  promotion: {
    marginTop: 5,
    fontSize: 12,
    color: "#888",
    backgroundColor: "#F5F5F5",
    padding: 5,
    borderRadius: 5,
  },
  iconContainer: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  iconText: {
    marginLeft: 6,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductItem;
