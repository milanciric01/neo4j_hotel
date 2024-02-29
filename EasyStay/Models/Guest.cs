using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class  Guest
{
    
    public int ID { get; set; }

    [MaxLength(20)]
    public required string FirstName { get; set; }

    [MaxLength(20)]
    public required string LastName { get; set; }
    
    //[RegularExpression(@"^(\+[0-9]{1,3})?[0-9]{9,10}$")]
    public required string PhoneNumber { get; set; }
   
    public required string Email { get; set; }
    
    [MinLength(8,ErrorMessage = "Password length must be greater or equal to 8 characters!")]
    public required string Password {get; set; }
    [MinLength(8, ErrorMessage = "Password length must be greater or equal to 8 characters!")]
    public required string ConfirmedPassword { get; set; }



    

    


}