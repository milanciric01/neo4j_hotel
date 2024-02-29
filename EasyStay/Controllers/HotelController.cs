using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace EasyStay.Controllers;

[ApiController]
[Route("[controller]")]
public class HotelController : ControllerBase
{
    
    private readonly ILogger<HotelController> _logger;
    private readonly INeo4jService _neo4jService;
    private readonly IConfiguration _configuration;
    public HotelController(ILogger<HotelController> logger, INeo4jService neo4jService, IConfiguration configuration)
    {
        _logger = logger;
        _neo4jService = neo4jService;
        _configuration = configuration;
    }

    


    [HttpPost("AddHotel")]
    public async Task<IActionResult> AddHotel([FromBody] Hotel hotel)
    {
        try
        {
            await _neo4jService.AddHotelAsync( hotel);

            return Ok("Uspesno dodat hotel!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetAllHotels")]
    public async Task<IActionResult> GetAllHotels()
    {
        try
        {
            var hotels = await _neo4jService.GetAllHotelsAsync();

            if (hotels == null )
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




    [HttpPut("UpdateHotel/{hotelId}")]
    public async Task<IActionResult> UpdateHotel([FromRoute]int hotelId, [FromBody] Hotel hotel)
    {
        try
        {

            await _neo4jService.UpdateHotelAsync(hotelId, hotel);
            return Ok("Uspesno azuriran hotel.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    [HttpDelete("DeleteHotel/{hotelId}")]
    public async Task<IActionResult> DeleteHotel(int hotelId)
    {
        try
        {
            await _neo4jService.DeleteHotelAsync(hotelId);
            return Ok($"Hotel sa ID-em {hotelId} uspesno obrisan.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetHotelWithRooms/{id}")]
    public async Task<IActionResult> GetHotel(int id)
    {
        try
        {
            var hotel = await _neo4jService.GetRoomsOfHotelByIdAsync(id);
            if (hotel == null)
            {
                return NotFound($"Hotel sa ID-em {id} nije pronadjen.");
            }

            return Ok(hotel.Rooms);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetHotelWithoutRooms/{id}")]
    public async Task<IActionResult> GetHotelWithoutRooms(int id)
    {
        try
        {
            var hotel = await _neo4jService.GetHotelByIdAsync(id);
            if (hotel == null)
            {
                return NotFound($"Hotel sa ID-em {id} nije pronadjen.");
            }

            return Ok(hotel);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("CheckFollowing/{HotelID}/{GuestID}")]
    public async Task<IActionResult> CheckFollowing([FromRoute]int HotelID,[FromRoute]int GuestID)
    {
        try
        {
            var prati = await _neo4jService.CheckFollowingAsync(HotelID, GuestID);
            //if (hotel == null)
            //{
            //    return NotFound($"Hotel sa ID-em {id} nije pronadjen.");
            //}

            return Ok(prati);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetRoomOfHotel/{id}/{number}")]
    public async Task<IActionResult> GetRoom([FromRoute]int id,[FromRoute]int number)
    {
        try
        {
            var hotel = await _neo4jService.GetRoomsOfHotelByIdAsync(id);
            if (hotel == null)
            {
                return NotFound($"Hotel sa ID-em {id} nije pronadjen.");
            }
            List<Room> room=new List<Room>();
            foreach (var r in hotel.Rooms)
            {
                if (r.NumberOfRoom == number)
                {
                    room.Add(r);
                    break;
                }
            }
            return Ok(room);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }






    #region Auth


    // [HttpPost("Register")]
    // public async Task<IActionResult> Register([FromBody] Guest guest)
    // {
    //     try
    //     {
    //         if (!IsValidEmail(guest.Email))
    //         {
    //             return BadRequest("Format mejla nije validan.");
    //         }

    //         if (!IsValidPassword(guest.Password))
    //         {
    //             return BadRequest("Lozinka je slaba - ne ispunjava sve kriterijume! .");
    //         }

    //         var existingGuest = await _neo4jService.GetGuestByEmailAsync(guest.Email);
    //         if (existingGuest != null)
    //         {
    //             return BadRequest("Korisnik sa datim e-mejlom vec postoji.");
    //         }


    //         await _neo4jService.AddGuestAsync(guest);
    //         return Ok("Uspesna registracija.");
    //     }
    //     catch (Exception e)
    //     {
    //         return BadRequest(e.Message);
    //     }
    // }



    // public bool IsValidEmail(string email)
    // {
    //     try
    //     {
    //         var addr = new System.Net.Mail.MailAddress(email);
    //         return addr.Address == email;
    //     }
    //     catch
    //     {
    //         return false;
    //     }
    // }

    // public bool IsValidPassword(string password)
    // {
    //     if (string.IsNullOrWhiteSpace(password))
    //     {
    //         return false;
    //     }

    //     var hasNumber = new Regex(@"[0-9]+");
    //     var hasUpperChar = new Regex(@"[A-Z]+");
    //     var hasMinimum8Chars = new Regex(@".{8,}");
    //     var hasLowerChar = new Regex(@"[a-z]+");
    //     var hasSymbols = new Regex(@"[!@#$%^&*()_+=\[{\]};:<>|./?,-]");

    //     return hasNumber.IsMatch(password) && hasUpperChar.IsMatch(password) &&
    //            hasMinimum8Chars.IsMatch(password) && //hasLowerChar.IsMatch(password) &&
    //            //hasSymbols.IsMatch(password);
    //            hasLowerChar.IsMatch(password);
    // }






    // [HttpPost("Login")]
    // public async Task<IActionResult> Login([FromBody] Guest loginRequest)
    // {
    //     var guest = await _neo4jService.GetGuestByEmailAsync(loginRequest.Email);
    //     if (guest == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, guest.Password))
    //     {
    //         return Unauthorized("Nevalidan mejl/lozinka !");
    //     }

    //     // Generisi i vrati jwt token za auth

    //     return Ok("Uspesno logovanje!");
    // }



    // private string GenerateJwtToken(Guest user)
    // {
    //     List<Claim> claims = new List<Claim> {
    //         new Claim(ClaimTypes.Name, user.FirstName)
    //     };

    //     var jwtKeyString = _configuration.GetSection("Jwt:Key").Value;
    //     if (string.IsNullOrEmpty(jwtKeyString))
    //     {
    //         throw new InvalidOperationException("Kljuc nije postavljen u konfiguraciji !.");
    //     }

    //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKeyString));

    //     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    //     var token = new JwtSecurityToken(
    //         claims: claims,
    //         expires: DateTime.Now.AddDays(1),
    //         signingCredentials: creds
    //     );

    //     var jwt = new JwtSecurityTokenHandler().WriteToken(token);

    //     return jwt;
    // }
    #endregion





}



    

