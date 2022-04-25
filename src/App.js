import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { NavBar, Products, SectionFooter, Footer, Header, HeaderTitle, Cart, Checkout } from './components';
import About from './pages/About';
import Changes from './pages/changes';
import Faq from './pages/faq';
import Contact from './pages/contact';
import './stylesheets/application.scss';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className='container'>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <div>
                <Header />
                <HeaderTitle /> <Outlet /> <SectionFooter />
                <Footer />
              </div>
            }
          >
            <Route path='home' element={<Home />} />
            <Route exact path='tienda' element={<Products />} />
            <Route path='sobre-mi' element={<About />} />
            <Route path='cambios-reales' element={<Changes />} />
            <Route path='faq' element={<Faq />} />
            <Route path='contacto' element={<Contact />} />
            <Route path='carrito' element={<Cart />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='*' element={<Navigate replace to='/home' />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
