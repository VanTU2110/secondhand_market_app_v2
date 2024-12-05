import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../ipconfig';


const ReviewScreen = ({ navigation }) => {
  const route = useRoute();
  const { productId, orderId } = route.params; // Lấy productId và orderId từ params khi chuyển màn hình

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null); // State to hold user ID

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage
        if (token) {
          const response = await axios.get(`${url}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserId(response.data._id); // Set userId from the API response
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmitReview = async () => {
    if (!rating || !review) {
      Alert.alert('Thông báo', 'Bạn cần nhập đầy đủ thông tin đánh giá.');
      return;
    }

    if (!userId) {
      Alert.alert('Thông báo', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${url}/api/reviews/createreview`, {
        product_id: productId,
        user_id: userId, // Use the fetched user ID
        rating,
        review,
      });
      console.log(productId,userId,rating,review);

      if (response.status === 201) {
        Alert.alert('Thành công', 'Đánh giá của bạn đã được gửi.');
        navigation.goBack(); 
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đánh giá.');
      console.log("loi",error);
      console.log('Response data:', error.response.data);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá sản phẩm</Text>
      <Text>Chọn đánh giá (1-5 sao):</Text>
      <Rating
        showRating
        onFinishRating={setRating}
        startingValue={rating}
        style={styles.rating}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Viết nhận xét của bạn..."
        value={review}
        onChangeText={setReview}
        multiline
      />
      <Button
        title={isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        onPress={handleSubmitReview}
        disabled={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  rating: {
    marginVertical: 10,
  },
});

export default ReviewScreen;
