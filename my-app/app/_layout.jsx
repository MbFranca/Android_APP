import AuthProvider, { useAuth } from './src/authProvider';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function InitialLayout() {
  const { session, initialized } = useAuth();
  const segment = useSegments();
  const router = useRouter();
  
  useEffect(() => {

    if (!initialized) return;

    const inAuthGroup = segment[0] === '(auth)';

    if (session && !inAuthGroup) {
      router.replace('/gerenciar');
    }
    else if (session && inAuthGroup) {
      router.replace('/gerenciar');
    } else if (!session) {
      router.replace('/login');
    }
  }, [session, initialized, segment]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
