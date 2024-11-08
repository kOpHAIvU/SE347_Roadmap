import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes, accountDataRoutes } from '~/routes'
import { MainScreenLayout, NotFoundLayout } from './components/Layout/index.js';

function App() {
   const renderRoute = (route) => {
      const Page = route.Component;
      const Layout = route.layout || MainScreenLayout;

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
               {accountDataRoutes.map(renderRoute)}
               
               {/* Thêm route cho trang không tìm thấy */}
               <Route
                  path="*"
                  element={
                     <NotFoundLayout>
                        <div>Page Not Found</div>
                     </NotFoundLayout>
                  }
               />
            </Routes>
         </div>
      </Router>
   );
}

export default App;
