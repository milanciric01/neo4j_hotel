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
  
  
  
  const OdabraneUsluge=()=>{
  const [klubovi,setKlubovi]=useState([]);
  const [value,setValue]=useState(0);
  const email=localStorage.getItem('email');
  const osoba=localStorage.getItem('id');
  const navigate = useNavigate(); 
  const btnHandler=(event,s)=>{
    event.preventDefault();
    const response =  axios.post(`https://localhost:7068/Guest/RemoveService/${osoba}`,
    {
      naziv:s
    },
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      
      setValue(1);
      if(osvezi===true)
      {
        setOsvezi(false);
      }
      else{
        setOsvezi(true);
      }
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const[usluge,setUsluge]=useState([]);
  const[osvezi,setOsvezi]=useState(false);
  useEffect(() => {
 
    console.log('Uso sam u fju');
    console.log('Uso sam u fju');
    const response =  axios.get(`https://localhost:7068/Guest/AllServices/${osoba}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      setUsluge(response.data);
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
            <TableCell sx={{ fontFamily: 'cursive',textAlign:'center',color:'white' }}>Naziv usluge </TableCell>
              <TableCell sx={{ fontFamily: 'cursive',textAlign:'center',color:'white' }}>Cena usluge</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white'}}>Broj sobe</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white' }}>Naziv hotela</TableCell>
              <TableCell sx={{ fontFamily: 'cursive', textAlign:'center',color:'white' }}>Otkazi uslugu</TableCell>
           
         
            </TableHead>
            <TableBody sx={{background:'#07808f'}}>
              {usluge.map((element,ind) =>

                <TableRow key={element.Id}>
                    <TableCell sx={{  fontFamily: 'cursive', textAlign:'center',color:'white' }}>{ind+1}</TableCell>
                    <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.name}</TableCell>
                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.price}$</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.numberOfRoom}</TableCell>

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',color:'white' }}>{element.hotel}</TableCell>

                  

                  <TableCell sx={{  textAlign:'center', fontFamily: 'cursive',fontWeight: 'bold',color:'#92c4d1' }}><Button sx={{color:'white',fontFamily:'cursive'}}   onClick={(event) => btnHandler(event, element.name)} >Otkazi uslugu</Button></TableCell>
               
                </TableRow>

              )}

            </TableBody>

          </Table>
          </TableContainer>

        </>
    );
}
export default OdabraneUsluge;