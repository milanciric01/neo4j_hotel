import { Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import Item from '@mui/material/ListItem'
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Collapse, FormControl, InputLabel, MenuItem, Paper, Rating, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Label, Output } from '@mui/icons-material';
import NavigacijaAdmin from '../NavigacijaAdmin';

const AzurirajHotel=()=>
{
    const [hotel,setHotel]=useState([]);
    const idH=localStorage.getItem('idHotela');
    const id=localStorage.getItem('id');
    useEffect(() => {
 
        console.log('Uso sam u fju1');
      const response =  axios.get(`https://localhost:7068/Hotel/GetHotelWithoutRooms/${idH}`,
      {
        headers:{
          //Authorization: `Bearer ${token}`
        }
      }).then(response=>{
        setHotel(response.data);
        setValue(1);
        console.log(response.data);
      })
      .catch(error=>{
        console.log(error);
        setValue(0);
      })
      
      },[])
    const [value,setValue]=useState(1);
    const [ocena,setOcena]=useState(hotel.ocena);
   
    const [brojSoba,setBrojSoba]=useState(0);
    const brojSobaHandler=(event)=>{setBrojSoba(event.target.value)};
    const navigate=useNavigate();
    const [opis,setOpis]=useState('');
    const opisHandler=(event)=>{setOpis(event.target.value)};
    const [cena,setCena]=useState(0);
    const cenaHandler=(event)=>{setCena(event.target.value)};
    
    const okHandler=(event)=>{
        const d=event.target.value;
        setValue(1);
       }
       const[idA,setIdA]=useState(id);
       const idHandler=(event)=>{setIdA(event.target.value)};
       const azurirajHotelHandler=(event)=>
       {
        event.preventDefault();
        const response =  axios.put(`https://localhost:7068/Hotel/UpdateHotel/${idH}`,
        {
            id: hotel.id,
            name: hotel.name,
            numberORooms: brojSoba,
            country: hotel.country,
            location: hotel.location,
            administrator: hotel.administrator,
            opisHotela: opis,
            cenaZa7Dana: cena,
            ocena: ocena
          
        },
        {
          headers:{
            //Authorization: `Bearer ${token}`
          }
        }).then(response=>{
          
          setValue(2);
          navigate('/DetaljiHotela');
          console.log(response.data);
        })
        .catch(error=>{
          console.log(error);
          setValue(0);
        })
       }
    return(
        <>
        <NavigacijaAdmin azur={1}/>
        {value==2&&(
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
        {value===1&&(<Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Container component="main" maxWidth="xs" alignItems="center" justifyContent="center"  >
            <Paper elevation={24} sx={{width:'1300px',marginLeft:'-400px'}}>
            <Box
              sx={{  
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
               
              <Typography component="h1" variant="h3">
               Azuriraj hotel
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                        <Item>
                          <h1>
                                {hotel.name}
                            </h1>
                        </Item>
                    </Grid>
             
                    <Grid item xs={12}>
                        <Item>
                          <h1>
                                {hotel.country}
                            </h1>
                        </Item>
                    </Grid>
                
                    <Grid item xs={12}>
                        <Item>
                          <h1>
                                {hotel.location}
                            </h1>
                        </Item>
                    </Grid>
                    
                    
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                {hotel.numberORooms}
                            </h1>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                      
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="minut"
                            label="Novi broj soba"
                            type="number"
                            id="minut"
                            autoComplete="minut"
                            onChange={brojSobaHandler}
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>

                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                      
                        <TextField
                        id="standard-multiline-static"
                        label="Unesite novi opis hotela"
                        multiline
                        rows={10}
                        defaultValue={hotel.opisHotela}
                        variant="standard"
                        sx={{width:'700px'}}
                        onChange={opisHandler}
                         />
              
                        </Item>
                    </Grid>
                    <Grid xs={6}>
                        <Item>
                        <h1>Trentuna Ocena hotela:</h1>
                        <h1>{hotel.ocena}</h1>
                    
                    </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                      
                        <Rating
                        name="simple-controlled"
                        value={ocena}
                        onChange={(event, newValue) => {
                        setOcena(newValue);
                        }}
                    />
              
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                {hotel.cenaZa7Dana}$
                            </h1>
                        </Item>
                    </Grid>
                 
                          <Grid item xs={6}>
                        <Item>
                       
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="minut"
                            label="Unesite novu cenu za 7 dana"
                            type="number"
                            id="minut"
                            autoComplete="minut"
                            onChange={cenaHandler}
                            
                        />
              
                        </Item>
                    </Grid>
                   
                 
                   
                  
              </Grid>
              
                
               
               <div>
    
               </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={azurirajHotelHandler}
                >
                  Azuriraj hotel
                </Button>
               
              </Box>
            </Box>
            </Paper>
          </Container>
        </Grid>)}
        </>
    );

}
export default AzurirajHotel;