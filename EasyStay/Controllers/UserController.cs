using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace EasyStay.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{

    private readonly ILogger<UserController> _logger;
    private readonly INeo4jService _neo4jService;
    private readonly IConfiguration _configuration;
    public UserController(ILogger<UserController> logger, INeo4jService neo4jService, IConfiguration configuration)
    {
        _logger = logger;
        _neo4jService = neo4jService;
        _configuration = configuration;
    }




   
    //#endregion





}





