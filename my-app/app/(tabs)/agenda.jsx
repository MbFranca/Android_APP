import {
  Text,
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';

export default function Agenda() {
  const data = ['evento', 'aula'];
  const [selectedItem, setSelectedItem] = useState('evento');

  const onPress = (item) => {
    if (item === selectedItem) return;
    setSelectedItem(item);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEFF3' }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.iconWrapper}>
            <AntDesign name="search1" size={24} color="#929292" style={{}} />
          </View>
          <TextInput
            style={styles.inputText}
            placeholder="Search input"
            keyboardType="default"
          ></TextInput>
        </View>
        <View style={{ marginTop: 20 }}>
          <FlatList
            horizontal
            data={data}
            keyExtractor={(item) => item}
            style={[styles.categoryFilter]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onPress(item)}>
                <Text
                  style={[
                    styles.filterTittle,
                    item === selectedItem && styles.filtroAtivo,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
          ></FlatList>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.eventContainer}>
            <Text style={[styles.eventItem, { fontWeight: '500' }]}>
              10:00 - 10:00
            </Text>
            <Text style={[styles.eventItem, { fontWeight: '800' }]}>
              Sala F102
            </Text>
            <Text style={[styles.eventItem, { fontWeight: '500' }]}>
              Prog Orientada a OBJ em JAVA
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.6}>
        <Entypo name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    marginTop: 20,
    flex: 1,
  },
  SafeAreaView: {},
  inputText: {
    backgroundColor: '#c7c7c740',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 60,
    height: 60,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  categoryFilter: {},
  filterTittle: {
    color: '#4e4e4ec5',
    borderRadius: 12,
    marginHorizontal: 5,
    width: 90,
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroAtivo: {
    backgroundColor: '#0F273F',
    color: '#ffff',
    elevation: 3,
  },
  eventContainer: {
    elevation: 3,
    backgroundColor: '#ffff',
    borderRadius: 12,
    padding: 10,
  },
  eventItem: { fontSize: 18, marginTop: 5, marginBottom: 5, color: '#13314D' },
  iconWrapper: {
    paddingLeft: 5,
    backgroundColor: '#c7c7c740',
    height: 45,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
