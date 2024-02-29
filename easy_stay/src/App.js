import logo from './logo.svg';
import './App.css';
import Login from './Komponente/RegLog/Login';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registracija from './Komponente/RegLog/Register';
import Profil from './Komponente/Gost/Profil';
import SobaHotela from './Komponente/Hoteli/SobaHotela';
import Sobe from './Komponente/Hoteli/Sobe';
import ProfilSobe from './Komponente/Hoteli/ProfilSobe';
import RezervisaneSobe from './Komponente/Gost/RezervisaneSobe';
import OdabraneUsluge from './Komponente/Gost/OdabraneUsluge';
import Pregled from './Komponente/Admin/Pregled';
import DetaljiHotela from './Komponente/Admin/DetaljiHotela';
import PregledSoba from './Komponente/Admin/PregledSoba';
import DetaljiSobe from './Komponente/Admin/DetaljiSobe';
import DodajHotel from './Komponente/Admin/DodavanjeAzuriranje/DodajHotel';
import AzurirajHotel from './Komponente/Admin/DodavanjeAzuriranje/AzurirajHotel';
import DodajSobu from './Komponente/Admin/DodavanjeAzuriranje/DodajSobu';
import AzurirajSobu from './Komponente/Admin/DodavanjeAzuriranje/AzurirajSobu';

function App() {
  
  return (
    <main className="App">
       <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Registracija" element={<Registracija />} />
          <Route path="/Profil" element={<Profil />} />
          <Route path="/SobaHotela" element={<SobaHotela />} />
          <Route path="/Sobe" element={<Sobe />} />
          <Route path="/ProfilSobe" element={<ProfilSobe />} />
          <Route path="/RezervisaneSobe" element={<RezervisaneSobe />} />
          <Route path="/OdabraneUsluge" element={<OdabraneUsluge />} />
          <Route path="/Pregled" element={<Pregled />} />
          <Route path="/DetaljiHotela" element={<DetaljiHotela />} />
          <Route path="/PregledSoba" element={<PregledSoba />} />
          <Route path="/DetaljiSobe" element={<DetaljiSobe />} />
          <Route path="/DodajHotel" element={<DodajHotel />} />
          <Route path="/AzurirajHotel" element={<AzurirajHotel />} />
          <Route path="/DodajSobu" element={<DodajSobu />} />
          <Route path="/AzurirajSobu" element={<AzurirajSobu />} />
    
        </Routes>
      </Router>
     
    
    </main>
  );
  
}

export default App;
