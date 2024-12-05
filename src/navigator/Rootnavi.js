import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import {CartProvider} from "../contexts/CartContext";
import HomeScreen from "../screens/Home"; 
import ProductItem from "../component/ProductItem";
import CartPage from "../screens/Cart";
import ProductDetail from "../screens/ProductDetail";
import SearchScreen from "../screens/SearchScreen";
import ShopSCreen from "../screens/ShopScreen";
import Checkout from "../screens/CheckOut";
import ProfileScreen from "../screens/ProfileScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ReviewScreen from "../screens/ReviewScreen";
import ChatBot from "../screens/ChatBot";
import ChatBotGemini from "../screens/ChatBotGemini";


const Stack = createStackNavigator();

const Rootnavi = () => {
  return (
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",  // sửa thành backgroundColor
          },
          headerTintColor: "#FEAB",
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,  // sửa thành headerLeftContainerStyle
          },
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Đăng nhập" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Đăng kí",headerShown: false }}
        />
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false  }}
        />
        <Stack.Screen
        name= "CartPage"
        component={CartPage}
        options={{ title: "Giỏ hàng",headerShown: false  }}
        />
        <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ title: "Chi tiết sản phẩm",headerShown: false  }}
        />
        <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{title: "Tìm kiếm sản phẩm",headerShown: false }}
        />
        <Stack.Screen
        name ="ShopScreen"
        component={ShopSCreen}
        options={{title:"Cửa hàng",headerShown: false }}
        />
        <Stack.Screen
        name ="CheckOut"
        component={Checkout}
        options={{title:"Thanh Toán",headerShown: false }}
        />
        <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title:"Trang cá nhân",headerShown: false }}/>
        <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{title:"Chi Tiết Đơn Hàng",headerShown: false }}/>
        <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{title:"Danh mục sản phẩm",headerShown: false }}/>
        <Stack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{title:"Đánh giá",headerShown: false }}/>
        <Stack.Screen
        name="ChatBot"
        component={ChatBot}
        options={{title:"Chat Bot",headerShown: false }}/>
         <Stack.Screen
        name="ChatBotGemini"
        component={ChatBotGemini}
        options={{title:"Chat Bot",headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
};

export default Rootnavi;
