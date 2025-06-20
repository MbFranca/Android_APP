import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from './src/authProvider';

export default function App() {
  const { signOut } = useAuth();
  return (
    <View style={style.aling}>
      <Text style={style.aling}> Index text(Slot)</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
      <Text>Sign out</Text>
    </View>
  );
}

const style = StyleSheet.create({
  aling: {
    textAlign: 'center',
  },
});
