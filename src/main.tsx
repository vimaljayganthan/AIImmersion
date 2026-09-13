import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled Application Exception:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', padding: '20px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '24px' }}>
              ⚙️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
              Resetting Workspace Session
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '24px' }}>
              A browser storage anomaly was detected. Click below to refresh your session with clean data.
            </p>
            <button
              onClick={this.handleReset}
              style={{ width: '100%', padding: '12px 24px', backgroundColor: '#38BDF8', color: '#FFFFFF', fontWeight: '600', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              Reload DriveIQ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
