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
import { Chip, Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Label, Output } from '@mui/icons-material';
import NavigacijaAdmin from '../NavigacijaAdmin';
import styled from '@emotion/styled';

const AzurirajSobu=()=>
{
    const [soba,setSoba]=useState({});
    const [value,setValue]=useState(0);
    const idSobe=localStorage.getItem('soba');
    useEffect(() => {
 
      console.log('Uso sam u fjuSobe');
    const response =  axios.get(`https://localhost:7068/Room/GetRoomsById/${idSobe}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      setSoba(response.data);
      setValue(1);
     
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      setValue(0);
    })
  
    },[]);

    const[kategorije,setKategorije]=useState([]);
    const[unos,setUnos]=useState('');
   const idHotela=localStorage.getItem('idHotela');
 const kategorijaPressHandler = (event) => {
   event.preventDefault();
   
   // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
  
   setKategorije((prevKategorije) => [...prevKategorije, unos]);
   
 }
 const tipSobe = [
   'SingleRoom',
   'DoubleRoom',
   'Suite',
   'DeluxeRoom',
   'FamilyRoom',
   'TwinRoom',
   'Studio',
   'Apartment',
   'Villa',
   'Bungalow',
   'Room for kids',
   'Additional beds',
   'For persons with dissabilities',
   'NoRestrictions food',
   'Vegeterian food',
   'Vegan food',
   'GlutenFree food',
   'Keto food',
   'LactoseFree food',
     'NutAllergy food',
     
     'Sport',
     'Swimming',
     'Fitness',
     'Hiking',
     'Sightseeing',
     'Shopping',
     'FineDining',
     'Nightlife',
     'CulturalTours',
     'HighFloor',
     'SeaView',
     'GardenView',
     'Poolside',
     'CityView',
     'QuietArea',
     'NearElevator',
     'NearRestaurant',
     'NearBeach',
     'PanoramicView',
     'Buisnies room',
     'Pet frendly',
     'Anniversary',
     'Birthday',
     'Honeymoon',
     'Wedding',
     'BusinessTrip',
     'FamilyTrip',
     'FestivalCelebration',
     'RomanticTrip'
 ];
 const [tip, setTip] = useState();
     
 const handleChangeTip = (event) => {
  // setTip(event.target.value);
   console.log(event.target.value);
   setUnos(event.target.value);
   
 };
 const  btnHandler=(event, element)=>
 {
   event.preventDefault();
  
  setKategorije(kategorije.filter(e=>e!==element));
 }
 const ListItem = styled('li')(({ theme }) => ({
   
 }));
     


    const okHandler=(event)=>{
        const d=event.target.value;
        setValue(1);
        navigate('/PregledSoba');
       }
       const uslugeSobe = [
        'Restaurant',
        'Pool',
        'Spa',
        'FitnessCenter',
        'Parking',
        'ConferenceRoom',
        'Bar',
        'RoomService',
        'Laundry',
        'ShuttleService',
        'BusinessCenter',
        'Concierge',
        'WiFi',
        'ChildCare',
        'Sauna',
        'Massage',
        'PetCare'
      ];
       const[unosU,setUnosU]=useState('');
       const[usluge,setUsluge]=useState([]);
       let servis=[]
       const uslugaPressHandler = (event) => {
         event.preventDefault();
         
         // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
        
         setUsluge((prevUsluge) => [...prevUsluge, unosU]);
         
       }
       const [tipU, setTipU] = useState();
 
       const handleChangeTipU = (event) => {
         // setTip(event.target.value);
          console.log(event.target.value);
          setUnosU(event.target.value);
          
        };  
        const  btnHandlerU=(event, element)=>
        {
          event.preventDefault();
         
         setUsluge(usluge.filter(e=>e!==element));
         
        }
       const navigate=useNavigate();

        const[broj,setBroj]=useState(0);const brojHandler=(event)=>{setBroj(event.target.value)};
        const[tip1,setTip1]=useState('');const tipHandler=(event)=>{setTip1(event.target.value)};
        const[status,setStatus]=useState(0);const statusHandler=(event)=>{setStatus(event.target.value)};
        const[cena,setCena]=useState(0);const cenaHandler=(event)=>{setCena(event.target.value)};
        const[kapacitet,setKapacitet]=useState(0);const kapacitetHandler=(event)=>{setKapacitet(event.target.value)};
        const azurirajSobuHandler=(event)=>
        {
          event.preventDefault();
          const room={
            id: soba.room.id,
            numberOfRoom:broj ,
            roomType: tip1,
            pricePerNight: cena,
            roomCapacity: kapacitet,
            roomStatus: status,
            hotel: idHotela
          };
          
          const services=usluge
        
         const  preferences=kategorije;
         const response =  axios.put(`https://localhost:7068/Room/UpdateRoom/${idSobe}`,
         {
          room:room,
          services:services,
          preferences:preferences
        },
         {
           headers:{
             //Authorization: `Bearer ${token}`
           }
         }).then(response=>{
           
           setValue(2);
           console.log(response.data);
         })
         .catch(error=>{
           console.log(error);
           setValue(0);
         })
        }
        
        
    return(
        <>
        <NavigacijaAdmin azur={3}/>
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
               Azuriraj sobu
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
              <Grid item xs={6}>
                        <Item>
                          <h1>
                                Broj sobe:{soba.room.numberOfRoom}
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
                            label="Novi broj sobe"
                            type="number"
                            id="minut"
                            autoComplete="minut"
                            onChange={brojHandler}
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                Cena nocenja:{soba.room.pricePerNight}$
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
                            label="Nova cena nocenja"
                            type="number"
                            id="minut"
                            autoComplete="minut"
                            onChange={cenaHandler}
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                               Kapacitet sobe:{soba.room.roomCapacity} osoba
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
                            label="Nova cena nocenja"
                            type="number"
                            id="minut"
                            autoComplete="minut"
                            onChange={kapacitetHandler}
                        />
              
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                Status sobe:{soba.room.roomStatus}
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
                            label="Novi status sobe"
                            type="text"
                            id="minut"
                            autoComplete="minut"
                            onChange={statusHandler}
                            
                        />
              
                        </Item>
                    </Grid>
                
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                Hotel vlasnik sobe-ID:
                            </h1>
                        </Item>
                    </Grid>
                    
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                {soba.room.hotel}
                            </h1>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                          <h1>
                                Tip sobe:{soba.room.roomType}
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
                            label="Novi tip sobe"
                            type="text"
                            id="minut"
                            autoComplete="minut"
                            onChange={tipHandler}
                        />
                        </Item>
                    </Grid>
                    <Grid xs={2}>
                      <Item><h1>Kategorije:</h1></Item>
                    </Grid>
                    <Grid xs={10}>
                    <Item>
                      {soba.preferences.map(element => (
                        <h3 key={element.vrstaKriterijuma}>{element.vrstaKriterijuma+"("+element.cena+"$,) "}</h3>
                      ))}
                    </Item>
                  </Grid>
                  <Grid xs={2}>
                      <Item><h1>Usluge:</h1></Item>
                    </Grid>
                    <Grid xs={10}>
                    <Item>
                      {soba.services.map(element => (
                        <h3 key={element.vrstaUsluge}>{element.vrstaUsluge+"("+element.cena+"$, ) "}</h3>
                      ))}
                    </Item>
                  </Grid>
                  <Grid xs={12}>
            <Item>
              <h1>Unesite nove kategorije soba po kojima zelite prepurke hotela-prethodne kategorije ce biti obrisane</h1>
            </Item>
          </Grid>
        <Grid xs={10}>
              <Item>
                
              <FormControl variant="filled" sx={{width:'400px'}} >
                      <InputLabel id="demo-simple-select-filled-label">Izaberite kategorije apartmana koji preferirate</InputLabel>
                      <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={tip}
                      onChange={handleChangeTip}
                      >
                      <MenuItem>
                      <em>None</em>
                      </MenuItem>
                      {tipSobe.map(element=>
                          <MenuItem value={element}>{element}</MenuItem>


                      )}
                      </Select>
                  </FormControl>
                  </Item>
          
          </Grid>
          <Grid xs={2}>
            <Item>
              <Button variant='contained' onClick={kategorijaPressHandler}>Unesi kategoriju</Button>
            </Item>
          </Grid>
        <Grid xs={12}>
          <Item>
                {kategorije.map((data,ind) => {
        
        return (
          <li key={ind}>
            <Chip
              
              label={data}
              onDelete={(event) => btnHandler(event,data)}
            />
          </li>
        );
      })}
      </Item>
          </Grid>


          <Grid xs={12}>
            <Item>
              <h1>Unesite nove usluge soba prethodne kategorije ce biti obrisane</h1>
            </Item>
          </Grid>
<Grid xs={12}>
              <Item>
              <FormControl variant="filled" sx={{marginTop:'14px',width:'300px',marginLeft:'0px'}} >
                      <InputLabel id="demo-simple-select-filled-label">Izaberite usluge koje soba nudi</InputLabel>
                      <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={tipU}
                      onChange={handleChangeTipU}
                     
                      >
                      <MenuItem>
                      <em>None</em>
                      </MenuItem>
                      {uslugeSobe.map(element=>
                          <MenuItem value={element}>{element}</MenuItem>


                      )}
                      </Select>
                  </FormControl>
                  </Item>
          
          </Grid>
          <Grid xs={6}>
            <Item>
            <Button variant='contained' onClick={uslugaPressHandler} sx={{marginTop:'28px'}}>Unesi uslugu</Button>
                  
            </Item>
          </Grid>
          <Grid xs={12}>
            <Item>
            {usluge.map((data,ind) => {
        

        return (
          <li key={ind}>
            <Chip
              
              label={data}
              onDelete={(event) => btnHandlerU(event,data)}
            />
          </li>
        );
      })}
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
                  onClick={azurirajSobuHandler}
                >
                  Azuriraj sobu
                </Button>
               
              </Box>
            </Box>
            </Paper>
          </Container>
        </Grid>)}
        </>
    );

}
export default AzurirajSobu;