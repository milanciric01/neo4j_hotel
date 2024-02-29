import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Paper, Rating, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import { useNavigate } from "react-router-dom";
import NavigacijaAdmin from "./NavigacijaAdmin";
import { useEffect, useState } from "react";
import axios from "axios";


const DetaljiHotela=(props)=>
{
  const email=localStorage.getItem('email');
  const idH=localStorage.getItem('idHotela');
  const [val,setVal]=useState(0);
    const navigate=useNavigate();
    //localStorage.removeItem('idHotela');
    const vidiSobeHandler=(event)=>{
        event.preventDefault();
        //localStorage.setItem('idHotela',props.h.id);
        navigate('/PregledSoba');
    }
    
    const [hotel,setHotel]=useState([]);
    useEffect(() => {
 
      console.log('Uso sam u fju1');
    const response =  axios.get(`https://localhost:7068/Hotel/GetHotelWithoutRooms/${idH}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      setHotel(response.data);
      setVal(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      setVal(0);
    })
    
    },[]);
   
    return (
        <>
       <NavigacijaAdmin azur={1}/>
       {val===1&&(<Card sx={{ marginLeft:'600px',marginTop:'100px',width:'740px' ,height:'700px',backgroundColor:'#e1f7f4',alignItems:'center',justifyContent:'center',alignContent:'center'}}>
      <CardContent sx={{marginTop:'-70px',padding:'100px'}}>
      <Typography sx={{ fontSize: 48,padding:'30px' }} color="text.primary" gutterBottom>
        Naziv: {hotel.name}
        </Typography>
        <hr/>
        <Typography sx={{ fontSize: 28}} color="text.primary" gutterBottom>
          ID:{hotel.id} <br/>  Zemlja: {hotel.country} <br/>  Adresa: {hotel.location}
        </Typography>
        <hr/>
        <Typography variant="h3" component="div">
        <Typography component="legend" sx={{ fontSize: 28}}>Ocena</Typography>
      <Rating name="read-only" value={hotel.ocena} readOnly />
        </Typography>
        <hr/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Broj soba:{hotel.numberORooms}
        </Typography>
        <hr/>
        <Typography variant="body2"sx={{ fontSize: 14 }}>
          {hotel.opisHotela}
          <hr />
          
        </Typography>
      </CardContent>
      <CardActions>
       <Button size="large" variant="contained"sx={{marginTop:'-80px',marginLeft:'170px',width:'370px'}}onClick={vidiSobeHandler}>Vidi sobe</Button>
       
      </CardActions>
    </Card>)}
      </>
    )


}
export default DetaljiHotela;