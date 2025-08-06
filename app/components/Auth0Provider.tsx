import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export default function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  // Hardcode the values for React Router v7 since env vars are tricky
  const domain = 'dev-yklzou5swbu1ag21.us.auth0.com';
  const clientId = 'XFn1RDJyy6iQBmKdXM8KP6f7Kzp4CoNf';
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
