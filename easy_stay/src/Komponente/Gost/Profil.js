import { BottomNavigation, BottomNavigationAction, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Hotel from "../Hoteli/Hotel";
import Item from '@mui/material/ListItem'

import Navigacija from "./Navigacija";
import { useEffect, useState } from "react";
import axios from "axios";
const Profil=()=>
{
    const [hoteli,setHoteli]=useState([]);
    const [preporuka,setPreporuka]=useState([]);
    const [filter,setFilter]=useState([]);
    const email=localStorage.getItem('email');
    const password=localStorage.getItem('password');
    const id=localStorage.getItem('id');
    const[value,setValue]=useState(0);
    const[osvezi,setOsvezi]=useState(false);
    const osveziHandler=(data)=>
    {
      if(osvezi===true)
      {

        setOsvezi(false);
      }
      else
      {
        setOsvezi(true);
      }
    }
    const [preth,setPreth]=useState([]);
    useEffect(() => {
 
      console.log('Uso sam u fju1');
    const response =  axios.get(`https://localhost:7068/Guest/GetFollowedHotels/${id}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      setHoteli(response.data);
      setValue(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      setValue(0);
    })
    const response2 =  axios.get(`https://localhost:7068/Guest/GetRecomendedHotels/${email}/${password}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      setPreporuka(response.data);
      setValue(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      setValue(0);
    })
    const response3 =  axios.get(`https://localhost:7068/Guest/GetGuestPreferences/${id}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      //console.log("Kategorije");
      setPreth(response.data);
      setValue(1);
      console.log("Kategorije su"+response.data);
    })
    .catch(error=>{
      console.log(error);
      setValue(0);
    })
    },[osvezi]);
   
    const hotel=hoteli.map((element) => (
        
        <Grid xs={2}>
        <Item>
             <Hotel h={element} prati={true} azur={osveziHandler} />
        
              </Item>
          
          </Grid>
        ));
        const[prat,setPrat]=useState(false);
        const proveri=(idElementa)=>
        {
          
          console.log('Uso sam u fju1');
          const response =  axios.get(`https://localhost:7068/Hotel/CheckFollowing/${id}/${idElementa}`,
          {
            headers:{
              //Authorization: `Bearer ${token}`
            }
          }).then(response=>{
            setValue(1);
            console.log(response.data);
            setPrat(response.data);
          })
          .catch(error=>{
            console.log(error);
            setValue(0);
          })
        }
        const preporuke=preporuka.map((element) => (
        
         <Grid xs={2}>
          <Item>
               <Hotel h={element} prati={proveri(element.id) ? true:false} azur={osveziHandler} />
          
                </Item>
            
            </Grid>
          ));
         
          const filteri=filter.map((element) => (
        
            <Grid xs={2}>
            <Item>
                 <Hotel h={element}   azur={osveziHandler} />
            
                  </Item>
              
              </Grid>
            ));
        const [ime,setIme]=useState('');
        const [zemlja,setZemlja]=useState('');
        const [cena,setCena]=useState('');
        const [ocena,setOcena]=useState('');
        const imeHandler=(event)=>{setIme(event.target.value)};
        const zemljaHandler=(event)=>{setZemlja(event.target.value); };
        const cenaHandler=(event)=>{setCena(event.target.value);};
        const ocenaHandler=(event)=>{setOcena(event.target.value)};
        const onNameHandler=(event)=>{
          event.preventDefault();
          console.log('Uso sam u fju1');
          const response =  axios.post(`https://localhost:7068/Guest/GetFilteredHotels/${id}/0`,
          {
            
              name: ime,
              country: "string",
              ocena: 0,
              price: 0
            
          },
          {
            headers:{
              //Authorization: `Bearer ${token}`
            }
          }).then(response=>{
            setFilter(response.data);
            setIme('');
            setZemlja('');
            setOcena('');
            setCena('');
            setValue(1);
            console.log(response.data);
          })
          .catch(error=>{
            console.log(error);
            setValue(0);
          })

        }
        const onSearchHandler=(event)=>{
          event.preventDefault();
          console.log('Uso sam u fjunovu');
          console.log(`zemlja :${zemlja}`);
          console.log(`cena :${cena}`);
          console.log(`ocena :${ocena}`);
          
          let ID=0;
          let o=0;
          let z="string";
          let c=0;
          if(zemlja!==''&&cena!==''&&ocena!=='')
          {
            ID=7;
            o=ocena;
            c=cena;
            z=zemlja;
          }
          else if(zemlja!==''&&cena!==''&&ocena==='')
          {
            ID=5;
            c=cena;
            z=zemlja;
          }
          else if(zemlja!==''&&cena===''&&ocena!=='')
          {
            ID=4;
            o=ocena;
            z=zemlja;
          }
          else if(zemlja===''&&cena!==''&&ocena!=='')
          {
            ID=6;
            o=ocena;
            c=cena;
          
          }
          else if(zemlja!==''&&cena===''&&ocena==='')
          {
            ID=1;
           
            z=zemlja;
          }
          else if(zemlja===''&&cena===''&&ocena!=='')
          {
            ID=2;
            o=ocena;
          
          }
          else if(zemlja===''&&cena!==''&&ocena==='')
          {
            ID=3;
            
            c=cena;
            
          }
          const response =  axios.post(`https://localhost:7068/Guest/GetFilteredHotels/${id}/${ID}`,
          {
            
              name: 'string',
              country: z,
              ocena: o,
              price: c
            
          },
          {
            headers:{
              //Authorization: `Bearer ${token}`
            }
          }).then(response=>{
            setFilter(response.data);
            setIme('');
            setZemlja('');
            setOcena('');
            setCena('');
            setValue(1);
            console.log(response.data);
          })
          .catch(error=>{
            console.log(error);
            setValue(0);
          })

          
          

        }
        const [tip, setTip] = useState();
        const[unos,setUnos]=useState('');
const handleChangeTip = (event) => {
 // setTip(event.target.value);
  console.log(event.target.value);
  setUnos(event.target.value);
  
};
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
const[kategorije,setKategorije]=useState([]);
const  btnHandler=(event, element)=>
{
  event.preventDefault();
 
 setKategorije(kategorije.filter(e=>e!==element));
}
const kategorijaPressHandler = (event) => {
  event.preventDefault();
  
  // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
 
  setKategorije((prevKategorije) => [...prevKategorije, unos]);
  
}
const azuriranjeHandler=(event)=>
{
  event.preventDefault();
  const response = axios.put(
    `https://localhost:7068/Guest/UpdateUser/${id}`,
    {
      lista:kategorije
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
     if(osvezi===true)
     {
      setOsvezi(false);
     }
     else
     {
      setOsvezi(true);
     }
    })
    .catch((error) => {
      // Obrada greške
      console.log(error);
      
    })
}
    return (
        <>
       <Navigacija/>
        <h1 style={{marginBottom:'70px'}}>Ovde mozete filtrirati hotele</h1>
        <Grid container spacing={0} >
        <Grid xs={12}>
            <Item>
              <h1>Preporuke hotela se zasnivaju na kategorijama koje ste izabrali:</h1>
            </Item>
          </Grid>
          <Grid xs={12}>
            <Item>
              {value===1&&(
                // preth.map(element=>{
                //   <h3>{element}</h3>
                // })
                <h3>{preth}</h3>
              )}
            </Item>
          </Grid>
          <Grid xs={12}>
            <Item>
              <h1>Unesite nove kategorije soba po kojima zelite prepurke hotela-prethodne kategorije ce biti obrisane</h1>
            </Item>
          </Grid>
        <Grid xs={10}>
              <Item>
                
              <FormControl variant="filled" sx={{width:'1700px'}} >
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={azuriranjeHandler}
            >
              Azuriraj preference
            </Button>
            </Item>
          </Grid>
        <Grid xs={10}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="naziv"
              label="Naziv"
              type="texy"
              id="naziv"
              value={ime}
              autoComplete="hotel"
            onChange={imeHandler}
            />
            </Item>
          
          </Grid>
          <Grid xs={2}>
        <Item>
        <Button variant="contained" sx={{marginTop:'20px',marginBottom:'70px'}} onClick={onNameHandler}>
                Pretrazi hotel
            </Button>
            </Item>
          
          </Grid>
          
          <Grid xs={2}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="zemlja"
              label="Drzava"
              type="texy"
              id="naziv"
              value={zemlja}
              autoComplete="hotel"
              onChange={zemljaHandler}
            
            />
            </Item>
          
          </Grid>
          
          <Grid xs={2}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="zemlja"
              label="Ocena(1-5)"
              type="number"
              id="naziv"
              value={ocena}
              autoComplete="hotel"
              onChange={ocenaHandler}
            
            />
            </Item>
          
          </Grid>
          <Grid xs={2}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="zemlja"
              label="Cena($) za 7 dana"
              type="number"
              id="naziv"
              value={cena}
              autoComplete="hotel"
              onChange={cenaHandler}
            
            />
            </Item>
          
          </Grid>
          <Grid xs={2}>
        <Item>
        <Button variant="contained" sx={{marginTop:'20px',marginBottom:'70px'}} onClick={onSearchHandler}>
                Filtriraj
            </Button>
            </Item>
          
          </Grid>
          {value===1&&(  
               
          
          <Grid container spacing={2} >
          <h1 style={{marginBottom:'70px',marginLeft:'70px'}}>Rezultati pretrage</h1>
            
              {filteri}
    
    </Grid>
    
    )}
        </Grid>
        <hr/>
       
        <h1 style={{marginBottom:'70px'}}>Hoteli koje pratite</h1>
        
             
       {value===1&&(  <Grid container spacing={2} >
          
                {hotel}
          
          </Grid>
          )}
          <hr/>
          <h1 style={{marginBottom:'70px'}}>Preporuceni hoteli</h1>
          {value===1&&(  <Grid container spacing={2} >
          
          {preporuke}
    
    </Grid>
    )}
       
        </>
    );
}
export default Profil;