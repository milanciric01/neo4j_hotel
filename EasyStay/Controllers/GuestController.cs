using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace EasyStay.Controllers;

[ApiController]
[Route("[controller]")]
public class GuestController : ControllerBase
{

    private readonly ILogger<GuestController> _logger;
    private readonly INeo4jService _neo4jService;
    private readonly IConfiguration _configuration;
    public GuestController(ILogger<GuestController> logger, INeo4jService neo4jService, IConfiguration configuration)
    {
        _logger = logger;
        _neo4jService = neo4jService;
        _configuration = configuration;
    }







    public class RegisterRequest
    {
        public Guest Guest { get; set; }
        public List<string> Preferences { get; set; }
    };

    [HttpPost("RegisterUser")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterRequest r)
    {
        try
        {
            if (r.Guest.Password != r.Guest.ConfirmedPassword)
                return BadRequest("Lozinke se ne podudaraju");
            await _neo4jService.RegisterAsync(r);
            return Ok("Uspesno registrovan korisnik.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("LoginUser/{email}/{password}")]
    public async Task<IActionResult> LoginUser([FromRoute]string email,[FromRoute] string password)
    {
        try
        {

            var user=await _neo4jService.GetUserByEmailAndPassAsync(email,password);
            if(user == null)
            {
                return BadRequest("Ne postoji korisnik u bazi!");
            }
            return Ok(user.ID);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    public class Niz
    {
        public List<string> lista { get; set; }
    }
    [HttpPut("UpdateUser/{id}")]
    public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] Niz lista)
    {
        try
        {

            await _neo4jService.UpdateGuestAsync(id, lista);
            return Ok("Uspesno azuriran korisnik.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetGuestPreferences/{id}")]
    public async Task<IActionResult> PreferencesForUser([FromRoute] int id)
    {
        try
        {

           var result= await _neo4jService.GetCategoriesAsync(id);
            if(result==null)
            {
                return BadRequest("Lista je null");
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("DeleteUser/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            await _neo4jService.DeleteUserAsync(id);
            return Ok($"Korisnik sa ID-em {id} uspesnoa obrisana.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("FollowHotel/{GuestID}/{HotelID}")]
    public async Task<IActionResult> FollowHotel([FromRoute] int GuestID,[FromRoute]int HotelID)
    {
        try
        {
           await _neo4jService.FollowHotelAsync(GuestID,HotelID);
           
            return Ok("Uspesno zapracen hotel");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("UnFollowHotel/{GuestID}/{HotelID}")]
    public async Task<IActionResult> UnFollowHotel([FromRoute] int GuestID, [FromRoute] int HotelID)
    {
        try
        {
            await _neo4jService.UnFollowHotelAsync(GuestID, HotelID);

            return Ok("Uspesno zapracen hotel");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("ReservateRoom/{GuestID}/{RoomID}")]
    public async Task<IActionResult> ReservateRoom([FromRoute] int GuestID, [FromRoute] int RoomID)
    {
        try
        {
            await _neo4jService.ReservateRoomAsync(GuestID,RoomID);
            
            return Ok("Uspesno rezervisana soba");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    public class Lista
    {
       public  List<string> services { get; set; }
    }
    [HttpPost("AddServiceToUser/{GuestID}")]
    public async Task<IActionResult> AddAServiceToUser([FromRoute] int GuestID, [FromBody] Lista a)
    {
        try
        {
            await _neo4jService.AddServicesToUserAsync(GuestID, a.services);

            return Ok("Uspesno dodata usluga korisniku");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("CancelReservation/{GuestID}/{RoomID}")]
    public async Task<IActionResult> CancelReservation([FromRoute] int GuestID, [FromRoute] int RoomID)
    {
        try
        {
            await _neo4jService.CancelReservationAsync(GuestID, RoomID);

            return Ok("Uspesno rezervisana soba");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }




    [HttpGet("GetRecomendedHotels/{email}/{password}")]
    public async Task<IActionResult> GetAllHotels([FromRoute]string email, [FromRoute]string password)
    {
        try
        {
            var hotels = await _neo4jService.RecomendedHotelsAsync(email,password);

            if (hotels == null)
            {
                return BadRequest("Ne postoji hotel u bazi!");
            }
            return Ok(hotels);

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetFollowedHotels/{id}")]
    public async Task<IActionResult> GetFollowedHotels([FromRoute] int id)
    {
        try
        {
            var hotels = await _neo4jService.FollowedHotelsAsync(id);

            if (hotels == null)
            {
                return BadRequest("Ne postoji hotel u bazi!");
            }
            return Ok(hotels);

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    public class FilterRequest
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public int Ocena { get; set; }
        public int Price { get; set; }
    };
    [HttpPost("GetFilteredHotels/{id}/{poCemu}")]
    public async Task<IActionResult> GetFilteredHotels([FromRoute] int id,int poCemu, [FromBody] FilterRequest req)
    {
        try
        {
            var hotels = await _neo4jService.FilterHotelsAsync(id,req,poCemu);

            if (hotels == null)
            {
                return BadRequest("Ne postoji hotel u bazi!");
            }
            return Ok(hotels);

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    public class FilterRequestRoom
    {
        public List<string> Preferences { get; set; }
        public List<string> Services { get; set; }
       
    };
    [HttpPost("GetFilteredRooms/{HotelID}/{poCemu}")]
    public async Task<IActionResult> GetFilteredRooms([FromRoute]int HotelID,[FromRoute]int poCemu, [FromBody] FilterRequestRoom req)
    {
        try
        {
            var rooms = await _neo4jService.GetRoomsWithPreferencesAndServicesAsync(req,HotelID, poCemu);

            if (rooms == null)
            {
                return BadRequest("Ne postoji hotel u bazi!");
            }
          
            
            return Ok(rooms);

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }



    [HttpGet("AllReservatedRoom/{GuestID}")]
    public async Task<IActionResult> AllReservatedRoom([FromRoute] int GuestID)
    {
        try
        {
            var result =await _neo4jService.ReservedRoomsAsync(GuestID);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    public class Usluga
    {
        public string Name { get; set; }
        public int Price { get; set; }
        public int NumberOfRoom { get; set; }
        public string Hotel { get; set; }

    }
    [HttpGet("AllServices/{GuestID}")]
    public async Task<IActionResult> AllServices([FromRoute] int GuestID)
    {
        try
        {
            var result = await _neo4jService.GetUserServicesAsync(GuestID);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    public class Pom
    {
      public  string naziv { get; set; }
    }
    [HttpPost("RemoveService/{GuestID}")]
    public async Task<IActionResult> RemoveService([FromRoute] int GuestID,[FromBody] Pom p)
    {
        try
        {
            await _neo4jService.RemoveServiceFromUserAsync(GuestID,p.naziv);

            return Ok("Obisana veza kornik koristi uslugu");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpGet("OwnedHotels/{GuestID}")]
    public async Task<IActionResult> OwnedHotels([FromRoute] int GuestID)
    {
        try
        {
            var hotels = await _neo4jService.AdminHotelsAsync(GuestID);
            if (hotels == null)
                return BadRequest("Hoteli su null");


            return Ok(hotels);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    public class Filter
    {
        public string HotelID { get; set; }
    }
    [HttpPost("OwnedHotel/{GuestID}")]
    public async Task<IActionResult> OwnedHotel([FromRoute] int GuestID, [FromBody]Filter h)
    {
        try
        {
            var hotels = await _neo4jService.FilterHotelsOwnerAsync(GuestID, h.HotelID);

            if (hotels == null)
            {
                return BadRequest("Ne postoji hotel u bazi!");
            }
            return Ok(hotels);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }









}





