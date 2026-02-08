import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import LeadsScreen from '../screens/LeadsScreen';
import LeadDetailScreen from '../screens/LeadDetailScreen';
import CompaniesScreen from '../screens/CompaniesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type LeadsStackParamList = {
  LeadsHome: undefined;
  LeadDetail: { id: string };
};

export type RootTabParamList = {
  Dashboard: undefined;
  Leads: undefined;
  Companies: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const LeadsStack = createNativeStackNavigator<LeadsStackParamList>();

function LeadsStackNavigator() {
  return (
    <LeadsStack.Navigator>
      <LeadsStack.Screen
        name="LeadsHome"
        component={LeadsScreen}
        options={{ title: 'Leads' }}
      />
      <LeadsStack.Screen
        name="LeadDetail"
        component={LeadDetailScreen}
        options={{ title: 'Lead Detail' }}
      />
    </LeadsStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="Leads"
        component={LeadsStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Companies" component={CompaniesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
