"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastProvider } from "@/hooks/useToast";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
// import { ToastProvider } from "./hooks/useToast";
// import { ModalProvider } from "./hooks/useModal";
// import { AuthProvider, useAuth } from "./hooks/useAuth";

function Providers({ children }: any) {
  return (
    <ToastProvider>
      <CartProvider>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export { Providers };

function AppContent({ children }: any) {
  const queryClient = new QueryClient();
  const { authStateLoaded } = useAuth();

  if (!authStateLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
