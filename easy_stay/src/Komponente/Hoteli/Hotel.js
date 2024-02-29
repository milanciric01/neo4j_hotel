import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Paper, Rating, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Hotel=(props)=>
{
  const email=localStorage.getItem('email');
  const id=localStorage.getItem('id');
    const navigate=useNavigate();
    localStorage.removeItem('idHotela');
    const sobeHandler=(event)=>{
        event.preventDefault();
        localStorage.setItem('idHotela',props.h.id);
        navigate('/Sobe');
    }
    const menjajHandler=(event)=>
    {
      event.preventDefault();
      localStorage.setItem('idHotela',props.h.id);
      navigate('/DetaljiHotela');
    }
   const btnHandlerPrati=(event,data)=>
   {
    event.preventDefault();
    const response =  axios.post(`https://localhost:7068/Guest/FollowHotel/${id}/${data}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      props.azur(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      
    })

   }
   const btnHandlerOtPrati=(event,data)=>
   {
    event.preventDefault();
    const response =  axios.post(`https://localhost:7068/Guest/UnFollowHotel/${id}/${data}`,
    {
      headers:{
        //Authorization: `Bearer ${token}`
      }
    }).then(response=>{
      props.azur(1);
      console.log(response.data);
    })
    .catch(error=>{
      console.log(error);
      
    })

   }
  
  
    return (
        <>
       
       <Card sx={{ width:'540px' ,backgroundColor:'#e1f7f4'}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          Naziv:{props.h.name} , Drzava:{props.h.country} ,Lokacija: {props.h.location}
        </Typography>
        <hr/>
        <Typography variant="h5" component="div">
        <Typography component="legend">Ocena</Typography>
      <Rating name="read-only" value={props.h.ocena} readOnly />
        </Typography>
        <hr/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Broj soba:{props.h.numberORooms}
        </Typography>
        <hr/>
        <Typography variant="body2">
          Opis:{props.h.opisHotela}
          <hr />
          
        </Typography>
      </CardContent>
      {email.includes('admin')==false&&(
      <CardActions>
       {props.prati===true&&(<Button size="small"onClick={(event) => btnHandlerOtPrati(event,props.h.id)}>Odprati</Button>)}
       {props.prati===false&&(<Button size="small" onClick={(event) => btnHandlerPrati(event,props.h.id)}>Prati</Button>)}
        <Button size="small " onClick={sobeHandler}>Vidi sobe</Button>
      </CardActions>
      )}
      {email.includes('admin')==true&&(
      <CardActions>
       <Button size="small" onClick={menjajHandler}>Menjaj</Button>
       
      </CardActions>
      )}
    </Card>
      </>
    )


}
export default Hotel;