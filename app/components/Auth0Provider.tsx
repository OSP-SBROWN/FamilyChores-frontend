import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export default function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  // For React Router v7, we'll use window.ENV if available, otherwise fallback to process.env
  const getEnvVar = (key: string, fallback: string) => {
    if (typeof window !== 'undefined' && (window as any).ENV) {
      return (window as any).ENV[key] || fallback;
    }
    return (process.env as any)[key] || fallback;
  };

  const domain = getEnvVar('REACT_APP_AUTH0_DOMAIN', 'your-tenant.us.auth0.com');
  const clientId = getEnvVar('REACT_APP_AUTH0_CLIENT_ID', 'XFn1RDJyy6iQBmKdXM8KP6f7Kzp4CoNf');
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: getEnvVar('REACT_APP_AUTH0_AUDIENCE', ''),
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
