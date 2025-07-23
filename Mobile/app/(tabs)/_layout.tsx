import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, FileText, MessageCircle, User,Bell } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 34 : 12,
          paddingTop: 12,
          paddingHorizontal: 8,
          height: Platform.OS === 'ios' ? 95 : 75,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          elevation: 20,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter-SemiBold',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 16,
          marginHorizontal: 4,
        },
        tabBarIconStyle: {
          marginBottom: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <Home 
              color={color} 
              size={focused ? 24 : 22}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Ocorrências',
          tabBarIcon: ({ color, size, focused }) => (
            <FileText 
              color={color} 
              size={focused ? 24 : 22}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Suporte',
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle 
              color={color} 
              size={focused ? 24 : 22}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
      />
      

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, size, focused }) => (
            <Bell 
              color={color} 
              size={focused ? 24 : 22}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

            <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <User 
              color={color} 
              size={focused ? 24 : 22}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}