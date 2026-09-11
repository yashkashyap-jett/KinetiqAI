import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#18181B',
          color: '#FAFAFA',
          border: '1px solid #27272A',
          borderRadius: '6px',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#22C55E', secondary: '#FAFAFA' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#FAFAFA' },
        },
      }}
    />
  );
}
