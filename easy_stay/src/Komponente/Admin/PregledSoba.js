import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import { useEffect, useState } from "react";
import axios from "axios";

import Navigacija from "../Gost/Navigacija";
import SobaHotela from "../Hoteli/SobaHotela"
import NavigacijaAdmin from "./NavigacijaAdmin";
const BASE_API_URL = 'http://127.0.0.1:6379';
const PregledSoba=()=>{
    const [sobe,setSobe]=useState([]);
    const[value,setValue]=useState(0);
    const idH=localStorage.getItem('idHotela');
    useEffect(() => {
 
        console.log('Uso sam u fju1');
      const response =  axios.get(`https://localhost:7068/Hotel/GetHotelWithRooms/${idH}`,
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
      const[brSobe,setBrSobe]=useState('');
      const brojSobeHandler=(event)=>{setBrSobe(event.target.value)};
      const pretragaHandler=(event)=>
      {
        event.preventDefault();
        const response =  axios.get(`https://localhost:7068/Hotel/GetRoomOfHotel/${idH}/${brSobe}`,
        {
          headers:{
            //Authorization: `Bearer ${token}`
          }
        }).then(response=>{
          setSobe(response.data);
          setValue(1);
          console.log("Soba po imenu"+response.data);
        })
        .catch(error=>{
          console.log(error);
          setValue(0);
        })
      }
    const soba=sobe.map((element) => (
        
        <Grid xs={5}>
        <Item>
             <SobaHotela soba={element} />
        
              </Item>
          
          </Grid>
        ));
      
    return (
    <>  
        <NavigacijaAdmin azur={2}/>
        <Grid container spacing={0} >
       
        <Grid xs={4}>
        <Item>
        <h1 style={{marginBottom:'70px'}}>Pretrazite sobu po njenom broju u hotelu</h1>
            </Item>
          
          </Grid>
        
        
          <Grid xs={4}>
        <Item>
        <TextField
              margin="normal"
              required
              fullWidth
              name="ime"
              label="Unesite broj sobe"
              type="number"
              id="naziv"
              autoComplete="hotel"
            onChange={brojSobeHandler}
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
          <Grid container spacing={0} >
          <Grid xs={5}>
        
                      </Grid>
          <Grid xs={6}>
              <Item>
                <h1 style={{marginLeft:'70px'}}>
               
                </h1>
                </Item>
          </Grid>
          <Grid xs={2}>
              
          </Grid>
      </Grid>
      {value===1&&(<Grid container spacing={0}>
        <Grid xs={5}>
            <Item>
            {soba}
            </Item>
        </Grid>
      </Grid>)}

       
    </>
    )

}
export default PregledSoba;
