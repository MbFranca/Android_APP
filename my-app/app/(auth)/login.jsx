import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { supabase } from '../libs/supabaseClient';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
    setEmail('');
    setPassword('');
  };

  return (
    <View style={style.aling}>
      <Spinner visible={loading}></Spinner>
      <TextInput
        autoComplete="none"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={style.textInput}
      ></TextInput>
      <TextInput
        autoComplete="none"
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={style.textInput}
        secureTextEntry
      ></TextInput>

      <TouchableOpacity onPress={onSignInPress}>
        <Text style={style.aling}>Sing in</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  aling: {
    textAlign: 'center',
  },
  textInput: {
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});
