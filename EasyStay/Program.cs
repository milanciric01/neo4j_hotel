var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<INeo4jService, Neo4jService>(serviceProvider =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    var uri= configuration["Neo4j:Uri"];
    var user = configuration["Neo4j:User"];
    var password = configuration["Neo4j:Password"];
    
    if (string.IsNullOrEmpty(uri) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(password))
    {
        throw new InvalidOperationException("Neo4j configuration is not properly set.");
    }

    return new Neo4jService(uri, user, password); // Assuming these are the parameters expected by your Neo4jService constructor
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS konfiguracija
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        builder
            .WithOrigins("http://localhost:3000") // Replace with your actual frontend origin
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowLocalhost");

app.UseAuthorization();

app.MapControllers();

app.Run();
