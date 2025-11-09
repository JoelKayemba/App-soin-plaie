// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EvaluationScreen from '../app/EvaluationScreen';
import IpscbScreen from '../app/IpscbScreen';
import BradenScreen from '../app/BradenScreen';
import BradenQScreen from '../app/BradenQScreen';
import ReferenceScreen from '../app/ReferenceScreen';
import NewsScreen from '../app/NewsScreen';
import SearchScreen from '../app/SearchScreen';
import SettingsScreen from '../app/SettingsScreen';
import AppearanceScreen from '../app/settings/AppearanceScreen';
import FavoritesScreen from '../app/FavoritesScreen';
import HelperOverlayScreen from '../app/HelperOverlayScreen';
import EvaluationSummaryScreen from '../app/EvaluationSummaryScreen';


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
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AppearanceSettings" component={AppearanceScreen} />
      <Stack.Screen name="Favoris" component={FavoritesScreen} />
      <Stack.Screen
        name="HelperDetails"
        component={HelperOverlayScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="EvaluationSummary"
        component={EvaluationSummaryScreen}
        options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;