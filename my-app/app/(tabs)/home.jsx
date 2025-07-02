import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useAuth } from '../src/authProvider';
import Header from '../components/header';
import ListFooter from '../components/listFooter';
import { formatarHorario } from '../libs/formataHorario';
import { useFetchOcupation } from '../src/ocupationProvider';
import { useEffect } from 'react';

export default function HomePage() {
  const { signOut } = useAuth();
  const { ocupacoes, loading, fetchOcupations } = useFetchOcupation();

  const dayWeek = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    fetchOcupations();
    console.log('home')
  }, []);
  const renderItemm = ({ item }) => {
    return (
      <View style={style.resumeItem}>
        <Text
          style={style.itemText}
        >{`${formatarHorario(item.horario_inicio)}-${formatarHorario(item.horario_fim)}`}</Text>
        <Text style={style.itemText}>{item.salas.numero_sala}</Text>
        <Text
          style={[style.itemText, { width: 105 }]}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.materias.nome}
        </Text>
      </View>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={style.emptyItem}>
        <Text style={{ fontSize: 16 }}>Sem Ocupações registradas</Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: '#EEEFF3', flex: 1 }}>
      <Header />
      <View style={style.container}>
        <Text style={style.tittles}>Hoje</Text>
        <View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBlockColor: '#0000001a',
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          >
            <Text
              style={{
                backgroundColor: '#ffff',
                fontSize: 18,
                paddingLeft: 30,
                paddingBottom: 8,
                paddingTop: 5,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                color: '#0505057f',
              }}
            >
              {dayWeek}
            </Text>
          </View>

          <FlatList
            data={ocupacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItemm}
            ListFooterComponent={loading ? <ListFooter /> : null}
            style={[style.resumeContainer, { height: 190 }]}
            onEndReached={fetchOcupations}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={emptyComponent}
          ></FlatList>
        </View>

        <Text style={style.tittles}>Estatísticas Rápidas</Text>
        {/* Estatísticas Rápidas */}
        <View style={[style.shortcutContainer]}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={[style.shortcut, { height: 90 }]}>
              <Text style={[style.shortcutText, { fontSize: 15 }]}>
                Salas disponíveis
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Text style={{ fontSize: 30 }}>10/58</Text>
                <View
                  style={{
                    padding: 13,
                    backgroundColor: 'green',
                    borderRadius: 50,
                  }}
                ></View>
              </View>
            </View>
            <View style={[style.shortcut, { height: 90 }]}>
              <Text style={[style.shortcutText, { fontSize: 14 }]}>
                Taxa de Ocupação
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Text style={{ fontSize: 30 }}>58%</Text>
                <Entypo name="bar-graph" size={30} color="#5087ff" />
              </View>
            </View>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View
              style={[
                style.shortcut,
                { flexDirection: 'row', justifyContent: 'center' },
              ]}
            >
              <TouchableOpacity>
                <AntDesign name="pluscircle" size={36} color="#014DC6" />
              </TouchableOpacity>
              <Text
                style={[style.shortcutText, { maxWidth: 120, marginLeft: 10 }]}
              >
                Nova Ocupação
              </Text>
            </View>
            <View
              style={[
                style.shortcut,
                { flexDirection: 'row', justifyContent: 'center' },
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: '#014DC6',
                    padding: 5,
                    borderRadius: 6,
                  }}
                >
                  <AntDesign name="search1" size={24} color="white" />
                </View>
              </TouchableOpacity>
              <Text
                style={[style.shortcutText, { maxWidth: 120, marginLeft: 10 }]}
              >
                Verificar
              </Text>
            </View>
          </View>
        </View>

        <Text style={style.tittles}>Notificações</Text>
        <View style={style.notifContainer}>
          <View>
            <Text>Zap 2</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  resumeContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 15,
    paddingBottom: 15,
    paddingRight: 20,
    elevation: 1,
    marginBottom: 20,
  },
  resumeDate: {
    marginBottom: 10,
  },
  resumeDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  hourDetails: { fontSize: 16 },
  roomDetails: { fontSize: 16 },
  tittleDetails: {
    flexShrink: 1,
    fontSize: 16,
    maxWidth: 140,
  },
  tittles: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  resumeItem: {
    borderBlockColor: '#0000001a',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'flex-start',
    marginTop: 10,
  },
  itemText: {
    fontSize: 17,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  emptyItem: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutContainer: {
    maxWidth: 350,
    marginBottom: 20,
  },
  shortcut: {
    backgroundColor: '#ffffff',
    minWidth: 150,
    maxWidth: 150,
    height: 65,
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 17,
    maxWidth: 120,
  },
});
