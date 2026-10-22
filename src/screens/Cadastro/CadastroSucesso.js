import React, { useEffect } from "react";

import {
    View,
    Text
} from "react-native";

import {
    useNavigation
} from "@react-navigation/native";

import styles from "./styles";


export default function CadastroSucesso(){

    const navigation = useNavigation();


    useEffect(()=>{

        const timer = setTimeout(()=>{
            navigation.navigate("Login");
        },5000);


        return () => clearTimeout(timer);

    },[]);



    return(

        <View style={styles.successContainer}>


            <View style={styles.card}>


                <View style={styles.circle}>

                    <Text style={styles.check}>
                        ✓
                    </Text>

                </View>



                <Text style={styles.titulo}>
                    Cadastro realizado!
                </Text>



                <Text style={styles.texto}>
                    Sua conta foi criada com sucesso.
                </Text>



                <View style={styles.line}/>



                <Text style={styles.redirect}>
                    Você será redirecionado para o login...
                </Text>



                <View style={styles.loadingBox}>

                    <View style={styles.loading}/>

                </View>


            </View>


        </View>

    );

}