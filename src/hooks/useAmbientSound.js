import { useCallback, useEffect, useRef, useState } from 'react';
import { createAmbientEngine } from '../audio/ambientEngine';

/** Sound is always off on arrival and starts only from a direct click. */
export default function useAmbientSound() {
  const engine = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(async () => {
    engine.current ??= createAmbientEngine();
    if (enabled) {
      engine.current.stop();
      setEnabled(false);
    } else {
      setEnabled(await engine.current.start());
    }
  }, [enabled]);

  // fall silent while the tab is hidden, resume when it returns
  useEffect(() => {
    if (!enabled) return undefined;
    const onVisibility = () => (document.hidden ? engine.current.stop() : engine.current.start());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled]);

  useEffect(() => () => engine.current?.dispose(), []);

  return { enabled, toggle };
}
