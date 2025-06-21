import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home';
import Agenda from './agenda';
import Relatorio from './relatorio';
import Gerenciar from './gerenciar';
import Feather from '@expo/vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={Agenda}
        options={{
          headerShadowVisible: false,
          headerStyle: {
             backgroundColor: '#EEEFF3',
          },

          tabBarIcon: () => <Feather name="calendar" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="Gerenciar"
        component={Gerenciar}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="clipboard" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Relatorio"
        component={Relatorio}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="check-square" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
