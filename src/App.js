import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { NavBar, Products, SectionFooter, Footer, Header, HeaderTitle, Cart, Checkout } from './components';
import About from './pages/About';
import Changes from './pages/changes';
import Faq from './pages/faq';
import Contact from './pages/contact';
import './stylesheets/application.scss';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home/Home';
import ProductPage from './pages/products/ProductPage';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/notFound';
import ConfirmSale from './components/ConfirmSale/ConfirmSale';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className='container'>
        <Routes>
          <Route
            path='/'
            element={
              <div>
                <Header />
                <ToastContainer autoClose={900} pauseOnFocusLoss={false} draggablePercent={30} limit={2} />
                <HeaderTitle /> <Outlet /> <SectionFooter />
                <Footer />
              </div>
            }
          >
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='tienda' element={<Products />} />
            <Route path='sobre-mi' element={<About />} />
            <Route path='cambios-reales' element={<Changes />} />
            <Route path='faq' element={<Faq />} />
            <Route path='contacto' element={<Contact />} />
            <Route path='carrito' element={<Cart />} />
            <Route path='checkout' element={<Checkout />}></Route>
            <Route path='checkout/confirm' element={<ConfirmSale />} />
            <Route exact path='producto/:id' element={<ProductPage />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
