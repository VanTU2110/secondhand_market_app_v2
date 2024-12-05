import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import url from '../../ipconfig';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); // Thêm state cho địa chỉ
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        email,
        password,
        username,
        phone,
        address // Gửi địa chỉ trong yêu cầu đăng ký
      });
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
      }
      if (response && response.status === 201) {
        Alert.alert("Đăng kí thành công");
        Keyboard.dismiss();
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={{ uri: 'https://raw.githubusercontent.com/coredxor/images/main/bk_login.png' }}
        resizeMode='stretch'
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Đăng Ký</Text>
          <Text style={styles.subtitle}>Phục vụ bằng cả cái tâm</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên người dùng</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên người dùng"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupButtonText}> Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#181725',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    color: '#7C7C7C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 16,
  },
  label: {
    color: '#7C7C7C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    color: '#181725',
    fontSize: 18,
    marginVertical: 12,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  registerButton: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#53B175',
    borderRadius: 20,
    marginVertical: 20,
  },
  registerButtonText: {
    color: '#FFF9FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#181725',
    fontSize: 14,
  },
  signupButtonText: {
    color: '#53B175',
    fontSize: 14,
  },
});

export default RegisterScreen;
