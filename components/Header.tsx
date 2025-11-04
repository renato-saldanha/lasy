'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { User } from '@/types';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user as User);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-[#222651] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRM</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#0078b7] rounded-lg hover:bg-[#005a87] transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

