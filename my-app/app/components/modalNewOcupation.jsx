import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

export default function ModalNewOcupation({ visible, onClose }) {
  const [turma, setTurma] = useState();
  const [salaId, setSalaId] = useState();
  const [professor, setProfessor] = useState();
  const [materia, setMateria] = useState();
  const [horarioInicio, setHorarioInicio] = useState();
  const [horarioFim, setHorarioFim] = useState();
  const [observacoes, setObservacoes] = useState('');

  const novaOcupacao = {
    sala_id: salaId,
    observacoes: observacoes || null,
    turma,
    professor,
    materia,
    horario_inicio: horarioInicio,
    horario_fim: horarioFim,
    sala_id: salaId,
  };

  return (
    <SafeAreaView>
      <Modal
        transparent
        animationType="fade"
        style={{ backgroundColor: 'red' }}
        visible={visible}
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
                  padding: 16,
                  width: '85%',
                  elevation: 8,
                }}
              >
                <Text>I am the modal content!</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
