import * as React from 'react';
import { SessionProvider } from 'next-auth/react';

export const SessionProviderDecorator = storyFn => <SessionProvider>{storyFn()}</SessionProvider>;
