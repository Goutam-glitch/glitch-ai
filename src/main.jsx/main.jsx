import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  state = { crashed: false };

  static getDerivedStateFromError() { return { crashed: true }; }

  componentDidCatch(error) { console.error('Glitch AI interface error:', error); }

  render() {
    if (this.state.crashed) return <main style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', gap: 12, padding: 24, background: '#090a0d', color: '#e9e9ed', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}><h1 style={{ margin: 0, fontSize: 24 }}>Glitch hit a snag.</h1><p style={{ margin: 0, color: '#9998a1' }}>Your chat is safe. Refresh the page to try again.</p><button onClick={() => window.location.reload()} style={{ justifySelf: 'center', padding: '9px 15px', border: 0, borderRadius: 7, background: '#eeecef', color: '#15151a', fontWeight: 600, cursor: 'pointer' }}>Refresh Glitch AI</button></main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>);

