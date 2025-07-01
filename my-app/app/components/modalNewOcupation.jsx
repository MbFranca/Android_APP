import { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { formatarHorario } from '../libs/formataHorario';
import DropDownPicker from 'react-native-dropdown-picker';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../libs/supabaseClient';
export default function ModalNewOcupation({
  visible,
  onClose,
  onSave,
  editData = null,
}) {
  const [loading, setLoading] = useState(false);
  const [salas, setSalas] = useState([]);
  const [professor, setProfessor] = useState([]);
  const [turma, setTurma] = useState([]);
  const [materia, setMateria] = useState([]);

  const [showDropDown, setShowDropDown] = useState(null);
  const [showSalas, setShowSalas] = useState();
  const [showTurma, setShowTurma] = useState();
  const [showMateria, setShowMateria] = useState();
  const [showProfessor, setShowProfessor] = useState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      sala_id: null,
      turma_id: '',
      professor_id: '',
      materia_id: '',
      horario_inicio: '',
      horario_fim: '',
      observacoes: '',
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: turmasData, error: turmasError } = await supabase
        .from('turmas')
        .select('*');

      if (turmasError) console.error('Erro ao retornar turma ' + turmasError);
      setTurma(turmasData.map((t) => ({ label: t.numero, value: t.id })));
    } catch (error) {
      console.error('Erro ao buscar turmas ' + turmasError);
    }

    try {
      const { data: professoresData, error: professoresError } = await supabase
        .from('professores')
        .select('*');

      if (professoresError) {
        console.error('Erro ao retornar professores ' + professoresError);
      }

      setProfessor(
        professoresData.map((p) => ({ label: p.nome, value: p.id })),
      );
    } catch (error) {
      console.error('Erro ao buscar professores ' + professoresError);
    }
    try {
      const { data: salasData, error: salasError } = await supabase
        .from('salas')
        .select('*');
      if (salasError) console.error('Erro ao retornar salas ' + salasError);
      setSalas(salasData.map((s) => ({ label: s.numero_sala, value: s.id })));
    } catch (error) {
      console.error('Erro ao buscar salas ' + salasError);
    }

    try {
      const { data: materiasData, error: materiasError } = await supabase
        .from('materias')
        .select('*');

      if (materiasError)
        console.error('Erro ao retornar materias ' + materiasError);
      setMateria(materiasData.map((m) => ({ label: m.nome, value: m.id })));
    } catch (error) {
      console.error('Erro ao buscar materias ' + materiasError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log('valor mudou: ', value);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (editData) {
      Object.keys(editData).forEach((key) => {
        setValue(key, editData[key]);
      });
    }
  }, []);

  const verificaConflitos = async (data) => {
    if (!data.sala_id) return true;
    try {
      const { data: conflitos, error } = await supabase

        .from('ocupacoes')
        .select(`*, materias (nome)`)
        .eq('sala_id', data.sala_id)
        .lte('horario_inicio', data.horario_fim)
        .gte('horario_fim', data.horario_inicio);
      console.log(conflitos);
      if (error) {
        console.error('Erro ao retornar conflitos: ', error);
      }
      const conflitosReais = editData
        ? conflitos.filter((c) => c.id !== editData.id)
        : conflitos; // no conflit
      console.log(conflitosReais, '\n', conflitos);
      if (conflitosReais.length > 0) {
        const conflitosDetails = conflitos
          .map(
            (c) =>
              `  ${c.materias?.nome || 'Matéria desconhecida '} (${formatarHorario(c.horario_inicio)} - ${formatarHorario(c.horario_fim)}) `,
          )
          .join('\n');
        Alert.alert(
          `Conflito de horario`,
          `Está sala já está ocupada nos horários selecionados:\n\n${conflitosDetails}`,
          [{ text: 'OK' }],
        );
        return false;
      }
      if (conflitosReais === 'null' || '[]') {
        return true;
      }
    } catch (error) {
      console.error('Erro ao verificar conflitos:', error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    let a;
    setLoading(true);
    try {
      if (data.sala_id) {
        const semConflito = await verificaConflitos(data);
        if (!semConflito) {
          setLoading(false);
          return;
        }
      }

      const dataOcupacao = {
        sala_id: data.sala_id,
        professor_id: data.professor_id,
        turma_id: data.turma_id,
        materia_id: data.materia_id,
        horario_inicio: data.horario_inicio,
        horario_fim: data.horario_fim,
        observacoes: data.observacoes || null,
      };

      let result;
      if (editData) {
        const { data: updatedData, error } = await supabase
          .from('ocupacoes')
          .update(dataOcupacao)
          .eq('id', editData.id)
          .select();
        result = updatedData[0];

        if (error) console.error('Erro ao atualizar ocupação', error);
      } else {
        const { data: newData, error } = await supabase
          .from('ocupacoes')
          .insert([dataOcupacao])
          .select();
        if (error) console.error('Erro ao salvar ocupação', error);
        result = newData[0];
      }
      onClose();
      onSave(editData ? 'Ocupação editada!' : 'Ocupação criada!');
    } catch (error) {
      console.error('Erro ao salvar ocupação ', error);
      Alert.alert('Erro', 'Não foi possível salvar a ocupação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#00000029',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingBottom: 16,
                  width: '85%',
                  elevation: 8,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <View style={{ backgroundColor: '#2053A4', padding: 16 }}>
                  <Text
                    style={{
                      color: '#ffff',
                      textAlign: 'center',
                      fontSize: 22,
                      fontWeight: 600,
                    }}
                  >
                    {editData ? 'EDITAR OCUPAÇÃO' : 'CRIAR OCUPAÇÃO'}
                  </Text>
                </View>
                <View style={styles.loadingContainer}>
                  {loading ? (
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ActivityIndicator
                        size={26}
                        style={{ margin: 20 }}
                      ></ActivityIndicator>
                    </View>
                  ) : (
                    <View style={styles.formContainer}>
                      <Text style={styles.label}>Turma</Text>
                      <Controller
                        control={control}
                        name="turma_id"
                        rules={{ required: 'Turma é obrigatória' }}
                        render={({ field: { onChange, value } }) => (
                          <DropDownPicker
                            open={showDropDown === 'turma'}
                            value={value}
                            items={turma}
                            setOpen={(open) => {
                              setShowDropDown(open ? 'turma' : null);
                            }}
                            setValue={(val) => onChange(val())}
                            setItems={setTurma}
                            placeholder="Selecione uma turma"
                            style={[
                              styles.dropdown,
                              errors.turma && styles.inputError,
                            ]}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.placeholderStyle}
                            zIndex={3000}
                            zIndexInverse={1000}
                          />
                        )}
                      />
                      {errors.turma_id && (
                        <Text style={styles.errorText}>
                          {errors.turma_id.message}
                        </Text>
                      )}
                      <Text style={[styles.label]}>Professores</Text>
                      <Controller
                        control={control}
                        name="professor_id"
                        rules={{ required: 'Professors é obrigatório' }}
                        render={({ field: { onChange, value } }) => (
                          <DropDownPicker
                            open={showDropDown === 'professor'}
                            value={value}
                            items={professor}
                            setOpen={(open) => {
                              setShowDropDown(open ? 'professor' : null);
                            }}
                            setValue={(val) => onChange(val())}
                            setItems={setProfessor}
                            placeholder="Selecione um professor"
                            style={[
                              styles.dropdown,
                              errors.professor && styles.inputError,
                            ]}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.placeholderStyle}
                            zIndex={2000}
                            zIndexInverse={2000}
                          />
                        )}
                      />
                      {errors.professor_id && (
                        <Text style={styles.errorText}>
                          {errors.professor_id.message}
                        </Text>
                      )}
                      <Text style={styles.label}>Matérias</Text>
                      <Controller
                        control={control}
                        name="materia_id"
                        rules={{ required: 'Materia é obrigatória' }}
                        render={({ field: { onChange, value } }) => (
                          <DropDownPicker
                            open={showDropDown === 'materias'}
                            value={value}
                            items={materia}
                            setOpen={(open) => {
                              setShowDropDown(open ? 'materias' : null);
                            }}
                            setValue={(val) => onChange(val())}
                            setItems={setMateria}
                            placeholder="Selecione uma matéria"
                            style={[
                              styles.dropdown,
                              errors.materia && styles.inputError,
                            ]}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.placeholderStyle}
                            zIndex={1000}
                            zIndexInverse={3000}
                          />
                        )}
                      />
                      {errors.materia_id && (
                        <Text style={styles.errorText}>
                          {errors.materia_id.message}
                        </Text>
                      )}
                      <Text style={styles.label}>Salas</Text>
                      <Controller
                        control={control}
                        name="sala_id"
                        render={({ field: { onChange, value } }) => (
                          <DropDownPicker
                            open={showDropDown === 'salas'}
                            value={value}
                            items={salas}
                            setOpen={(open) => {
                              setShowDropDown(open ? 'salas' : null);
                            }}
                            setValue={(val) => onChange(val())}
                            setItems={setSalas}
                            placeholder="Selecione uma sala"
                            style={[
                              styles.dropdown,
                              errors.salas && styles.inputError,
                            ]}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.placeholderStyle}
                            zIndex={500}
                            zIndexInverse={3500}
                          />
                        )}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={styles.label}>Horario inicio</Text>
                          <Controller
                            control={control}
                            name="horario_inicio"
                            rules={{
                              required: 'Horário é obrigatório',
                              pattern: {
                                value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                message: 'Formato: HH:MM',
                              },
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextInput
                                style={styles.inputHour}
                                onChangeText={(text) =>
                                  onChange(formatarHorario(text))
                                }
                                value={value}
                                keyboardType="numbers-and-punctuation"
                                maxLength={5}
                                placeholder="08:00"
                              ></TextInput>
                            )}
                          />
                          {errors.horario_inicio && (
                            <Text style={styles.errorText}>
                              {errors.horario_inicio.message}
                            </Text>
                          )}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={styles.label}>Horario Fim</Text>
                          <Controller
                            control={control}
                            name="horario_fim"
                            rules={{
                              required: 'Horário é obrigatório',
                              pattern: {
                                value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                message: 'Formato: HH:MM',
                              },
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextInput
                                style={styles.inputHour}
                                onChangeText={(text) =>
                                  onChange(formatarHorario(text))
                                }
                                value={value}
                                onBlur={onBlur}
                                keyboardType="numbers-and-punctuation"
                                maxLength={5}
                                placeholder="10:00"
                              ></TextInput>
                            )}
                          />
                          {errors.horario_fim && (
                            <Text style={styles.errorText}>
                              {errors.horario_fim.message}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.label}>Observações</Text>
                      <Controller
                        control={control}
                        name="observacoes"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.textArea}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline={true}
                            numberOfLines={4}
                            placeholder=""
                          />
                        )}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          onPress={onClose}
                          style={{ width: 100 }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              borderWidth: 2,
                              paddingVertical: 10,
                              color: 'black',
                              borderColor: 'gray',
                              borderRadius: 10,
                              fontWeight: 500,
                            }}
                          >
                            Cancelar
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: 100 }}
                          onPress={handleSubmit(onSubmit)}
                          disabled={loading}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              paddingVertical: 10,
                              backgroundColor: '#27AF77',
                              color: '#fff',
                              borderRadius: 10,
                              fontWeight: 500,
                            }}
                          >
                            Salvar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    borderWidth: 1,
  },
  formContainer: {
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  label: { fontSize: 18, fontWeight: 600, marginTop: 15, marginBottom: 5 },
  dropdownContainer: {
    maxHeight: 5 * 30,
  },
  dropdown: { backgroundColor: '#F1F8FE', borderColor: '#3490EB' },
  inputError: {},
  placeholderStyle: { color: '#00000078', fontSize: 15 },
  inputHour: {
    borderColor: '#3490EB',
    backgroundColor: '#F1F8FE',
    borderWidth: 1,
    borderRadius: 10,
    width: 130,
    fontSize: 15,
    fontWeight: 500,
    paddingLeft: 10,
  },
  textArea: {
    borderColor: '#3490EB',
    borderWidth: 1,
    borderRadius: 10,
    height: 80,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  errorText: { color: 'red' },
});
