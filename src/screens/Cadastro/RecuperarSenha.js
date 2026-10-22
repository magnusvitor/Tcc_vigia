import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView
} from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function RecuperarSenha() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");

    function handleRecuperar() {
        if (!email) {
            Alert.alert("Erro", "Por favor, digite seu e-mail.");
            return;
        }
        Alert.alert(
            "Sucesso", 
            "Se o e-mail estiver cadastrado, um link de redefinição será enviado para " + email,
            [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* O CARD BRANCO */}
            <View style={styles.form}>
                
                {/* Cabeçalho do Card */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Recuperar Senha</Text>
                    <View style={{ width: 36 }} /> 
                </View>

                <Text style={styles.instructionText}>
                    Insira o e-mail associado à sua conta para receber as instruções de recuperação.
                </Text>

                {/* Input de E-mail */}
                <Text style={styles.labelInputs}>E-mail cadastrado</Text>
                <TextInput
                    placeholder="seu@email.com"
                    placeholderTextColor="#b0b0b0"
                    style={styles.textInput}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />

                {/* Botão */}
                <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
                    <Text style={styles.buttonText}>Enviar Instruções</Text>
                </TouchableOpacity>

                {/* voltar ao Login */}
                <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.footerText}>
                        Lembrou a senha? <Text style={styles.footerTextBold}>Entrar</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}
