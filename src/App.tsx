import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screens/Dashboard';
import AddTransaction from './screens/AddTransaction';
import { initDB } from './db';

export type RootStackParamList = {
  Dashboard: undefined;
  AddTransaction: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} options={{ title: 'Add Transaction' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
