import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

import Navigacija from './Navigacija';

function createData(pos, ou, w, d, l, gf,ga,gd,pts) {
    return { pos, ou, w, d, l, gf,ga,gd,pts };
  }
  
  
  
  const RezervisaneSobe=()=>{
  const [klubovi,setKlubovi]=useState([]);
  const [value,setValue]=useState(0);
  const email=localStorage.getItem('email');
  const id=localStorage.getItem('id');
  const navigate = useNavigate(); 
  const[osvezi,setOsvezi]=useState(false);
  const btnHandler=(event,s)=>{
    event.preventDefault();
    const response =  axios.post(`https://localhost:7068/Guest/CancelReservation/${id}/${s}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
     if(osvezi===true)
     {
      setOsvezi(false);
     }
     else
     {
      setOsvezi(true);
     }
      setValue(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const [soba,setSoba]=useState([]);
  useEffect(() => {
 
    console.log('Uso sam u fju');
  const response =  axios.get(`https://localhost:7068/Guest/AllReservatedRoom/${id}`,
  {
    headers:{
      //Authorization: `Bearer ${token}`
    }
  }).then(response=>{
    const uniqueArray = response.data.filter((obj, index, self) =>
          index === self.findIndex((o) => ((o.name === obj.name)&&(o.numberOfRoom===obj.numberOfRoom)))
    );
    setSoba(uniqueArray);
    setValue(1);
    console.log(response.data);
  })
  .catch(error=>{
    console.log(error);
  })
  }, [osvezi]);

    return (
    
        <>
           <Navigacija/>
             <TableContainer component={Paper} sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'80px'}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">  
            <TableHead sx={{background: '#5cc4b8'}}>
            <TableCell sx={{ fontFamily: 'cursive',textAlign:'center',color:'white' }}> </TableCell>
              <TableCell sx={{ fontFamily: 'cursive',textAlign:'center',color:'white' }}>Broj sobe</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white'}}>Cena nocenja u $</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white' }}>Kapacitet sobe</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white' }}>Status sobe</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white'}}>Tip sobe</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white'}}>ID Hotela</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white'}}>Rezervacija</TableCell>
         
            </TableHead>
            <TableBody sx={{background:'#07808f'}}>
              {soba.map((element,ind) =>

                <TableRow key={element.Id}>
                    <TableCell sx={{  fontFamily: 'cursive', textAlign:'center',color:'white' }}>{ind+1}</TableCell>
                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.numberOfRoom}</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.pricePerNight}</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.roomCapacity}</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.roomStatus}</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.roomType}</TableCell>
                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.hotel}</TableCell>
                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',fontWeight: 'bold',color:'#92c4d1' }}><Button sx={{color:'white',fontFamily:'cursive'}}   onClick={(event) => btnHandler(event, element.id)} >Otkazi rezervaciju</Button></TableCell>
               
                </TableRow>

              )}

            </TableBody>

          </Table>
          </TableContainer>

        </>
    );
}
export default RezervisaneSobe;