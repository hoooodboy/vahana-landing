import { useContext } from 'react';

import { FrismAdminTheme } from './normal';
import { ThemeContext } from './themedStyledComponents';

export default function useTheme() {
  return useContext<FrismAdminTheme>(ThemeContext);
}
