import React, { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  Cart,
  Checkout,
  Footer,
  Header,
  HeaderTitle,
  MercadopagoSuccess,
  Products,
  SectionFooter,
} from './components'
import ConfirmSale from './components/ConfirmSale/ConfirmSale'
import MercadopagoFailed from './components/MercadopagoFailed'
import ScrollToTop from './components/ScrollToTop'
import About from './pages/About'
import Home from './pages/Home/Home'
import Changes from './pages/changes'
import Contact from './pages/contact'
import Faq from './pages/faq'
import NotFound from './pages/notFound'
import Error from './pages/error'
import './stylesheets/application.scss'
import { cartItemsExpired, cleanLocalStorage } from './utils/utils'
import OrderSuccess from './components/OrderSuccess'

function App() {
  useEffect(() => {
    if (cartItemsExpired()) {
      cleanLocalStorage()
    }
  }, [])

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
                <ToastContainer
                  position='bottom-right'
                  autoClose={1000}
                  pauseOnFocusLoss={false}
                  limit={3}
                />
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
            <Route path='mercadopago/succes' element={<MercadopagoSuccess />} />
            <Route path='mercadopago/failed' element={<MercadopagoFailed />} />
            <Route path='mercadopago/pending' element={<MercadopagoFailed />} />
          </Route>
          <Route
            path='checkout/confirm'
            element={
              <>
                <Header />
                <HeaderTitle customTitle='Compra finalizada' />
                <ConfirmSale />
                <Outlet /> <SectionFooter />
                <Footer />
              </>
            }
          />
          <Route
            path='checkout/confirm/:orderId'
            element={
              <>
                <Header />
                <HeaderTitle customTitle='Compra finalizada' />
                <OrderSuccess />
                <Outlet /> <SectionFooter />
                <Footer />
              </>
            }
          />
          <Route path='*' element={<NotFound />} />
          <Route path='error' element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
