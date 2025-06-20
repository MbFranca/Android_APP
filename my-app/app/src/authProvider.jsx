import React, { createContext, useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { supabase } from '../libs/supabaseClient';

export const AuthContext = createContext({});
export function useAuth() {
  return React.useContext(AuthContext);
}
export default function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data, error } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session ? session.user : null);
        setInitialized(true); // controla a primeira chamada ao supabase.
        //console.log(session.user.email)
      },
    );
    if (error) console.log(error);
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    initialized,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
