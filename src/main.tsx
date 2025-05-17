import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import Prism from 'prismjs';

if (typeof window !== 'undefined') {
  window.Prism = Prism;
}

if (typeof globalThis.Prism === 'undefined') {
  globalThis.Prism = Prism;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
