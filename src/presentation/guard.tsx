import * as React from 'react';
import { useLocation, Navigate } from "react-router-dom";

import { ContextStoreModel, contextStore } from '@presentation/contextStore';

export function Guard({ children }: { children: JSX.Element }) {
  let location = useLocation();
  
  const context:ContextStoreModel = contextStore();

  if (!context.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return children;
  }
}