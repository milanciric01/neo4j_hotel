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
import { Chip, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
//import ChipInput from "material-ui-chip-input";
import axios from 'axios';
import styled from '@emotion/styled';
function Registracija()
{
    const navigate = useNavigate();
    const [mejl, setMejl] = useState('');
    const [sifra,setSifra]=useState('');
    const[ime,setIme]=useState('');
    const[prezime,setPrezime]=useState('');
    const [potvrda,setPotvrda]=useState('');
    const [telefon,setTelefon]=useState('');
    const[kategorije,setKategorije]=useState([]);
    
    const registracijaHandler=(event)=>
    {
        event.preventDefault();
        const guest= {
          id:30,
          firstName: ime,
          lastName: prezime,
          phoneNumber: telefon,
          email: mejl,
          password: sifra,
          confirmedPassword: potvrda
        };
        
        const response = axios.post(
          `https://localhost:7068/Guest/RegisterUser`,
          {
            guest:guest,
            preferences:kategorije
          },
          {
            headers: {
              // Ovde možete dodati header informacije ako su potrebne
              // Authorization: `Bearer ${token}`
            },
          }
        )
          .then((response) => {
            // Obrada uspešnog odgovora
            localStorage.setItem('ime',ime);
            localStorage.setItem('prezime',prezime);
            localStorage.setItem('email', mejl);
            localStorage.setItem('password', sifra);
            
            navigate('/');
          })
          .catch((error) => {
            // Obrada greške
            console.log(error);
            
          });
        
        
        


    }
    const linkHandler=()=>
    {
        navigate('/');
    }
    const imeHandler=(event)=>{
     
        const novoIme = event.target.value;
  
        // Ažuriramo stanje sa novom vrednošću
        setIme(novoIme); 
    }
    const telefonHandler=(event)=>{
     
        const noviTelefon = event.target.value;
  
        // Ažuriramo stanje sa novom vrednošću
        setTelefon(noviTelefon); 
    }
    const prezimeHandler=(event)=>{
     
      const novoPrezime = event.target.value;

      // Ažuriramo stanje sa novom vrednošću
      setPrezime(novoPrezime); 
  }
  const emailHandler=(event)=>{
     
    const novoEmail = event.target.value;

    // Ažuriramo stanje sa novom vrednošću
    setMejl(novoEmail); 
}
const passwordHandler=(event)=>{
     
  const novoPassword = event.target.value;

  // Ažuriramo stanje sa novom vrednošću
  setSifra(novoPassword); 
}
const potvrdaHandler=(event)=>{
     
  const novoPotvrdi = event.target.value;

  // Ažuriramo stanje sa novom vrednošću
  setPotvrda(novoPotvrdi); 
}
const[unos,setUnos]=useState('');

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
    return(
        <>
        <Grid
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
           Registracija
          </Typography>
         
          <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
                <Item>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="ime"
                    label="Ime"
                    name="ime"
                    autoComplete="ime"
                    autoFocus
                    onChange={imeHandler}
                />  
                </Item>
            </Grid>
                <Grid item xs={4}>
                    <Item>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="prezime"
                        label="Prezime"
                        type="text"
                        id="prezime"
                        autoComplete="prezime"
                        onChange={prezimeHandler}
                        />
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Telefon"
                        type="number"
                        id="phone"
                        autoComplete="0"
                        onChange={telefonHandler}
                    />
          
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        autoComplete="email"
                        onChange={emailHandler}
                    />
          
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Sifra"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={passwordHandler}
                    />
          
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Potvrdi sifru"
                        type="password"
                        id="confirm-password"
                        autoComplete="current-password"
                        onChange={potvrdaHandler}
                    />
          
                    </Item>
                </Grid>
                <Grid xs={12}>
              <Item>
              <FormControl variant="filled" sx={{width:'200px',marginTop:'14px'}} >
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
          <Grid xs={12}>
            <Item>
              <Button variant='contained' onClick={kategorijaPressHandler}>Unesi kategoriju</Button>
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
          </Grid>
          
            
           
           <div>

           </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={registracijaHandler}
            >
              Registrujte se
            </Button>
            <Grid container sx={{ mt: 5, mb: 5 }}
             justifyContent="center"
             alignItems="center">
              
                <Link href="#" variant="body2" onClick={linkHandler}>
                  {"Imate nalog? Prijavite se"}
                </Link>
            </Grid>
          </Box>
        </Box>
        </Paper>
      </Container>
    </Grid>
    </>
    
    );
}
export default Registracija;