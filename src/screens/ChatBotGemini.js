import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ChatBubble from "../component/chatBubble";
import axios from "axios";

const ChatBotGemini = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleUserInput = async () => {
        if (!userInput.trim()) return; // Kiểm tra input không rỗng

        // Cập nhật chat với tin nhắn của người dùng
        let updateChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];
        setChat(updateChat); // Hiển thị ngay tin nhắn của user
        setUserInput(""); // Reset input

        setLoading(true);
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY_GEMINI}`,
                {
                    contents: updateChat,
                }
            );

            console.log("Gemini pro API response: ", response.data);

            // Lấy nội dung từ API response
            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ API!";
            console.log("Model Response: ", modelResponse);

            // Cập nhật chat với phản hồi của chatbot
            const updatedChatWithModel = [
                ...updateChat,
                {
                    role: "model",
                    parts: [{ text: modelResponse }],
                },
            ];
            setChat(updatedChatWithModel);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setError("Có lỗi xảy ra khi kết nối tới API!");
        } finally {
            setLoading(false);
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble role={item.role} text={item.parts[0].text} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gemini Chatbot</Text>
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập vào đây"
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center",
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 25,
        color: "#333",
        backgroundColor: "#fff",
    },
    button: {
        padding: 10,
        backgroundColor: "#007AFF",
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
});

export default ChatBotGemini;
