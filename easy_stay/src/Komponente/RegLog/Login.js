import { Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from '@mui/material';
import axios from 'axios';

function Login() {
    const navigate = useNavigate(); 

    const [mejl, setMejl] = useState('');
    const [sifra,setSifra]=useState('');
    const prijavaHandler=(event)=>
    {
        event.preventDefault();
        console.log('fja');
        const response = axios.post(
          `https://localhost:7068/Guest/LoginUser/${mejl}/${sifra}`,
          
          {
            headers: {
              // Ovde možete dodati header informacije ako su potrebne
              // Authorization: `Bearer ${token}`
            },
          }
        )
          .then((response) => {
            // Obrada uspešnog odgovora
            if(mejl.includes('admin'))
            {
             navigate('/Pregled');
           }
           else
           {
             navigate('/Profil');
           } 
             
             localStorage.setItem('email', mejl);
             localStorage.setItem('password', sifra);
             localStorage.setItem('id',response.data);
          })
          .catch((error) => {
            // Obrada greške
            console.log("Greška u zahtevu:", error.response.data);
            
          });
   

    }
    const linkHandler=(event)=>
    {
        
        console.log("linkHandler");
        navigate('/Registracija');
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
            Prijava
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={emailHandler}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={passwordHandler}
            />
           <div>

           </div>
           <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={prijavaHandler}
            >
              Prijavi se
            </Button>
            <Grid container sx={{ mt: 5, mb: 5 }}
             justifyContent="center"
             alignItems="center">
              
                <Link href="#" variant="body2" onClick={linkHandler}>
                  {"Nemate nalog? Registrujte se"}
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
  export default Login;