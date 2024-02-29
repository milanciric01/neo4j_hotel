import { BottomNavigation, BottomNavigationAction, Button, Paper, Typography } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from "react-router-dom";
import { PropaneSharp } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
const NavigacijaAdmin=(props)=>
{
    const email=localStorage.getItem('email');
    const navigate = useNavigate(); 
    const[value,setValue]=useState(1);
    const dodajHandler=(event)=>
    {
        event.preventDefault();
        navigate('/DodajHotel');
    }
    const dodajSobuHandler=(event)=>
    {
        event.preventDefault();
        navigate('/DodajSobu');
    }
    const azurirajHandler=(event)=>
    {
        event.preventDefault();
        navigate('/AzurirajHotel');
    }
    const azurirajSobuHandler=(event)=>
    {
        event.preventDefault();
        navigate('/AzurirajSobu');
    }
    let idH;
    if(props.azur===1)
    {
        idH=localStorage.getItem('idHotela');
    }
    const obrisiHandler=(event)=>
    {
        event.preventDefault();
        const response =  axios.delete(`https://localhost:7068/Hotel/DeleteHotel/${idH}`,
        {
          headers:{
            //Authorization: `Bearer ${token}`
          }
        }).then(response=>{
          
          setValue(0);
          
          console.log(response.data);
        })
        .catch(error=>{
          console.log(error);
          setValue(0);
        })
       
    }
   let idR;
    if(props.azur===3)
   {
      idR=localStorage.getItem('soba');
   }
    const obrisiHandlerSoba=(event)=>
    {
        event.preventDefault();
        const response =  axios.delete(`https://localhost:7068/Room/DeleteRoom/${idR}`,
        {
          headers:{
            //Authorization: `Bearer ${token}`
          }
        }).then(response=>{
          
          setValue(0);
          
          console.log(response.data);
        })
        .catch(error=>{
          console.log(error);
          setValue(0);
        })
       
    }
    const odjavaHandler=(event)=>
    {
        event.preventDefault();
        navigate('/');
    }
    const okHandler=(event)=>
    {
        event.preventDefault();
        setValue(1);
        navigate('/Pregled');
    }
    return (
        <>
       
        {value===1&&(<BottomNavigation 
        showLabels
        sx={{marginLeft:'0px',backgroundColor:'#e1f7f4'}}
        
      >
        {(props.azur===1||props.azur===0)&&(<BottomNavigationAction label="Dodaj hotel" icon={<AddIcon />}sx={{marginLeft:'380px'}} onClick={dodajHandler}/>)}
        {props.azur===1&&(<BottomNavigationAction label="Azuriraj podatke o hotelu" icon={<UpdateIcon />} sx={{marginLeft:'30px'}} onClick={azurirajHandler}/>)}
        {props.azur===1&&(<BottomNavigationAction label="Obrisi hotel" icon={<DeleteIcon />}sx={{marginLeft:'30px'}} onClick={obrisiHandler}/>)}
        {(props.azur===3||props.azur===2)&&(<BottomNavigationAction label="Dodaj sobu" icon={<AddIcon />}sx={{marginLeft:'380px'}} onClick={dodajSobuHandler}/>)}
        {props.azur===3&&(<BottomNavigationAction label="Azuriraj podatke o sobi" icon={<UpdateIcon />} sx={{marginLeft:'30px'}} onClick={azurirajSobuHandler}/>)}
        {props.azur===3&&(<BottomNavigationAction label="Iskljci sobu" icon={<DeleteIcon />}sx={{marginLeft:'30px'}} onClick={obrisiHandlerSoba}/>)}
        <BottomNavigationAction label="Odjavi se" icon={<LogoutIcon />}sx={{marginRight:'370px'}} onClick={odjavaHandler}/>
      </BottomNavigation>)}
      {value===0&&(
        <Paper elevation={24}>
        <Typography>
            <h1>
                Uspesno obavljena funkcija
            </h1>
        </Typography>
        <Button onClick={okHandler}>
            OK
        </Button>
    </Paper>
      )}
      </>
    );

}
export default NavigacijaAdmin;