import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#8134AF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Pay',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="dollar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store-payment"
        options={{
          title: 'Store',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="qrScan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="qrcode" size={size} color={color} />
          ),
        }}
      />
     {/* <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="history" size={size} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}