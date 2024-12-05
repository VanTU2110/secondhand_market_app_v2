import React, { useState } from 'react';
import { SafeAreaView, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../ipconfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('vantu29032003@gmail.com');
  const [password, setPassword] = useState('123');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const loginUrl = `${url}/api/auth/login`;
    console.log('Login URL:', loginUrl);

    try {
      const response = await axios.post(loginUrl, {
        email,
        password
      });
      console.log('Response data:', response.data);
      setMessage('Đăng nhập thành công');
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Đã xảy ra lỗi');
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        setMessage('No response received from the server');
        console.log('Request data:', error.request);
      } else {
        setMessage('Error in setting up the request');
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={{ uri: 'https://raw.githubusercontent.com/coredxor/images/main/bk_login.png' }}
        resizeMode='stretch'
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/coredxor/images/main/carot_login.png' }}
            resizeMode='stretch'
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Phục vụ bằng cả cái tâm</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.signupButtonText}> Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  background: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    color: '#333333',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#555555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    color: '#333333',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#53B175',
    borderRadius: 8,
    marginVertical: 20,
    shadowColor: '#53B175',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#333333',
    fontSize: 14,
  },
  signupButtonText: {
    color: '#53B175',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LoginScreen;
