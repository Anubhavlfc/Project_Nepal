import Journey from './components/Journey/Journey';
import About from './components/About/About';
import Navigation from './components/Navigation/Navigation';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Journey />
        <About />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
