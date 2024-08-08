// components/withAdminAuth.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ComponentType } from "react";

const withAdminAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAdminAuth = (props: P) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    
    if (status === "loading") {
      return <p>Loading...</p>;
    }
    
    if (!session || !(session.user as any).isAdmin) {
      router.replace("/");
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithAdminAuth.displayName = `WithAdminAuth(${getDisplayName(WrappedComponent)})`;
  return WithAdminAuth;
};

function getDisplayName<P>(WrappedComponent: ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAdminAuth;