import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import { useNavigate } from "react-router-dom";
import Navigacija from "../Gost/Navigacija";


const SobaHotela=(props)=>
{
    const navigate=useNavigate();
    localStorage.removeItem('soba');
    const email=localStorage.getItem('email');
    const detaljiHandler=(event)=>{
        event.preventDefault();
        localStorage.setItem('soba',props.soba.id);
        // if(email.includes('admin'))
        // {
        //   navigate('/DetaljiSobe');
        // }
        // else
        // {
        //   navigate('/ProfilSobe');

        // }
        navigate('/ProfilSobe')
    }
   
    return (
        <>
       
      
      <Grid xs={12}>
        <Item>
        <Card sx={{backgroundColor:'#e1f7f4',alignItems:'center',justifyContent:'center',alignContent:'center'}}>
      <CardContent >
      <Typography sx={{ fontSize: 18,padding:'30px' }} color="text.primary" gutterBottom>
        Broj sobe : {props.soba.numberOfRoom}
        </Typography>
        <hr/>
        <Typography sx={{ fontSize: 18}} color="text.primary" gutterBottom>
          Tip sobe:{props.soba.roomType} <br/>  Cena nocenja: {props.soba.pricePerNight} <br/>  Kapacitet: za {props.soba.roomCapacity} osoba
        </Typography>
        <hr/>
        <Typography variant="h3" component="div">
        <Typography component="legend" sx={{ fontSize: 28}}>Status</Typography>
      <Typography  component="legend" sx={{ fontSize: 28}}>{props.soba.roomStatus}</Typography>
        </Typography>
        <hr/>
        <Button variant='outlined' onClick={detaljiHandler}>
          Detalji
        </Button>
       
        </CardContent>
        </Card>
        </Item>
      </Grid>
       
      </>
    )


}
export default SobaHotela;