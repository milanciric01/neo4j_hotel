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
import { Chip, Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Label, Output } from '@mui/icons-material';
import NavigacijaAdmin from '../NavigacijaAdmin';
import styled from '@emotion/styled';
function DodajSobu()
{
    const navigate = useNavigate();
    const [value,setValue]=useState(1);
   const[status,setStatus]=useState('');
   const statusHandler=(event)=>{setStatus(event.target.value)};
   const[cena,setCena]=useState(0);
   const cenaHandler=(event)=>{setCena(event.target.value)};
   const[kapacitet,setKapacitet]=useState(0);
   const kapacitetHandler=(event)=>{setKapacitet(event.target.value)};
   const[broj,setBroj]=useState(0);
   const brojHandler=(event)=>{setBroj(event.target.value)};
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
    'Spa',
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
        const[kojiTip,setKojiTip]=useState('');
        const kojiTipHandler=(event)=>{setKojiTip(event.target.value)};
        const dodajSobuHandler=(event)=>
        {
          event.preventDefault();
          const room={
            id: 41,
            numberOfRoom:broj ,
            roomType: kojiTip,
            pricePerNight: cena,
            roomCapacity: kapacitet,
            roomStatus: status,
            hotel: idHotela
          };
          
          const services=usluge
        
         const  preferences=kategorije;
         const response =  axios.post(`https://localhost:7068/Room/AddRoomToHotel/${idHotela}`,
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

            <NavigacijaAdmin azur={2}/>
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
            <Paper elevation={24} sx={{width:'1000px',marginLeft:'-300px'}}>
            <Box
              sx={{  
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
               
              <Typography component="h1" variant="h3">
               Dodaj sobu
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
                            label="Unesite status sobe"
                            type="text"
                            id="gost"
                            autoComplete="Gost"
                            onChange={statusHandler}
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
                            label="Unesite tip sobe"
                            type="text"
                            id="gost"
                            autoComplete="Gost"
                            onChange={kojiTipHandler}
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
                            label="Unesite cenu po nocenju u sobi($)"
                            type="number"
                            id="gost"
                            autoComplete="Gost"
                         onChange={cenaHandler}
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
                            label="Unesite kapacitet sobe(broj osoba)"
                            type="number"
                            id="gost"
                            autoComplete="Gost"
                            onChange={kapacitetHandler}
                         
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
                            label="Unesite broj sobe"
                            type="number"
                            id="gost"
                            autoComplete="Gost"
                            onChange={brojHandler}
                         
                            />
                        </Item>
                    </Grid>
                    <Grid xs={12}>
            <Item>
              <Button variant='contained' onClick={kategorijaPressHandler}>Unesi kategoriju</Button>
            </Item>
          </Grid>
          <Grid xs={6}>
              <Item>
              <FormControl variant="filled" sx={{width:'200px',marginTop:'14px'}} >
                      <InputLabel id="demo-simple-select-filled-label">Izaberite kategorije kojima ovaj apartman pripada</InputLabel>
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
          
                {kategorije.map((data,ind) => {
        

        return (
          <ListItem key={ind}>
            <Chip
              
              label={data}
              onDelete={(event) => btnHandler(event,data)}
            />
          </ListItem>
        );
      })}




      
<Grid xs={12}>
              <Item>
              <FormControl variant="filled" sx={{marginTop:'14px',width:'900px',marginLeft:'0px'}} >
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
                  onClick={dodajSobuHandler}
                >
                  Dodaj sobu
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
   
    
export default DodajSobu;