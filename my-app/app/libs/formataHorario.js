export const formatarHorario = (value) => {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length <= 2) {
      return numeros;
    } else {
      const horas = numeros.substring(0, 2); // indice 0 até o 1, nao conta com o 2
      const minutos = numeros.substring(2, 4);
      return `${horas}:${minutos}`;
    }
  };