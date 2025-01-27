import { DependencyList, useEffect, useRef } from 'react';

function useDidUpdate(callback: () => void, deps?: DependencyList) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useDidUpdate;
