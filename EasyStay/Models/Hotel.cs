using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Hotel
{
    
    public int ID { get; set; }

    [MaxLength(30)]
    public required string Name { get; set; }
    
    public required int NumberORooms { get; set; }
   
    public required string Country { get; set; }
    public required string Location { get; set; }
    public required int Administrator { get; set; }
    public required string OpisHotela { get; set; }

    
    public required int CenaZa7Dana { get; set; }
    public required int Ocena { get; set; }
    [JsonIgnore]
    public  List<Room> Rooms { get; set; } = new List<Room>();
    [JsonIgnore]
    public List<Guest> Korisnici { get; set; } = new List<Guest>();
    [JsonIgnore]
    public List<Reservation>? Reservations { get; set; } = new List<Reservation>();


}