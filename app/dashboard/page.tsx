'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export default function Dashboard() {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (userId === null) {
      router.replace('/');
    }
  }, [userId, router]);

  if (userId === null) return null;

  return (
    <div>

    </div>
  );
}
