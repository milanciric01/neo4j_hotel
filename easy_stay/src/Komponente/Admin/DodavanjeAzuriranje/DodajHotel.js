import { Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
function DodajHotel()
{
    const navigate = useNavigate();
    const [value,setValue]=useState(1);
    const [ocena,setOcena]=useState(0);

    const [naziv,setNaziv]=useState(0);
    const nazivHandler=(event)=>{setNaziv(event.target.value)};
    const [brojSoba,setBrojSoba]=useState(0);
    const brojSobaHandler=(event)=>{setBrojSoba(event.target.value)};
    const [zemlja,setZemlja]=useState('');
    const zemljaHandler=(event)=>{setZemlja(event.target.value)};
    const [adresa,setAdresa]=useState('');
    const adresaHandler=(event)=>{setAdresa(event.target.value)};
    const [opis,setOpis]=useState('');
    const opisHandler=(event)=>{setOpis(event.target.value)};
    const [cena,setCena]=useState(0);
    const cenaHandler=(event)=>{setCena(event.target.value)};
    
    
    const id=localStorage.getItem('id');
    const okHandler=(event)=>{
        const d=event.target.value;
        setValue(1);
       }
       const dodajHandler=(event)=>
       {
        event.preventDefault();
        const response =  axios.post(`https://localhost:7068/Hotel/AddHotel`,
        {
            id: 200,
            name: naziv,
            numberORooms: brojSoba,
            country: zemlja,
            location: adresa,
            administrator: id,
            opisHotela: opis,
            cenaZa7Dana: cena,
            ocena: ocena
                    },
        {
          headers:{
            //Authorization: `Bearer ${token}`
          }
        }).then(response=>{
          
          setValue(4);
          console.log(response.data);
        })
        .catch(error=>{
          console.log(error);
          setValue(0);
        })
       }
          return(
            <>
            <NavigacijaAdmin azur={0}/>
            {value===1&&(<Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Container component="main" maxWidth="xs" alignItems="center" justifyContent="center"  >
            <Paper elevation={24}>
            <Box
              sx={{  
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
               
              <Typography component="h1" variant="h3">
               Dodaj hotel
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                        <Item>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="gostojuca"
                            label="Naziv hotela"
                            type="text"
                            id="gost"
                            autoComplete="Gost"
                            onChange={nazivHandler}
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="gostojuca"
                            label="Broj soba koje hotel sadrzi"
                            type="number"
                            id="gost"
                            autoComplete="Gost"
                            onChange={brojSobaHandler}
                           
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="datum"
                            type="text"
                            label="Drzava u kojoj se nalazi"
                            id="datum"
                            autoComplete="datum"
                            onChange={zemljaHandler}
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="minut"
                            label="Adresa hotela(ulica,broj,grad)"
                            type="text"
                            id="minut"
                            autoComplete="minut"
                            onChange={adresaHandler}
                            
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <h3>
                               ID administratora ovog hotela: 
                            </h3>
                            <h1>
                            {id}
                            </h1>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                      
                        <TextField
                        id="standard-multiline-static"
                        label="Unesite  opis hotela"
                        multiline
                        rows={10}
                        defaultValue="Dobar hotel"
                        variant="standard"
                        sx={{width:'370px'}}
                        onChange={opisHandler}
                         />
              
                        </Item>
                    </Grid>
                    <Grid xs={12}>
                        <Item>
                        <Typography component="legend">Ocena</Typography>
                    <Rating
                        name="simple-controlled"
                        value={ocena}
                        onChange={(event, newValue) => {
                        setOcena(newValue);
                        }}
                    />
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="minut"
                            label="Cena boravka za 7 dana u $"
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
                  onClick={dodajHandler}
                >
                  Dodaj hotel
                </Button>
               
              </Box>
            </Box>
            </Paper>
          </Container>
        </Grid>)}
        {value==4&&(
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
   
    
export default DodajHotel;