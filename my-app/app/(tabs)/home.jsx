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
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../libs/supabaseClient';
import ListFooter from '../components/listFooter';

export default function HomePage() {
  const { signOut } = useAuth();
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const dayWeek = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const fetchData = async () => {
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

      if (error) console.log('erro ao retornar data', error);

      if (newData.length < Number(process.env.EXPO_PUBLIC_PAGE_SIZE))
        setHasMore(false);

      if (newData.length > 0) {
        setLastId(newData[newData.length - 1].id);
        setData((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.error('erro ao carregar dados' + error);
      return;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItemm = ({ item }) => {
    return (
      <View style={style.resumeItem}>
        <Text style={style.itemText}>{'19:00-21:00'}</Text>
        <Text style={style.itemText}>{item.numero_sala}</Text>
        <Text
          style={[style.itemText, { width: 105 }]}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.tipo_sala}
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
    <View style={{ backgroundColor: '#EEEFF3' }}>
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
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItemm}
            ListFooterComponent={loading ? <ListFooter /> : null}
            style={[style.resumeContainer, { height: 190 }]}
            onEndReached={fetchData}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={emptyComponent}
          ></FlatList>
        </View>
        <Text style={style.tittles}>Estatísticas Rápidas</Text>

        <View style={style.shortcutContainer}>
          <View style={[style.shortcut, { height: 95 }]}>
            <Text style={[style.shortcutText]}>Salas disponíveis</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 130,
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
          <View style={[style.shortcut, { height: 95 }]}>
            <Text style={style.shortcutText}>Taxa de Ocupação</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 130,
              }}
            >
              <Text style={{ fontSize: 30 }}>58%</Text>
              <Entypo name="bar-graph" size={30} color="#5087ff" />
            </View>
          </View>

          <View
            style={[
              style.shortcut,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            <TouchableOpacity>
              <AntDesign name="pluscircle" size={36} color="#014DC6" />
            </TouchableOpacity>
            <Text
              style={[
                style.shortcutText,
                { flexWrap: 'wrap', width: 120, marginLeft: 20 },
              ]}
            >
              Nova Ocupação
            </Text>
          </View>
          <View
            style={[
              style.shortcut,
              { flexDirection: 'row', justifyContent: 'space-between' },
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
              style={[
                style.shortcutText,
                { flexWrap: 'wrap', width: 120, marginLeft: 20 },
              ]}
            >
              Verificar
            </Text>
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
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 350,
    alignItems: 'center',
    marginBottom: 20,
  },
  shortcut: {
    backgroundColor: '#ffff',
    width: 170,
    height: 65,
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 17,
  },
});
