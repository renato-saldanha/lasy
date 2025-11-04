import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function HomePage() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  } catch (error) {
    // Se houver erro ao verificar autenticação, redireciona para login
    redirect('/login');
  }
}
