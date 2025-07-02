import React, { createContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../libs/supabaseClient';

export const OcupationContext = createContext({});
export function useFetchOcupation() {
  return React.useContext(OcupationContext);
}

export default function OcupationProvider({ children }) {
  const isFetchingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [ocupacoes, setOcupacoes] = useState([]);

  const fetchOcupations = async () => {
    console.log('Chamada');
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      console.log('requisição');
      let query = supabase
        .from('ocupacoes')
        .select(
          `*,   materias (*), professores (nome), salas (numero_sala, blocos (nome)), turmas (numero)`,
        )
        .limit(Number(process.env.EXPO_PUBLIC_PAGE_SIZE));

      if (lastId) query = query.lt('id', lastId);
      const { data: newData, error } = await query;
      if (error) console.error('Erro ao retornar ocupações ' + error);
      if (newData.length < Number(process.env.EXPO_PUBLIC_PAGE_SIZE)) {
        setHasMore(false);
      }
      if (newData.length > 0) {
        setLastId(newData[newData.length - 1].id);
        setOcupacoes((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.error('Erro ao carregar ocupações ' + error);
      return;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const resetOcupation = () => {
    setHasMore(true);
    setOcupacoes([]);
    setLastId(null);
    isFetchingRef.current = false; //no reset garante false

    setTimeout(() => {
      fetchOcupations();
    }, 0); // aplicar estados antes do fetch
  };

  useEffect(() => {
    fetchOcupations();
  }, []);

  const value = {
    resetOcupation,
    fetchOcupations,
    hasMore,
    lastId,
    ocupacoes,
    loading,
    setOcupacoes,
  };

  return (
    <OcupationContext.Provider value={value}>
      {children}
    </OcupationContext.Provider>
  );
}
