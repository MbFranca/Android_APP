import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../src/authProvider';
import Header from '../components/header';
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import ListFooter from '../components/listFooter';
export default function HomePage() {
  const { signOut } = useAuth();
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('salas')
        .select('*')
        .limit(Number(process.env.EXPO_PUBLIC_PAGE_SIZE));

      const { data } = await query;
      setData(data);
    } catch (error) {
      console.error('erro ao carregar dados' + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ backgroundColor: '#EEEFF3' }}>
      <Header />
      <View style={style.container}>
        <Text style={style.tittles}>Hoje</Text>
        <View>
          <Text></Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={style.resumeItem}>
                <Text>{item.id}</Text>
              </View>
            )}
            ListFooterComponent={loading ? <ListFooter /> : null}
            style={[style.resumeContainer, { height: 200 }]}
          ></FlatList>
        </View>
        <Text style={style.tittles}>Estatísticas Rápidas</Text>
        <View style={style.shortcutContainer}>
          <View style={style.shortcut}>
            <Text>Salas disponíveis</Text>
          </View>
          <View style={style.shortcut}>
            <TouchableOpacity>
              <Feather name="plus-circle" size={24} color={'black'} />
            </TouchableOpacity>
            <Text>Taxa de Ocupação</Text>
          </View>
          <View style={style.shortcut}>
            <Text>Nova Ocupação</Text>
          </View>
        </View>
        <Text style={style.tittles}>Notificações</Text>
        <View style={style.notifContainer}>
          <View>
            <Text></Text>
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
    borderRadius: 10,
    padding: 15,
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
    borderBlockColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row' 
  }
});
