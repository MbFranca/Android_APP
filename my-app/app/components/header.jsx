import { StyleSheet, View, Text, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Header() {
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <View style={style.headerText}>
          <Text style={style.text}> Seja Bem-vindo </Text>
        </View>
        <View style={style.profile}>
          <View style={style.imageProfile}>
            <Feather name="user" size={30} color="black" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
    safeArea: {
    backgroundColor: '#014DC6',
  },
  container: {
    backgroundColor: '#014DC6',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
  },
  profile: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 50,
  },
  imageProfile: {},
  headerText: {},
});
