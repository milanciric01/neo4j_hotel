import { Button, Card, CardContent, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import Navigacija from "../Gost/Navigacija";
import Item from '@mui/material/ListItem'
import { useEffect, useState } from "react";
import axios from "axios";
import { RemoveShoppingCartRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavigacijaAdmin from "../Admin/NavigacijaAdmin";
const ProfilSobe=(props)=>
{
  const[soba,setSoba]=useState({});
  const[value,setValue]=useState(0);
  const idSobe=localStorage.getItem('soba');
  const idOsobe=localStorage.getItem('id');
  
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
  const[unos,setUnos]=useState('');
  const[usluge,setUsluge]=useState([]);
  const uslugaPressHandler = (event) => {
    event.preventDefault();
    
    // Koristimo concat da bismo napravili novi niz koji sadrži postojeće kategorije i novu kategoriju
   
    setUsluge((prevUsluge) => [...prevUsluge, unos]);
    
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
    
    setUsluge(usluge.filter(e=>e!==element));
   }
   const rezervisiHandler=(event)=>
   {
    event.preventDefault();
    const response = axios.post(
      `https://localhost:7068/Guest/ReservateRoom/${idOsobe}/${idSobe}`,
      {
        headers: {
          // Ovde možete dodati header informacije ako su potrebne
          // Authorization: `Bearer ${token}`
        },
      }
    )
      .then((response) => {
        // Obrada uspešnog odgovora
        const response2 = axios.post(
          `https://localhost:7068/Guest/AddServiceToUser/${idOsobe}`,
          {
            services:usluge
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
            
            
            setValue(2);
          })
          .catch((error) => {
            // Obrada greške
            console.log(error);
            
          });
        
        
      })
      .catch((error) => {
        // Obrada greške
        console.log(error);
        
      });
    
   }
   const navigate=useNavigate();
 const okHandler=(event)=>
 {
    event.preventDefault();
    setValue(1);
    navigate('/Sobe')
 }
 const email=localStorage.getItem('email');
    return(
        <>
        {email.includes('admin')===false&&(<Navigacija/>)}
        {email.includes('admin')===true&&(<NavigacijaAdmin azur={3}/>)}
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
        {value===1&&(<Card sx={{ marginLeft:'600px',marginTop:'100px',width:'740px' ,height:'900px',backgroundColor:'#e1f7f4',alignItems:'center',justifyContent:'center',alignContent:'center'}}>
      <CardContent sx={{marginTop:'-70px',padding:'100px'}}>
      <Typography sx={{ fontSize: 48,padding:'30px' }} color="text.primary" gutterBottom>
        Broj sobe : {soba.room.numberOfRoom}
        </Typography>
        <hr/>
        <Typography sx={{ fontSize: 28}} color="text.primary" gutterBottom>
          Tip sobe:{soba.room.roomType} <br/>  Cena nocenja: {soba.room.pricePerNight}$ <br/>  Kapacitet: za {soba.room.roomCapacity} osoba
        </Typography>
        <hr/>
        <Typography variant="h3" component="div">
        <Typography component="legend" sx={{ fontSize: 28}}>Status</Typography>
      <Typography  component="legend" sx={{ fontSize: 28}}>{soba.room.roomStatus}</Typography>
        </Typography>
        <hr/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ID hotela:{soba.room.hotel}
        </Typography>
        <hr/>
        <h1>Kategorije kojima soba pripada</h1>
        <Grid container spacing={4}>
        {soba.preferences.map((element) => (
        
        <Grid xs={3}>
        <Item>
             <h3>{element.vrstaKriterijuma}={element.cena}$</h3>
        
              </Item>
          
          </Grid>
        ))}
        </Grid>

<Grid xs={12}>
              <Item>
              <FormControl variant="filled" sx={{marginTop:'14px',width:'900px',marginLeft:'0px'}} >
                      <InputLabel id="demo-simple-select-filled-label">Izaberite neku od usluga koje navedeni apartman nudi</InputLabel>
                      <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={tip}
                      onChange={handleChangeTip}
                     
                      >
                      <MenuItem>
                      <em>None</em>
                      </MenuItem>
                      {soba.services.map(element=>
                          <MenuItem value={element.vrstaUsluge}>{element.vrstaUsluge+"("+element.cena+"$)"}</MenuItem>


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
              onDelete={(event) => btnHandler(event,data)}
            />
          </li>
        );
      })}
      </Item>
      </Grid>
      <Grid xs={12}>
        <Item>
          <Button variant="contained"sx={{width:'1000px'}} disabled={soba.room.roomStatus==='already reservate'?true:false}  onClick={rezervisiHandler}>Rezervisi sobu</Button>
        </Item>
      </Grid>
        </CardContent>
        </Card>)}
        </>
    );

}
export default ProfilSobe;