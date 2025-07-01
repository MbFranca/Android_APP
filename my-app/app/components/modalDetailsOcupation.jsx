import { useEffect, useState } from 'react';
import { formatarHorario } from '../libs/formataHorario';
import {
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function ModalDetailsOcupation({ onClose, visible, details }) {
  const [trueDetails, setTrueDetails] = useState();
  useEffect(() => {
    if (trueDetails !== null) {
      setTrueDetails(details);
    } else return;
  }, [details]);

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
              justifyContent: 'flex-end',
              backgroundColor: '#00000029',
            }}
          >
            <TouchableWithoutFeedback>
              {details ? (
                <View style={styles.modalContainer}>
                  <View
                    style={{
                      backgroundColor: '#033A94',
                      padding: 15,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#FFFF',
                        fontSize: 20,
                      }}
                    >
                      Detalhes da Ocupação
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tittleDetails}>Disciplina</Text>
                    <Text style={styles.textDetails}>
                      {details.materias.nome}
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tittleDetails}>Professor</Text>
                    <Text style={styles.textDetails}>
                      {details.professores.nome}
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tittleDetails}>Sala</Text>
                    <Text style={styles.textDetails}>
                      {details.salas.numero_sala}
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tittleDetails}>Bloco</Text>
                    <Text style={styles.textDetails}>
                      {details.salas.blocos.nome}
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tittleDetails}>Horário</Text>
                    <Text style={styles.textDetails}>
                      {formatarHorario(details.horario_inicio)}-
                      {formatarHorario(details.horario_fim)}
                    </Text>
                  </View>
                  <View style={[styles.textContainer, {marginBottom:0}]}>
                    <Text style={styles.tittleDetails}>ARA</Text>
                    <Text style={styles.textDetails}>
                      {details.materias.ara}
                    </Text>
                  </View>
                  <Text></Text>
                </View>
              ) : null}
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    minHeight: 280,
    backgroundColor: '#FFFF',
    marginHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  tittleDetails: {
    maxHeight: 40,
    fontSize: 18,
    color: '#032A86',
    fontWeight: '600',
  },
  textDetails: {
    maxHeight: 40,
    fontSize: 18,
    textAlign: 'left',
    minWidth: 150,
    fontWeight: '500',
    color: '#00000092',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginHorizontal: 30,
  },
});
