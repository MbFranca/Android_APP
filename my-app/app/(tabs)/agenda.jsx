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
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import ListFooter from '../components/listFooter';
import ModalNewOcupation from '../components/modalNewOcupation';

export default function Agenda() {
  const isFetchingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [selectedItem, setSelectedItem] = useState('evento');
  const [ocupacoes, setOcupacoes] = useState([]);
  const [visible, setVisible] = useState(false)
  const data = [{ tipo: 'evento' }, { tipo: 'ocupações' }];

  const fetchOcupations = async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      let query = supabase
        .from('salas')
        .select('*')
        .order('id', { ascending: false })
        .limit(Number(process.env.EXPO_PUBLIC_PAGE_SIZE));

      if (lastId) query = query.lt('id', lastId);
      const { data: newData, error } = await query;
      if (error) console.log('Erro ao retornar ocupações ' + error);
      if (newData.length < Number(process.env.EXPO_PUBLIC_PAGE_SIZE)) {
        setHasMore(false);
      }
      if (newData.length > 0) {
        setLastId(newData[newData.length - 1].id);
        setOcupacoes((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.log('Erro ao carregar ocupações ' + error);
      return;
    } finally {
      isFetchingRef.current = false;
      setLoading(loading);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <View style={styles.eventContainer}>
          <Text style={[styles.eventItem, { fontWeight: '500' }]}>
            10:00 - 10:00
          </Text>
          <Text style={[styles.eventItem, { fontWeight: '800' }]}>
            {item.numero_sala}
          </Text>
          <Text style={[styles.eventItem, { fontWeight: '500' }]}>
            {item.tipo_sala}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchOcupations();
  }, []);

  const onPress = (item) => {
    if (item === selectedItem) return;
    setSelectedItem(item);
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyItem}>
        <Text style={{ fontSize: 16 }}>Sem Ocupações registradas</Text>
      </View>
    );
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
            keyExtractor={(item) => item.tipo}
            style={[styles.categoryFilter]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onPress(item.tipo)}>
                <Text
                  style={[
                    styles.filterTittle,
                    item.tipo === selectedItem && styles.filtroAtivo,
                  ]}
                >
                  {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
          ></FlatList>
        </View>
        <ModalNewOcupation visible={visible}  onClose={(()=> setVisible(false))}/>
        <View style={{ flex: 1, marginTop: 30 }}>
          <FlatList
            data={ocupacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={[{ height: 190 }]}
            onEndReached={fetchOcupations}
            ListFooterComponent={loading ? <ListFooter /> : null}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyComponent}
          ></FlatList>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.6} onPress={()=> setVisible(true)}>
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
    backgroundColor: '#004CC6',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  categoryFilter: {},
  filterTittle: {
    color: '#4e4e4ec5',
    borderRadius: 12,
    marginHorizontal: 5,
    minWidth: 90,
    padding: 5,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroAtivo: {
    backgroundColor: '#0F273F',
    color: '#ffff',
    elevation: 2,
  },
  eventContainer: {
    elevation: 2,
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
  emptyItem: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
