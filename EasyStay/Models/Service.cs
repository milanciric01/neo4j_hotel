using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

public class Service
{
    public required string VrstaUsluge { get; set; }
    public required int Cena { get; set; }
}