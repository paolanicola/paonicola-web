import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar, Products, SectionFooter, Footer, Header } from './components';
import './stylesheets/application.scss';

function App() {
  return (
    <Router>
      <div className='container'>
        <Header />
        <Routes>
          <Route path='/' element={<Products />} />
          <Route path='/carrito' />
          <Route path='/checkout' />
        </Routes>
        <SectionFooter />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
