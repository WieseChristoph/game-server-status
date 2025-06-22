import 'fast-text-encoding'; // Required for CUID2
import React from 'react';
import ServerContext from '~/context/ServerContext';

const useServer = () => {
  const serverContext = React.useContext(ServerContext);
  if (!serverContext) {
    throw new Error('useServer must be used inside a ServerProvider');
  }

  return serverContext;
};

export default useServer;
