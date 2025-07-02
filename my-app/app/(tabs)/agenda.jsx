import {
  Text,
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
  Alert,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import ListFooter from '../components/listFooter';
import ModalNewOcupation from '../components/modalNewOcupation';
import ModalDetailsOcupation from '../components/modalDetailsOcupation';
import { formatarHorario } from '../libs/formataHorario';
import { useFetchOcupation } from '../src/ocupationProvider';

export default function Agenda() {
  const {ocupacoes, loading, fetchOcupations, resetOcupation} = useFetchOcupation();
  const [visibleDetails, setVisibleDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [visibleNew, setVisibleNew] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedItem, setSelectedItem] = useState('evento');
  const data = [{ tipo: 'evento' }, { tipo: 'ocupações' }];

  const deleteOcupation = async (id) => {
    try {
      const { data, error } = await supabase
        .from('ocupacoes')
        .delete()
        .eq('id', id)
        .select();

      if (error) console.error('Erro ao deletar ocupação: ', error.message);
      resetOcupation();
    } catch (error) {
      console.error('Erro ao deletar ocupação: ', error);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setVisibleDetails(true);
          setDetails(item);
        }}
        activeOpacity={1}
      >
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <View style={styles.eventContainer}>
            <Text style={[styles.eventItem, { fontWeight: '500' }]}>
              {`${formatarHorario(item.horario_inicio)}-${formatarHorario(item.horario_fim)}`}
            </Text>
            <Text style={[styles.eventItem, { fontWeight: '800' }]}>
              {item.salas.numero_sala}
            </Text>
            <Text style={[styles.eventItem, { fontWeight: '500' }]}>
              {item.materias.nome}
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 5, bottom: 5, padding: 5 }}
              onPress={() => {
                Alert.alert(
                  'Confirmar exclusão',
                  'Tem certeza que deseja excluir este Ocupação?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Excluir',
                      onPress: () => deleteOcupation(item.id),
                      style: 'destructive',
                    },
                  ],
                );
              }}
            >
              <AntDesign name="delete" size={18} color="#fa6060d1" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: 'absolute', right: 50, bottom: 5, padding: 5 }}
              onPress={() => {
                setEditData(item);
                setVisibleNew(true);
              }}
            >
              <AntDesign name="edit" size={18} color="#004CC6" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    console.log('agenda')
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
        {/* Input container */}
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

        {/* Fillter container */}
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

        {/* Modal */}
        <ModalNewOcupation
          visible={visibleNew}
          onClose={() => setVisibleNew(false)}
          onSave={() => {
            resetOcupation();
          }}
          editData={editData}
        />

        {/* Modal */}
        <ModalDetailsOcupation
          details={details}
          onClose={() => setVisibleDetails(false)}
          visible={visibleDetails}
        ></ModalDetailsOcupation>

        {/* FlatList Ocupations */}
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
      {/*Bt add Ocupations */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.6}
        onPress={() => {
          setVisibleNew(true), setEditData();
        }}
      >
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
