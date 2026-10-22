import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Image
} from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function Cadastro(){
    const navigation = useNavigation();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [ocultarSenha, setOcultarSenha] = useState(true);

    function cadastrar(){
        fetch("http://localhost/TCC/cadastro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                telefone: telefone
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.mensagem){
                navigation.navigate("CadastroSucesso");
            } else {
                Alert.alert("Erro", data.erro || "Erro ao cadastrar");
            }
        })
        .catch(error => {
            console.log(error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor");
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            
            
            <View style={styles.logoContainer}>
                <Image 
                    source={require("../../../assets/logo.png")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

           
            <View style={styles.form}>
                
                
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Criar conta</Text>
                    <View style={{ width: 36 }} /> 
                </View>

                {/* Inputs de Cadastro */}
                <Text style={styles.labelInputs}>Nome completo</Text>
                <TextInput
                    placeholder="Seu nome"
                    placeholderTextColor="#b0b0b0"
                    style={styles.textInput}
                    onChangeText={setNome}
                    value={nome}
                />

                <Text style={styles.labelInputs}>E-mail</Text>
                <TextInput
                    placeholder="seu@email.com"
                    placeholderTextColor="#b0b0b0"
                    style={styles.textInput}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />

                <Text style={styles.labelInputs}>Telefone</Text>
                <TextInput
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#b0b0b0"
                    style={styles.textInput}
                    keyboardType="phone-pad"
                    onChangeText={setTelefone}
                    value={telefone}
                />

                <Text style={styles.labelInputs}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="••••••"
                        placeholderTextColor="#b0b0b0"
                        style={styles.passwordInput}
                        secureTextEntry={ocultarSenha} 
                        onChangeText={setSenha}
                        value={senha}
                    />
                    
                    {senha.length > 0 && (
                        <TouchableOpacity onPress={() => setOcultarSenha(!ocultarSenha)} style={styles.eyeButton}>
                            <Text style={styles.eyeIconText}>
                                {ocultarSenha ? "👁️" : "🙈"} 
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

             
                <TouchableOpacity 
                    style={styles.forgotPasswordButton} 
                    onPress={() => navigation.navigate("RecuperarSenha")}
                >
                    <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.button} onPress={cadastrar}>
                    <Text style={styles.buttonText}>Cadastro</Text>
                </TouchableOpacity>

                
                <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.footerText}>
                        Já tem uma conta? <Text style={styles.footerTextBold}>Entrar</Text>
                    </Text>
                </TouchableOpacity>

            </View> 
        </SafeAreaView>
    );
}
