// components/AdminProtectedRoute.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session || !session.user.isAdmin) {
      router.push('/'); // Redirect to home if not admin
    }
  }, [session, status, router]);
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session || !session.user.isAdmin) {
    return null; // Render nothing while redirecting
  }
  
  return <>{children}</>;
}