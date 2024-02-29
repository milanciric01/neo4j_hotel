using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class ServiceUsage
{
    public ServiceType ServiceType { get; set; }
    public DateTime TimeOfUse { get; set; }
}