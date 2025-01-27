import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';

function RootRouter() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

export default RootRouter;
