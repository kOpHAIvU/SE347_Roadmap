import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '~/routes'
import { DefaultLayout } from './components/Layout/index.js';

function App() {
   const renderRoute = (route) => {
      const Page = route.Component;
      const Layout = route.layout || DefaultLayout;

      return (
         <Route
            key={route.path}
            path={route.path}
            element={
               <Layout>
                  <Page />
               </Layout>
            }
         />
      );
   }

   return (
      <Router>
         <div className="App">
            <Routes>
               {publicRoutes.map(renderRoute)}
               {privateRoutes.map(renderRoute)}
            </Routes>
         </div>
      </Router>
   );
}

export default App;
