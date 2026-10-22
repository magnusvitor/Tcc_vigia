import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function Index({ navigation }) {
    return (
        <View style={styles.container}>

            <View style={styles.alertBox}>
                <Ionicons name="warning" size={20} color="#a94442" />
                <Text style={styles.alertText}>
                    Use apenas em situações reais de risco.
                </Text>
            </View>

            {/*BOTÃO*/}
            <View style={styles.centerArea}>

                <TouchableOpacity onPress={() => navigation.navigate('Forms')}>
                    <View style={styles.outerCircle}>
                        <View style={styles.middleCircle}>
                            <View style={styles.innerCircle}>
                                <Ionicons name="warning-outline" size={42} color="#fff" />
                                <Text style={styles.emergencyText}>
                                    EMERGÊNCIA
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={styles.bottomText}>
                    Toque para acionar o alerta
                </Text>

                <Text style={styles.subText}>
                    Será compartilhado para sua comunidade
                </Text>

            </View>

        </View>
    );
}