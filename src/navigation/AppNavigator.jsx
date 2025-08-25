// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EvaluationScreen from '../app/EvaluationScreen';
import IpscbScreen from '../app/IpscbScreen';
import BradenScreen from '../app/BradenScreen';
import BradenQScreen from '../app/BradenQScreen';
import ReferenceScreen from '../app/ReferenceScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="EvaluationClinique" component={EvaluationScreen} />
      <Stack.Screen name="IPSCB" component={IpscbScreen} />
      <Stack.Screen name="Braden" component={BradenScreen} />
      <Stack.Screen name="BradenQ" component={BradenQScreen} />
      <Stack.Screen name="References" component={ReferenceScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;