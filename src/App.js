import React, { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {
  Cart,
  Checkout,
  Footer,
  Header,
  HeaderTitle,
} from './components'
import ConfirmSale from './components/ConfirmSale/ConfirmSale'
import ScrollToTop from './components/ScrollToTop'
import RequirePatient from './components/RequirePatient'
import About from './pages/About'
import Home from './pages/Home/Home'
import Tienda from './pages/Tienda'
import Producto from './pages/Producto'
import Ingresar from './pages/Ingresar'
import CrearAcceso from './pages/CrearAcceso'
import Portal from './pages/Portal'
import PortalCategoria from './pages/PortalCategoria'
import Changes from './pages/changes'
import Contact from './pages/contact'
import Faq from './pages/faq'
import NotFound from './pages/notFound'
import Error from './pages/error'
import MercadoPagoReturn from './components/MercadoPagoReturn'
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
                <HeaderTitle /> <Outlet />
                <Footer />
              </div>
            }
          >
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='tienda' element={<Tienda />} />
            <Route path='producto/:productId' element={<Producto />} />
            <Route path='ingresar' element={<Ingresar />} />
            <Route path='crear-acceso' element={<CrearAcceso />} />
            <Route
              path='portal'
              element={
                <RequirePatient>
                  <Portal />
                </RequirePatient>
              }
            />
            <Route
              path='portal/categoria/:categoryId'
              element={
                <RequirePatient>
                  <PortalCategoria />
                </RequirePatient>
              }
            />
            <Route path='sobre-mi' element={<About />} />
            <Route path='cambios-reales' element={<Changes />} />
            <Route path='faq' element={<Faq />} />
            <Route path='contacto' element={<Contact />} />
            <Route path='carrito' element={<Cart />} />
            <Route path='checkout' element={<Checkout />}></Route>
            <Route path='checkout/confirm' element={<ConfirmSale />} />
            <Route
              path='checkout/confirm/:orderId'
              element={<OrderSuccess />}
            />
            {/* Rutas de retorno de Mercado Pago */}
            <Route path='procesoDePago/exitoso' element={<MercadoPagoReturn />} />
            <Route path='procesoDePago/fallido' element={<MercadoPagoReturn />} />
            <Route path='procesoDePago/pendiente' element={<MercadoPagoReturn />} />
          </Route>
          <Route path='*' element={<NotFound />} />
          <Route path='error' element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App