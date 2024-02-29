import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import { useEffect, useState } from "react";
import axios from "axios";

import Navigacija from "../Gost/Navigacija";
import SobaHotela from "./SobaHotela";
import styled from "@emotion/styled";
const BASE_API_URL = 'http://127.0.0.1:6379';
const Sobe=()=>{
  const[sobe,setSobe]=useState([]);
  const hotel=localStorage.getItem('idHotela');
  const[value,setValue]=useState(0);
  useEffect(() => {
 
    console.log('Uso sam u fjuSobe');
  const response =  axios.get(`https://localhost:7068/Hotel/GetHotelWithRooms/${hotel}`,
  {
    headers:{
      //Authorization: `Bearer ${token}`
    }
  }).then(response=>{
    setSobe(response.data);
    setValue(1);
    console.log(response.data);
  })
  .catch(error=>{
    console.log(error);
    setValue(0);
  })

  },[]);
  const filterHandler=(event)=>
  {
    event.preventDefault();
    let poCemu=0;
    if(usluge.length>0&&kategorije.length>0)
    {
      poCemu=2;
    }
    else if(usluge.length===0 &&kategorije.length>0)
    {
        poCemu=0;
    }
    else if(kategorije.length===0&&usluge.length>0)
    {
        poCemu=1;
    }
    else{
      return;
    }
    
    const response = axios.post(
      `https://localhost:7068/Guest/GetFilteredRooms/${hotel}/${poCemu}`,
      {
        services:usluge,
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
        setKategorije([]);
        setUsluge([]);
        const uniqueArray = response.data.filter((obj, index, self) =>
                index === self.findIndex((o) => o.id === obj.id)
        );
        setSobe(uniqueArray);
        
      })
      .catch((error) => {
        // Obrada greške
        console.log(error);
        
      });
  }
    const soba=sobe.map((element) => (
        
        <Grid xs={2}>
        <Item>
             <SobaHotela soba={element} />
        
              </Item>
          
          </Grid>
        ));
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
        const[unos,setUnos]=useState('');
        const[kategorije,setKategorije]=useState([]);
        const kategorijaPressHandler = (event) => {
          event.preventDefault();
          
          // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
         
          setKategorije((prevKategorije) => [...prevKategorije, unos]);
          
        }
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
         const tipSobeU = [
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
        const uslugaPressHandler = (event) => {
          event.preventDefault();
          
          // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
         
          setUsluge((prevUsluge) => [...prevUsluge, unosU]);
          
        }
        const [usluga, setUsluga] = useState();
        const handleChangeUsluga = (event) => {
          // setTip(event.target.value);
           console.log(event.target.value);
           setUnosU(event.target.value);
           
         };  
         const  btnHandlerU=(event, element)=>
         {
           event.preventDefault();
          
          setUsluge(usluge.filter(e=>e!==element));
         }
         
          
    return (
    <>  
        <Navigacija/>
        <h1 style={{marginBottom:'70px'}}>Ovde mozete filtrirati sobe</h1>
        <Grid container spacing={0} >
        <Grid xs={6}>
              <Item>
              <FormControl variant="filled" sx={{marginTop:'14px',width:'400px',marginLeft:'480px'}} >
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
          <Grid xs={6}>
            <Item>
            <Button variant='contained' onClick={kategorijaPressHandler} sx={{marginTop:'28px'}}>Unesi kategoriju</Button>
                  
            </Item>
          </Grid>
          <Grid xs={12}>
            <Item>
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
      </Item>
      </Grid>
         <Grid xs={6}>
              <Item>
              <FormControl variant="filled" sx={{marginTop:'14px',width:'400px',marginLeft:'480px'}} >
                      <InputLabel id="demo-simple-select-filled-label">Izaberite usluge apartmana koje preferirate</InputLabel>
                      <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={usluga}
                      onChange={handleChangeUsluga}
                     
                      >
                      <MenuItem>
                      <em>None</em>
                      </MenuItem>
                      {tipSobeU.map(element=>
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
          <ListItem key={ind}>
            <Chip
              
              label={data}
              onDelete={(event) => btnHandlerU(event,data)}
            />
          </ListItem>
        );
      })}
            </Item>
          </Grid>
          <Grid xs={12}>
        <Item>
        
        <Button variant="contained" sx={{marginTop:'20px',marginBottom:'70px',marginLeft:'480px',width:'700px'}} onClick={filterHandler}>
                Filtriraj
            </Button>
           
            </Item>
          
          </Grid>
        </Grid>
        <hr/>
          <Grid container spacing={0} >
          <Grid xs={5}>
        
                      </Grid>
          <Grid xs={6}>
              <Item>
                <h1 style={{marginLeft:'-70px'}}>
               Sobe hotela koji ste izabrali
                </h1>
                </Item>
          </Grid>
          <Grid xs={2}>
              
          </Grid>
      </Grid>
       {sobe.length>0&&(
         <Grid container spacing={0} >
           {soba}

         </Grid>
        
        )}
    </>
    )

}
export default Sobe;
