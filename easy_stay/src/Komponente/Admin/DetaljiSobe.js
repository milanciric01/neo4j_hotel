import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Paper, Rating, Typography } from "@mui/material";
import Item from '@mui/material/ListItem'
import { useNavigate } from "react-router-dom";
import NavigacijaAdmin from "./NavigacijaAdmin";


const DetaljiSobe=(props)=>
{
  const email=localStorage.getItem('email');
    const navigate=useNavigate();
    //localStorage.removeItem('idHotela');
  
    const soba=
    {
        broj:'4',
        tip:'SingleRoom',
        cena:'70',
        kapacitet:'5',
        status:'Free',
        pogled:'SeaView',
        hotel:'Ambasador'
    };
    const uslugeSobe=[
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
      ]
   
    return (
        <>
       <NavigacijaAdmin azur={3}/>
       <Card sx={{ marginLeft:'600px',marginTop:'100px',width:'740px' ,height:'1300px',backgroundColor:'#e1f7f4',alignItems:'center',justifyContent:'center',alignContent:'center'}}>
      <CardContent sx={{marginTop:'-70px',padding:'100px'}}>
      <Typography sx={{ fontSize: 48,padding:'30px' }} color="text.primary" gutterBottom>
        Broj sobe : {soba.broj}
        </Typography>
        <hr/>
        <Typography sx={{ fontSize: 28}} color="text.primary" gutterBottom>
          Tip sobe:{soba.tip} <br/>  Cena nocenja: {soba.cena} <br/>  Kapacitet: za {soba.kapacitet} osoba
        </Typography>
        <hr/>
        <Typography variant="h3" component="div">
        <Typography component="legend" sx={{ fontSize: 28}}>Status</Typography>
      <Typography  component="legend" sx={{ fontSize: 28}}>{soba.status}</Typography>
        </Typography>
        <hr/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Pogled sobe:{soba.pogled}
        </Typography>
        <hr/>
        <Typography variant="h1"sx={{ fontSize: 14 }}>
          Usluge koje soba pruza ako se izaberu:{uslugeSobe.map((el, index) => (
    <h3 key={index}>
      {el}
      <br />
    </h3>
  ))}
          <hr />
          
        </Typography>
      </CardContent>
    
    </Card>
      </>
    )


}
export default DetaljiSobe;