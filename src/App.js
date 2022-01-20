import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar, Products, SectionFooter, Footer, Header, HeaderTitle, Cart, Checkout } from './components';
import About from './pages/About';
import Changes from './pages/changes';
import Faq from './pages/faq';
import Contact from './pages/contact';
import './stylesheets/application.scss';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className='container'>
        <Header />
        <HeaderTitle />
        <Routes>
          <Route exact path='/' element={<Products />} />
          <Route path='/about' element={<About />} />
          <Route path='/changes' element={<Changes />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
        <SectionFooter />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
