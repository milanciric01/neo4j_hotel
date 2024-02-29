using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Room
{
    
    public int ID { get; set; }
    public int NumberOfRoom{get;set;}
    
    public required  string RoomType { get; set; }
    
    public int PricePerNight { get; set; }

    public int RoomCapacity { get; set; }
   
    public required string RoomStatus { get; set; } 
    
   
    [JsonIgnore]
    public List<Reservation>? reservations {get; set;} = new List<Reservation>();
    

    public required int Hotel {get; set;}


}