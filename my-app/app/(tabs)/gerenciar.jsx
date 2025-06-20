import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
export default function Gerenciar() {
  return (
    <View style={style.container}>
      <View style={style.tittleWrapper}>
        <Text style={style.tittle}>Gerenciar</Text>
      </View>
      <View style={style.bottomContainer}>
        <View style={style.bottomOption}>
          <Text style={style.textOption}>Ocupações</Text>
          <TouchableOpacity style={style.button}>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={style.bottomOption}>
          <Text style={style.textOption}>Salas</Text>
          <TouchableOpacity style={style.button}>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#F9F7F6',
    height: '100%',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingTop: 30,
  },
  bottomOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderBlockColor: '#000000',
  },
  tittleWrapper: {
    width: '100%',
    height: 120,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  tittle: {
    fontSize: 40,
    fontWeight: '600',
  },
  textOption: {
    paddingLeft: 20,
    fontSize: 28,
  },
  button: {
    width: '10%',
  },
});
