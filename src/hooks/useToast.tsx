import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IToastContext {
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  toastInfo: (message: string) => void;
  toastWarning: (message: string) => void;
  clearAllToasts: () => void;
}

export const ToastContext = createContext<IToastContext | null>(null);

export const useToast = (): IToastContext => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export const ToastProvider: any = ({ children }  : any) => {
  const toastSuccess = (message: string) => {
    toast(message, { type: toast.TYPE.SUCCESS, toastId: 'success' });
  };

  const toastError = (message: string) => {
    toast(message, { type: toast.TYPE.ERROR,  toastId: 'error' }
      );
  };

  const toastInfo = (message: string) => {
    toast(message, { type: toast.TYPE.INFO, toastId: 'info' });
  };

  const toastWarning = (message: string) => {
    toast(message, { type: toast.TYPE.WARNING, toastId: 'warning' });
  };

  const clearAllToasts = () => {
    toast.dismiss();
  };

  const toastFunctions: IToastContext = {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={toastFunctions}>
        <ToastContainer 
          position="top-center"
          autoClose={1200}
          // autoClose={false}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover = {false}
          // theme="light"
          limit={1}
        />
      {children}
    </ToastContext.Provider>
  );
}