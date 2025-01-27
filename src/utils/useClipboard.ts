import { useEffect, useState } from 'react';

function useClipboard() {
  const [available, setAvailable] = useState<boolean>();
  useEffect(() => {
    // FIXME: kangseongofdk, 타이핑 버그 있음
    // https://github.com/microsoft/TypeScript/issues/33923
    navigator.permissions.query({ name: 'clipboard-write' as any }).then(result => {
      setAvailable(result.state === 'granted' || result.state === 'prompt');
    });
  }, []);

  return available;
}

export default useClipboard;
