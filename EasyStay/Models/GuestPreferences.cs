using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


public class GuestPreferences
{
    public required  string VrstaKriterijuma { get; set; }
    public required  int Cena { get; set; }
}