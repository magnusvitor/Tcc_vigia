import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Perfil from '../screens/Perfil/index';
import Info from '../screens/Perfil/info'; 

import CustomHeader from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Perfi"
        component={Perfil}
        options={{
          header: () => <CustomHeader />,
        }}
      />

      <Stack.Screen
        name="Info"
        component={Info}
        options={{
          title: 'Informações',
        }}
      />
    </Stack.Navigator>
  );
}