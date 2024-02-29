using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Reservation
{
    public int ID { get; set; }

    public required DateTime CheckInDate { get; set; }

    public required DateTime CheckOutDate { get; set; }

    public  required Guest Guest { get; set; }
    public  required Room Room { get; set; }

    public List<ServiceUsage> ServicesUsed { get; set; } = new List<ServiceUsage>();


}

  