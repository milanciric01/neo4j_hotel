import { BottomNavigation, BottomNavigationAction, Button, Grid, TextField } from "@mui/material";
import Hotel from "../Hoteli/Hotel";
import Item from '@mui/material/ListItem'
import NavigacijaAdmin from "./NavigacijaAdmin";
import { useEffect, useState } from "react";
import axios from "axios";


const Pregled=()=>
{
   const[hoteli,setHoteli]=useState([]);
   const[value,setValue]=useState(0);
   const id=localStorage.getItem('id');
   useEffect(() => {
 
    console.log('Uso sam u fju1');
  const response =  axios.get(`https://localhost:7068/Guest/OwnedHotels/${id}`,
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
  
  },[]);
  const[ime,setIme]=useState('');
  const imeHandler=(event)=>
  {
    setIme(event.target.value);
  }
  const pretragaHandler=(event)=>
  {
    event.preventDefault();
    const response =  axios.post(`https://localhost:7068/Guest/OwnedHotel/${id}`,
    {
        hotelID: ime
    },
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
  }
    const hotel=hoteli.map((element) => (
        
        <Grid xs={2}>
        <Item>
             <Hotel h={element} />
        
              </Item>
          
          </Grid>
        ));
        const [azur,setAzur]=useState(0);
    return (
        <>
     <NavigacijaAdmin azur={azur}/>
        
        <Grid container spacing={0} >
       
        <Grid xs={4}>
        <Item>
        <h1 style={{marginBottom:'70px'}}>Pretrazite hotel po imenu</h1>
            </Item>
          
          </Grid>
        
        
          <Grid xs={4}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="ime"
              label="Hotel123"
              type="text"
              id="naziv"
              autoComplete="hotel"
            onChange={imeHandler}
            />
            </Item>
          
          </Grid>
          <Grid xs={4}>
        <Item>
        <Button variant="contained" sx={{marginTop:'20px',marginBottom:'70px',height:'45px',width:'200px'}} onClick={pretragaHandler}>
                Pretrazi
            </Button>
            </Item>
          
          </Grid>
        </Grid>
        <hr/>
       
        <h1 style={{marginBottom:'70px'}}>Lista vasih hotela</h1>
        
             
         <Grid container spacing={2} >
          
                {hotel}
          
          </Grid>
          <hr/>
          
       
        </>
    );
}
export default Pregled;