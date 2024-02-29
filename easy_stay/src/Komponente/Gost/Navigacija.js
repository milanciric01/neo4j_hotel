import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import HomeIcon from '@mui/icons-material/Home';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from "react-router-dom";
const Navigacija=()=>
{
    const navigate = useNavigate(); 
    const homeHandler=(event)=>
    {
        event.preventDefault();
        navigate('/Profil');
    }
    const rezervacijaHandler=(event)=>
    {
        event.preventDefault();
        navigate('/RezervisaneSobe');
    }
    const uslugeHandler=(event)=>
    {
        event.preventDefault();
        navigate('/OdabraneUsluge');
    }
    const odjavaHandler=(event)=>
    {
        event.preventDefault();
        navigate('/');
    }
    return (
        
        <BottomNavigation 
        showLabels
        sx={{marginLeft:'0px',backgroundColor:'#e1f7f4'}}
        
      >
        <BottomNavigationAction label="Rezervisane sobe" icon={<ArchiveIcon />}sx={{marginLeft:'380px'}} onClick={rezervacijaHandler}/>
        <BottomNavigationAction label="Pocetna" icon={<HomeIcon />} sx={{marginLeft:'30px'}} onClick={homeHandler}/>
        <BottomNavigationAction label="Odabrane usluge" icon={<FlashAutoIcon />}sx={{marginLeft:'30px'}} onClick={uslugeHandler}/>
        <BottomNavigationAction label="Odjavi se" icon={<LogoutIcon />}sx={{marginRight:'370px'}} onClick={odjavaHandler}/>
      </BottomNavigation>
      
    );

}
export default Navigacija;