import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio render failed', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#1a0000',
            color: '#D7E2EA',
            fontFamily: "'Kanit', sans-serif",
            textAlign: 'center',
          }}
        >
          <div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 8vw, 5rem)', fontWeight: 900, textTransform: 'uppercase' }}>
              Akash Pentakota
            </h1>
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>AI & ML Engineer Portfolio</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
