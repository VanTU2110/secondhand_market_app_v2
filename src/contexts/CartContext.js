import React, { createContext, useState, useContext } from 'react';


const CartContext = createContext();


export const useCart = () => {
  return useContext(CartContext);
};


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);


  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item._id === product._id);
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  const isReviewAllowed = (order) => {
    return order.status === 'received' && !order.reviewed;
  };
  

  // Remove product from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item => {
        if (item._id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;  
          }
        }
        return item;
      }).filter(item => item !== null);  
      
      return updatedCart;
    });
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart ,decreaseQuantity,isReviewAllowed}}>
      {children}
    </CartContext.Provider>
  );
};
