using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace EasyStay.Controllers;

[ApiController]
[Route("[controller]")]
public class RoomController : ControllerBase
{

    private readonly ILogger<RoomController> _logger;
    private readonly INeo4jService _neo4jService;
    private readonly IConfiguration _configuration;
    public RoomController(ILogger<RoomController> logger, INeo4jService neo4jService, IConfiguration configuration)
    {
        _logger = logger;
        _neo4jService = neo4jService;
        _configuration = configuration;
    }





    [HttpGet("GetAllRooms")]
    public async Task<IActionResult> GetAllRooms()
    {
        try
        {
            var rooms = await _neo4jService.GetAllRoomsAsync();

            if (rooms == null)
            {
                return BadRequest("Ne postoji soba u bazi!");
            }
            return Ok(rooms);

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    public class AddRoomRequest
    {
        public Room Room { get; set; }
        public List<Service> Services { get; set; }
        public List<GuestPreferences> Preferences { get; set; }
    };
    public class AddRoomRequest2
    {
        public Room Room { get; set; }
        public List<string> Services { get; set; }
        public List<string> Preferences { get; set; }
    };

    [HttpPost("AddRoomToHotel/{hotelId}")]
    public async Task<IActionResult> AddRoomToHotel(
    [FromRoute] int hotelId,
    [FromBody] AddRoomRequest2 r)
    {
        try
        {

            await _neo4jService.AddRoomToHotelAsync(hotelId,r.Room,r.Preferences,r.Services);
            return Ok("Uspesno dodata soba u hotel.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPut("UpdateRoom/{id}")]
    public async Task<IActionResult> UpdateRoom([FromRoute]int id, [FromBody] AddRoomRequest2 req)
    {
        try
        {

            await _neo4jService.UpdateRoomAsync(id, req);
            return Ok("Uspesno azurirana soba.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    [HttpDelete("DeleteRoom/{roomID}")]
    public async Task<IActionResult> DeleteRoom(int roomID)
    {
        try
        {
            await _neo4jService.DeleteRoomAsync(roomID);
            return Ok($"Soba sa ID-em {roomID} uspesnoa obrisana.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetRoomsById/{id}")]
    public async Task<IActionResult> GetRoomById([FromRoute]int id)
    {
        try
        {
            var room = await _neo4jService.GetRoomByIdAsync(id);
            if (room == null)
            {
                return NotFound($"Soba sa ID-em {id} nije pronadjena.");
            }
            var category = await _neo4jService.GetRoomCategoriesAsync(id);
            if (category == null)
            {
                return NotFound($"Soba sa ID-em {id} nema kategoriju.");
            }
            var service = await _neo4jService.GetRoomServicesAsync(id);
            if (service == null)
            {
                return NotFound($"Soba sa ID-em {id} nema nijednu uslugu.");
            }
            AddRoomRequest req = new AddRoomRequest();
            req.Room = room;
            req.Preferences = category.ToList();
            req.Services = service.ToList();
            return Ok(req);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
  









 





    






}





