using Neo4j.Driver;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography.Xml;
using System.Text.Json.Serialization;
using static EasyStay.Controllers.GuestController;
using static EasyStay.Controllers.RoomController;

public interface INeo4jService
{
    // Hotel
    Task AddHotelAsync(Hotel hotel);
    Task<Hotel> GetRoomsOfHotelByIdAsync(int id);
    Task<Hotel> GetHotelByIdAsync(int id);
    
    Task<IEnumerable<Hotel>> GetAllHotelsAsync();
    Task DeleteHotelAsync(int hotelId);
    Task UpdateHotelAsync(int id, Hotel hotel);
    Task<bool> CheckFollowingAsync(int HotelID, int GuestID);
    //Room
    Task AddRoomToHotelAsync(int hotelId, Room room, List<string> preference, List<string> services);
    Task<IEnumerable<Room>> GetAllRoomsAsync();
    Task<Room> GetRoomByIdAsync(int id);
    Task UpdateRoomAsync(int id, AddRoomRequest2 req);
    Task<IEnumerable<Room>> GetRoomsWithPreferencesAndServicesAsync(FilterRequestRoom req,int HotelID,int poCemu);
    Task<IEnumerable<GuestPreferences>> GetRoomCategoriesAsync(int id);
    Task<IEnumerable<Service>> GetRoomServicesAsync(int id);
    Task DeleteRoomAsync(int id);
     //Guest
    Task RegisterAsync(RegisterRequest registerRequest);
    Task<Guest> GetUserByEmailAndPassAsync(string email,string pass);
    Task<IEnumerable<Usluga>> GetUserServicesAsync(int id);
    Task<IEnumerable<string>> GetCategoriesAsync(int id);
    

    Task<IEnumerable<Hotel>> FilterHotelsAsync(int id, FilterRequest req, int poCemu);
    Task AddServicesToUserAsync(int id, List<string> services);
    Task RemoveServiceFromUserAsync(int id, string services);
    //hotel
    Task FollowHotelAsync(int GuestID, int HotelID);
    Task UnFollowHotelAsync(int GuestID, int HotelID);
    Task<IEnumerable<Hotel>> RecomendedHotelsAsync(string email, string password);
    Task<IEnumerable<Hotel>> FollowedHotelsAsync(int id);
    //ADMIN
    Task<IEnumerable<Hotel>> AdminHotelsAsync(int id);
    Task<IEnumerable<Hotel>> FilterHotelsOwnerAsync(int GustID,string HotelID);
    //room
    Task ReservateRoomAsync(int GuestID, int RoomID);
    Task UpdateGuestAsync(int id, Niz g);
    Task CancelReservationAsync(int GuestID, int RoomID);
     Task<IEnumerable<Room>> ReservedRoomsAsync(int id);


    Task DeleteUserAsync(int id);

    // ...

}


public class Neo4jService : INeo4jService
{

    private readonly IDriver _driver;

    public Neo4jService(string uri, string user, string password)
    {
        _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(user, password));
    }
    //HOTEL
    //create
    public async Task AddHotelAsync(Hotel hotel)
    {
        var session = _driver.AsyncSession();
        DateTime now = DateTime.Now;
        int unixTimestamp = (int)(now.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("CREATE (h:Hotel {id: $ID, name: $Name, numberOfRooms: $NumberORooms,country:$Country, location: $Location, administrator: $Administrator, opis: $OpisHotela, cenaZa7Dana:$CenaZa7Dana, ocena: $Ocena})",
                    new { ID =unixTimestamp, Name = hotel.Name, NumberORooms = hotel.NumberORooms, Country = hotel.Country, Location = hotel.Location, Administrator = hotel.Administrator, OpisHotela = hotel.OpisHotela, CenaZa7Dana = hotel.CenaZa7Dana, Ocena = hotel.Ocena });
                await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (h:Hotel {id: $HotelID}) MERGE (g)-[:IS_OWNER ]->(h)", new { GuestID = hotel.Administrator, HotelID =unixTimestamp });

            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }



    //read

    public async Task<IEnumerable<Hotel>> GetAllHotelsAsync()
    {
        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (h:Hotel)-[:HAS_ROOMS]->(r:Room) RETURN h, collect(r) as rooms");
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();
                    var roomNodes = reader.Current["rooms"].As<List<INode>>();

                    hotels.Add(new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),
                        Rooms = roomNodes.Select(roomNode => new Room
                        {
                            NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                            ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                            RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                            PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                            RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                            RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                            Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default

                        }).ToList()
                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;
    }

    public async Task<Hotel> GetRoomsOfHotelByIdAsync(int id)
    {
        Hotel hotel = null;
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (h:Hotel{id:$id})-[:HAS_ROOMS]->(r:Room) RETURN h, collect(r) as rooms", new { id = id });
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();
                    var roomNodes = reader.Current["rooms"].As<List<INode>>();

                    hotel = new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),
                        Rooms = roomNodes.Select(roomNode => new Room
                        {
                            NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                            ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                            RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                            PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                            RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                            RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                            Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default

                        }).ToList()
                    };
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotel;
    }
    public async Task<Hotel> GetHotelByIdAsync(int id)
    {
        Hotel hotel = null;
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.id=$id RETURN h;", new { id = id });
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();


                    hotel = new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),

                    };
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotel;
    }

     public async Task<bool> CheckFollowingAsync(int HotelID, int GuestID)
    {
        bool prati = false;
        var session = _driver.AsyncSession();
        try
        {
            Hotel hotel = null;
            await session.ExecuteWriteAsync(async tx =>
            {
                var reader=await tx.RunAsync("MATCH (g:Guest{id:$GuestID}) -[rel:FOLLOWS]->(h:Hotel{id:$HotelID}) return h", new { GuestID=GuestID,HotelID=HotelID });
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();


                    hotel = new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),

                    };
                }
                if (hotel != null)
                    prati = true;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
        return prati;

    }

    

    //update 
    public async Task UpdateHotelAsync(int id, Hotel hotel)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("MATCH (h:Hotel {id: $id}) SET h.numberOfRooms = $NumberOfRooms, h.country=$Country,h.administrator = $Administrator, h.opis = $OpisHotela, h.cenaZa7Dana = $CenaZa7Dana, h.ocena = $Ocena",
                    new { id = id, NumberOfRooms = hotel.NumberORooms, Country = hotel.Country, Administrator = hotel.Administrator, OpisHotela = hotel.OpisHotela, CenaZa7Dana = hotel.CenaZa7Dana, Ocena = hotel.Ocena });
                

            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    //delete 

    public async Task DeleteHotelAsync(int hotelId)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                // Brisemo sve sobe povezane sa datim hotelom
                var deleteRoomsQuery = "MATCH (h:Hotel {id: $HotelID})-[:HAS_ROOM]->(r:Room) DELETE r";
                await tx.RunAsync(deleteRoomsQuery, new { HotelID = hotelId });
                var deleteFollowQuery = "MATCH (h:Hotel {id: $HotelID})<-[rel:FOLLOWS]->(r:Room) DETACH DELETE rel";
                await tx.RunAsync(deleteFollowQuery, new { HotelID = hotelId });
                var deleteOwnerQuery = "MATCH (h:Hotel {id: $HotelID})<-[rel:IS_OWNER]->(g:Guest) DETACH DELETE rel";
                await tx.RunAsync(deleteOwnerQuery, new { HotelID = hotelId });
                // Brisemo i sam hotel kao i njegove veze 
                var deleteHotelQuery = "MATCH (h:Hotel {id: $HotelID}) DETACH DELETE h";
                await tx.RunAsync(deleteHotelQuery, new { HotelID = hotelId });
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }



    //ROOM
    public int racunaj(string sta)
    {
    
        int cena;
        switch(sta)
        {
            case "SingleRoom":
                cena = 30;
                break;

            case "DoubleRoom":
                cena = 40;
                break;
            case "Suite":
                cena = 20;
                break;
            case "DeluxeRoom":
                cena = 100;
                break;
            case "FamilyRoom":
                cena = 80;
                break;
            case "TwinRoom":
                cena = 15;
                break;
            case "Studio":
                cena = 10;
                break;
            case "Apartment":
                cena = 15;
                break;
            case "Villa":
                cena = 300;
                break;
            case "Bungalow":
                cena = 90;
                break;
            case "Room for kids":
                cena = 45;
                break;
            case "Additional beds":
                cena = 3;
                break;
            case "For persons with dissabilities":
                cena = 15;
                break;
            case "NoRestrictions food":
                cena = 40;
                break;
            case "Vegeterian food":
                cena = 80;
                break;
            case "Vegan food":
                cena = 30;
                break;
            case "GlutenFree food":
                cena = 30;
                break;
            case "Keto food":
                cena = 30;
                break;
            case "LactoseFree food":
                cena = 30;
                break;
            case "NutAllergy food":
                cena = 30;
                break;
            case "Sport":
                cena = 70;
                break;
            case "Swimming":
                cena = 70;
                break;
            case "Fitness":
                cena = 70;
                break;
            case "Hiking":
                cena = 30;
                break;
            case "Sightseeing":
                cena = 70;
                break;
            case "Shopping":
                cena = 100;
                break;
            case "FineDining":
                cena = 80;
                break;
            case "Nightlife":
                cena = 80;
                break;
            case "CulturalTours":
                cena = 20;
                break;
            case "HighFloor":
                cena = 30;
                break;
            case "SeaView":
                cena = 30;
                break;
            case "GardenView":
                cena = 310;
                break;
            case "Poolside":
                cena = 15;
                break;
            case "CityView":
                cena = 40;
                break;
            case "QuietArea":
                cena = 40;
                break;
            case "NearElevator":
                cena = 40;
                break;
            case "NearRestaurant":
                cena = 40;
                break;
            case "NearBeach":
                cena = 40;
                break;
            case "PanoramicView":
                cena = 40;
                break;
            case "Buisnies room":
                cena = 40;
                break;
            case "Pet frendly":
                cena = 40;
                break;
            case "Anniversary":
                cena = 40;
                break;
            case "Birthday":
                cena = 40;
                break;
            case "Honeymoon":
                cena = 40;
                break;
            case "Wedding":
                cena = 40;
                break;
            case "BusinessTrip":
                cena = 40;
                break;
            case "FamilyTrip":
                cena = 40;
                break;
            case "FestivalCelebration":
                cena = 40;
                break;
            case "RomanticTrip":
                cena = 40;
                break;
            case "Restaurant":
                cena = 10;
                break;
            case "Pool":
                cena = 20;
                break;
            case "Spa":
                cena = 30;
                break;
            case "FitnessCenter":
                cena = 40;
                break;
            case "ConferenceRoom":
                cena = 60;
                break;
            case "Parking":
                cena = 70;
                break;
            case "Bar":
                cena = 80;
                break;
            case "RoomService":
                cena = 90;
                break;
            case "Laundry":
                cena = 100;
                break;
            case "ShuttleService":
                cena = 110;
                break;
            case "BusinessCenter":
                cena = 120;
                break;
            case "Concierge":
                cena = 120;
                break;
            case "WiFi":
                cena = 0;
                break;
            case "ChildCare":
                cena = 1;
                break;
            case "Sauna":
                cena = 3;
                break;
            case "Massage":
                cena = 4;
                break;
            case "PetCare":
                cena = 5;
                break;
            default:
                cena = 0;
                break;
        }
        return cena;
    }

    //create
    public async Task AddRoomToHotelAsync(int hotel, Room room, List<string> preference, List<string> services)
    {
        var session = _driver.AsyncSession();
        DateTime now = DateTime.Now;
        int unixTimestamp = (int)(now.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("CREATE (r:Room {id: $ID, numberOfRoom: $NumberOfRoom, roomType:$RoomType, pricePerNight: $PricePerNight, roomCapacity: $RoomCapacity, roomStatus: $RoomStatus,  hotel: $Hotel})",
                    new
                    {

                        ID = unixTimestamp,
                        NumberOfRoom = room.NumberOfRoom,
                        RoomType = room.RoomType.ToString(),
                        PricePerNight = room.PricePerNight,
                        RoomCapacity = room.RoomCapacity,
                        RoomStatus = room.RoomStatus.ToString(),

                        Hotel = hotel
                    });
                await tx.RunAsync("MATCH (h:Hotel {id: $hotel}), (r:Room {id: $idSobe}) MERGE (h)-[:HAS_ROOMS ]->(r) return r.id", new { hotel = hotel, idSobe = unixTimestamp });
                foreach (string s in services)
                {
                    int cena = racunaj(s);
                    await tx.RunAsync("MATCH (r:Room {id:$id}) MERGE (s:Service {naziv:$vrstaUsluge}) ON CREATE SET s.naziv = $vrstaUsluge, s.price = $price MERGE (r)-[:HAS_SERVICE]->(s) ", new { id = unixTimestamp, vrstaUsluge = s, price = cena });

                }
                foreach (string p in preference)
                {
                    int cena = racunaj(p);
                    await tx.RunAsync("MATCH (r:Room {id: $id}) MERGE (p:GuestPreferences {naziv: $vrstaKriterijuma}) ON  CREATE SET p.naziv= $vrstaKriterijuma, p.price= $price MERGE (r)-[:HAS_PREFERENCE]->(p) ", new { id = unixTimestamp, vrstaKriterijuma = p, price = cena });

                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    //read
    public async Task<Room> GetRoomByIdAsync(int id)
    {
        Room room = null;
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (r:Room{id:$id}) WHERE r.id=$id RETURN r;", new { id = id });
                while (await reader.FetchAsync())
                {
                    var roomNode = reader.Current["r"].As<INode>();


                    room = new Room
                    {
                        ID = roomNode.Properties["id"].As<int>(),
                        NumberOfRoom = roomNode.Properties["numberOfRoom"].As<int>(),
                        RoomType = roomNode.Properties["roomType"].As<string>(),
                        PricePerNight = roomNode.Properties["pricePerNight"].As<int>(),
                        RoomCapacity = roomNode.Properties["roomCapacity"].As<int>(),
                        RoomStatus = roomNode.Properties["roomStatus"].As<string>(),
                        Hotel = roomNode.Properties["hotel"].As<int>()


                    };
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return room;
    }
    public async Task<IEnumerable<Room>> GetAllRoomsAsync()
    {
        var rooms = new List<Room>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (h:Hotel)-[:HAS_ROOMS]->(r:Room) RETURN r");
                while (await reader.FetchAsync())
                {
                    var roomNode = reader.Current["r"].As<INode>();

                    rooms.Add(new Room
                    {


                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return rooms;

    }
    
    public async Task<IEnumerable<GuestPreferences>> GetRoomCategoriesAsync(int id)
    {
        List<GuestPreferences> preferences = new List<GuestPreferences>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (r:Room {id:$RoomID})-[:HAS_PREFERENCE]->(g:GuestPreferences) RETURN g;", new { RoomID = id });
                while (await reader.FetchAsync())
                {
                    var preferenceNode = reader.Current["g"].As<INode>();

                    preferences.Add(new GuestPreferences
                    {


                       VrstaKriterijuma = preferenceNode.Properties.ContainsKey("naziv") ? preferenceNode.Properties["naziv"].As<string>() : "NULL",
                       Cena = preferenceNode.Properties.ContainsKey("price") ? preferenceNode.Properties["price"].As<int>() : default



                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return preferences;
    }

    public async Task<IEnumerable<Service>> GetRoomServicesAsync(int id)
    {
        List<Service> services = new List<Service>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (r:Room {id:$RoomID})-[:HAS_SERVICE]->(s:Service) RETURN s;", new { RoomID = id });
                while (await reader.FetchAsync())
                {
                    var preferenceNode = reader.Current["s"].As<INode>();

                    services.Add(new Service
                    {


                        VrstaUsluge = preferenceNode.Properties.ContainsKey("naziv") ? preferenceNode.Properties["naziv"].As<string>() : "NULL",
                        Cena = preferenceNode.Properties.ContainsKey("price") ? preferenceNode.Properties["price"].As<int>() : default



                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return services;
    }

   public async Task<IEnumerable<Room>> ReservedRoomsAsync(int id)
    {
        var rooms = new List<Room>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH  (g:Guest {id: $GuestID})-[:RESERVATES ]->(r:Room) RETURN r", new { GuestID = id });

                while (await reader.FetchAsync())
                {
                    var roomNode = reader.Current["r"].As<INode>();

                    rooms.Add(new Room
                    {


                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return rooms;
    }
    //update 
    public async Task UpdateRoomAsync(int id, AddRoomRequest2 req)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("MATCH (r:Room {id: $id}) SET r.numberOfRoom = $NumberOfRoom, r.roomType = $RoomType, r.pricePerNight = $PricePerNight, r.roomCapacity = $RoomCapacity, r.roomStatus = $RoomStatus",
                 new { id = id, NumberOfRoom = req.Room.NumberOfRoom, RoomType = req.Room.RoomType.ToString(), PricePerNight = req.Room.PricePerNight, RoomCapacity = req.Room.RoomCapacity, RoomStatus = req.Room.RoomStatus.ToString() });

                var deleteRoomsQuery1 = "MATCH (r:Room {id: $RoomID})-[rel:HAS_PREFERENCE]->(p:GuestPreferences) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { RoomID = id });
                var deleteRoomsQuery2 = "MATCH (r:Room {id: $RoomID})-[rel:HAS_SERVICE]->(s:Service) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery2, new { RoomID = id });
                foreach (string s in req.Services)
                {
                    await tx.RunAsync("MATCH (r:Room {id: $id}) MERGE (s:Service {naziv: $vrstaUsluge, price: $price}) MERGE (r)-[:HAS_SERVICE]->(s) ", new { id = req.Room.ID, vrstaUsluge = s, price = 10 });

                }
                foreach (string p in req.Preferences)
                {
                    await tx.RunAsync("MATCH (r:Room {id: $id}) MERGE (p:GuestPreferences {naziv: $vrstaKriterijuma, price: $price}) MERGE (r)-[:HAS_PREFERENCE]->(p) ", new { id = req.Room.ID, vrstaKriterijuma = p, price = 10 });

                }
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }
    //delete
    public async Task DeleteRoomAsync(int id)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                // Brisemo sve sobe povezane sa datim hotelom
                var deleteRoomsQuery1 = "MATCH (r:Room {id: $RoomID})-[rel:HAS_PREFERNCE]->(p:GuestPreferences) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { RoomID = id });
                var deleteRoomsQuery2 = "MATCH (r:Room {id: $RoomID})-[rel:HAS_SERVICE]->(s:Service) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery2, new { RoomID = id });
                var deleteRoomsQuery3 = "MATCH (h:Hotel )-[rel:HAS_ROOMS]->(r:Room {id: $RoomID}) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery3, new { RoomID = id });

                // Brisemo i sam hotel kao i njegove veze 
                var deleteHotelQuery = "MATCH (r:Room {id: $RoomID}) DETACH DELETE r";
                await tx.RunAsync(deleteHotelQuery, new { RoomID = id });
            });
        }
        finally
        {
            await session.CloseAsync();
        }

    }


    //GUEST

    //register
    public async Task RegisterAsync(RegisterRequest registerRequest)
    {
        var session = _driver.AsyncSession();
        DateTime now = DateTime.Now;
        int unixTimestamp = (int)(now.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("CREATE (g:Guest {id: $ID, firstName: $FirstName, lastName:$LastName, phoneNumber: $PhoneNumber, email: $Email, password: $Password,  confirmedPassword: $ConfirmedPassword})",
                   new
                   {

                       ID =unixTimestamp,
                       FirstName = registerRequest.Guest.FirstName,
                       LastName = registerRequest.Guest.LastName,
                       PhoneNumber = registerRequest.Guest.PhoneNumber,
                       Email = registerRequest.Guest.Email,
                       Password = registerRequest.Guest.Password,
                       ConfirmedPassword = registerRequest.Guest.ConfirmedPassword

                   });

                foreach (string p in registerRequest.Preferences)
                {
                    await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (p:GuestPreferences {naziv: $Naziv}) CREATE (g)-[:HAS_PREFERENCE ]->(p)", new { GuestID = unixTimestamp, Naziv = p });

                }
            });
        }
        finally
        {
            await session.CloseAsync();
        }

    }

    //login
    public async Task<Guest> GetUserByEmailAndPassAsync(string email, string pass)
    {
        Guest guest = null;
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (g:Guest) WHERE g.email=$Email and g.password=$Password RETURN g;", new { Email = email, Password = pass });
                while (await reader.FetchAsync())
                {
                    var guestNode = reader.Current["g"].As<INode>();


                    guest = new Guest
                    {
                        ID = guestNode.Properties["id"].As<int>(),
                        FirstName = guestNode.Properties["firstName"].As<string>(),
                        LastName = guestNode.Properties["lastName"].As<string>(),
                        PhoneNumber = guestNode.Properties["phoneNumber"].As<string>(),
                        Email = guestNode.Properties["email"].As<string>(),
                        Password = guestNode.Properties["password"].As<string>(),
                        ConfirmedPassword = guestNode.Properties["confirmedPassword"].As<string>(),

                    };
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return guest;
    }

    

    //follow
    public async Task FollowHotelAsync(int GuestID, int HotelID)
    {

        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {



                await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (h:Hotel {id: $HotelID}) CREATE (g)-[:FOLLOWS ]->(h)", new { GuestID = GuestID, HotelID = HotelID });


            });
        }
        finally
        {
            await session.CloseAsync();
        }


    }

    public async Task UnFollowHotelAsync(int GuestID, int HotelID)
    {

        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {



                await tx.RunAsync("MATCH (g:Guest {id: $GuestID})-[rel:FOLLOWS ]->(h:Hotel {id: $HotelID}) DETACH DELETE rel", new { GuestID = GuestID, HotelID = HotelID });


            });
        }
        finally
        {
            await session.CloseAsync();
        }


    }
    //recomended rooms
    public async Task<IEnumerable<Hotel>> RecomendedHotelsAsync(string email, string password)
    {
        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (h:Hotel)-[:HAS_ROOMS]->(r:Room)-[:HAS_PREFERENCE]->(preference:GuestPreferences)<-[:HAS_PREFERENCE]-(g:Guest{email:$Email,password:$Password}) WHERE NOT (g)-[:FOLLOWS]->(h) RETURN h, collect(r) as rooms", new { Email = email, Password = password });
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();
                    var roomNodes = reader.Current["rooms"].As<List<INode>>();

                    hotels.Add(new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),
                        Rooms = roomNodes.Select(roomNode => new Room
                        {
                            NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                            ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                            RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                            PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                            RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                            RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                            Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default

                        }).ToList()
                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;

    }
  
    //prefered categories
    public async Task<IEnumerable<string>> GetCategoriesAsync(int id)
    {
        var categories = new List<string>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (preference:GuestPreferences)<-[:HAS_PREFERENCE]-(g:Guest{id:$ID}) RETURN preference", new { ID=id });
                while (await reader.FetchAsync())
                {
                    var preferenceNode = reader.Current["preference"].As<INode>();


                    categories.Add(preferenceNode.Properties["naziv"].As<string>());


                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return categories;

    }

    //followed hotels
    public async Task<IEnumerable<Hotel>> FollowedHotelsAsync(int id)
    {
        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH  (g:Guest {id: $GuestID})-[:FOLLOWS ]->(h) RETURN h", new { GuestID = id});
                
                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();
                    
                    
                    hotels.Add(new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),
                       
                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;
    }
    // filter hotels
    public async Task<IEnumerable<Hotel>> FilterHotelsAsync(int id,FilterRequest req,int poCemu)
    {

        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
               
                switch(poCemu)
                {
                    //filter po imenu
                    case 0:
                        {
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.name=$Name RETURN h", new { Name = req.Name });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;

                        }
                    case 1:
                        {
                            //filter po zemlji
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.country=$Country RETURN h", new { Country = req.Country });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;

                        }
                    case 2:
                        {
                            //filter po oceni
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.ocena=$Ocena RETURN h", new { Ocena = req.Ocena });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;
                        
                        }
                    case 3:
                        {
                            
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.cenaZa7Dana=$CenaZa7Dana RETURN h", new { CenaZa7Dana = req.Price });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;

                        }
                    case 4:
                        {
                            //filter po zemlji i oceni
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.country=$Country AND h.ocena=$Ocena RETURN h", new { Country = req.Country,Ocena=req.Ocena });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;
                        }
                    case 5:
                        {
                            //filter po zemlji i ceni
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.country=$Country AND h.cenaZa7Dana=$CenaZa7Dana RETURN h", new { Country = req.Country, CenaZa7Dana = req.Price });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;
                        }
                    case 6:
                        {
                            //filter po  oceni i ceni
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.ocena=$Ocena AND h.cenaZa7Dana=$CenaZa7Dana RETURN h", new { Ocena = req.Ocena, CenaZa7Dana = req.Price });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;
                        }
                    case 7:
                        {
                            //filter po  oceni i ceni i zemlji
                            var reader = await tx.RunAsync("MATCH (h:Hotel) WHERE h.ocena=$Ocena AND h.cenaZa7Dana=$CenaZa7Dana AND h.country=$Country RETURN h", new { Ocena = req.Ocena, CenaZa7Dana = req.Price,Country=req.Country });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                            }
                            break;
                        }

                    default:
                        break;
                }
                

            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;
    }
    //reservate room
    public async Task ReservateRoomAsync(int GuestID, int RoomID)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {



                await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (r:Room {id: $RoomID}) MERGE (g)-[:RESERVATES ]->(r)", new { GuestID = GuestID, RoomID = RoomID });
                await tx.RunAsync("MATCH (r:Room {id: $RoomID})  SET r.roomStatus = 'already reservate'", new { GuestID = GuestID, RoomID = RoomID });


            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }
   //add service
   public async Task AddServicesToUserAsync(int id, List<string> services)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
               

                foreach (string s in services)
                {
                    await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (s:Service {naziv: $Naziv}) CREATE (g)-[:HAS_SERVICE ]->(s)", new { GuestID = id, Naziv = s });

                }
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }
   
    //remove service
    public async Task RemoveServiceFromUserAsync(int id, string services)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {



                var deleteRoomsQuery1 = "MATCH (g:Guest {id: $GuestID})-[rel:HAS_SERVICE]->(s:Service{naziv:$Naziv}) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { GuestID = id, Naziv = services });



            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }
    //read services
    public async Task<IEnumerable<Usluga>> GetUserServicesAsync(int id)
    {
        var usluge= new List<Usluga>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH (g:Guest{id:$GuestID})-[:HAS_SERVICE]->(s:Service)<-[:HAS_SERVICE]-(r:Room) MATCH (h:Hotel)-[:HAS_ROOMS]->(r)<-[:RESERVATES]-(g) return s,r,h", new { GuestID = id });

                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();
                    var serviceNode = reader.Current["s"].As<INode>();
                    var roomNode = reader.Current["r"].As<INode>();


                    usluge.Add(new Usluga
                    {
                       
                        Name = serviceNode.Properties["naziv"].As<string>(),
                        Price = serviceNode.Properties["price"].As<int>(),
                        NumberOfRoom = roomNode.Properties["numberOfRoom"].As<int>(),
                        Hotel = hotelNode.Properties["name"].As<string>()


                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return usluge;
    }
    //filter rooms
    public async Task<IEnumerable<Room>> GetRoomsWithPreferencesAndServicesAsync(FilterRequestRoom req, int HotelID, int poCemu)
    {

        var rooms = new List<Room>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {

                switch (poCemu)
                {
                    //filter po kategorijama
                    case 0:
                        {
                            foreach (string kategorija in req.Preferences)
                            {
                                var reader = await tx.RunAsync("MATCH(h:Hotel{id:$HotelID})-[:HAS_ROOMS]->(r:Room)       MATCH (r:Room)-[:HAS_PREFERENCE]->(gp:GuestPreferences{naziv:$Name}) return r", new {HotelID=HotelID, Name = kategorija });

                                while (await reader.FetchAsync())
                                {
                                    var roomNode = reader.Current["r"].As<INode>();

                                    rooms.Add(new Room
                                    {


                                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                                    });
                                }
                            }
                            break;

                        }
                    //filter po uslugama
                    case 1:
                        {
                            foreach (string usluga in req.Services)
                            {
                                var reader = await tx.RunAsync("MATCH(h:Hotel{id:$HotelID})-[:HAS_ROOMS]->(r:Room)      MATCH (r)-[:HAS_SERVICE]->(s:Service{naziv:$Name}) return r", new { HotelID = HotelID, Name = usluga });

                                while (await reader.FetchAsync())
                                {
                                    var roomNode = reader.Current["r"].As<INode>();

                                    rooms.Add(new Room
                                    {


                                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                                    });
                                }
                            }
                            break;

                        }
                    case 2:
                        {
                            foreach (string kategorija in req.Preferences)
                            {
                                var reader = await tx.RunAsync("MATCH(h:Hotel{id:$HotelID})-[:HAS_ROOMS]->(r:Room)   MATCH (r:Room)-[:HAS_PREFERENCE]->(gp:GuestPreferences{naziv:$Name}) return r", new { HotelID = HotelID, Name = kategorija });

                                while (await reader.FetchAsync())
                                {
                                    var roomNode = reader.Current["r"].As<INode>();

                                    rooms.Add(new Room
                                    {


                                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                                    });
                                }
                            }
                            foreach (string usluga in req.Services)
                            {
                                var reader = await tx.RunAsync("MATCH(h:Hotel{id:$HotelID})-[:HAS_ROOMS]->(r:Room) MATCH (r)-[:HAS_SERVICE]->(s:Service{naziv:$Name}) return r", new { HotelID = HotelID, Name = usluga });

                                while (await reader.FetchAsync())
                                {
                                    var roomNode = reader.Current["r"].As<INode>();

                                    rooms.Add(new Room
                                    {


                                        NumberOfRoom = roomNode.Properties.ContainsKey("numberOfRoom") ? roomNode.Properties["numberOfRoom"].As<int>() : default,
                                        ID = roomNode.Properties.ContainsKey("id") ? roomNode.Properties["id"].As<int>() : default,
                                        RoomType = roomNode.Properties.ContainsKey("roomType") ? roomNode.Properties["roomType"].As<string>() : "SingleRoom",
                                        PricePerNight = roomNode.Properties.ContainsKey("pricePerNight") ? roomNode.Properties["pricePerNight"].As<int>() : default,
                                        RoomCapacity = roomNode.Properties.ContainsKey("roomCapacity") ? roomNode.Properties["roomCapacity"].As<int>() : default,
                                        RoomStatus = roomNode.Properties.ContainsKey("roomStatus") ? roomNode.Properties["roomStatus"].As<string>() : "ferr",

                                        Hotel = roomNode.Properties.ContainsKey("hotel") ? roomNode.Properties["hotel"].As<int>() : default


                                    });
                                }
                            }
                            break;

                        }



                    default:
                        break;
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return rooms;
    }
    public async Task CancelReservationAsync(int GuestID, int RoomID)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {



                var deleteRoomsQuery1 = "MATCH (g:Guest {id: $GuestID})-[rel:RESERVATES]->(r:Room{id:$RoomID}) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { GuestID = GuestID, RoomID = RoomID });
                await tx.RunAsync("MATCH (r:Room {id: $RoomID})  SET r.roomStatus = 'free'", new { GuestID = GuestID, RoomID = RoomID });


            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    //update
    public async Task UpdateGuestAsync(int id, Niz lista)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {


                var deleteRoomsQuery1 = "MATCH (g:Guest {id: $GuestID})-[rel:HAS_PREFERENCE]->(p:GuestPreferences) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { GuestID = id });


                foreach (string p in lista.lista)
                {
                    await tx.RunAsync("MATCH (g:Guest {id: $GuestID}), (p:GuestPreferences {naziv: $Naziv}) MERGE (g)-[:HAS_PREFERENCE ]->(p)", new { GuestID = id, Naziv = p });

                }
            });
        }
        finally
        {
            await session.CloseAsync();
        }

    }


    //delete
    public async Task DeleteUserAsync(int id)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                // Brisemo sve sobe povezane sa datim hotelom
                var deleteRoomsQuery1 = "MATCH (g:Guest {id: $id})-[rel:RESERVATES]->(r:Room) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery1, new { id = id });
                var deleteRoomsQuery2 = "MATCH (g:Guest {id: $id})-[rel:FOLLOWS]->(h:Hotel) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery2, new { id = id });
                var deleteRoomsQuery3 = "MATCH (g:Guest )-[rel:HAS_PREFERENCE]->(p:GuestPreference) DETACH DELETE rel";
                await tx.RunAsync(deleteRoomsQuery3, new { id = id });

                // Brisemo i sam hotel kao i njegove veze 
                var deleteHotelQuery = "MATCH (g:Guest {id: $id}) DETACH DELETE g";
                await tx.RunAsync(deleteHotelQuery, new { id = id });
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }


    //ADMIN
    public async Task<IEnumerable<Hotel>> AdminHotelsAsync(int id)
    {
        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {
                var reader = await tx.RunAsync("MATCH  (g:Guest {id:$GuestID})-[:IS_OWNER ]->(h:Hotel) RETURN h", new { GuestID = id });

                while (await reader.FetchAsync())
                {
                    var hotelNode = reader.Current["h"].As<INode>();


                    hotels.Add(new Hotel
                    {
                        ID = hotelNode.Properties["id"].As<int>(),
                        Name = hotelNode.Properties["name"].As<string>(),
                        NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                        Country = hotelNode.Properties["country"].As<string>(),
                        Location = hotelNode.Properties["location"].As<string>(),
                        Administrator = hotelNode.Properties["administrator"].As<int>(),
                        OpisHotela = hotelNode.Properties["opis"].As<string>(),
                        CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                        Ocena = hotelNode.Properties["ocena"].As<int>(),

                    });
                }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;

    }
    public async Task<IEnumerable<Hotel>>  FilterHotelsOwnerAsync(int GuestID,string HotelID)
    {
        var hotels = new List<Hotel>();
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteReadAsync(async tx =>
            {

                
                            var reader = await tx.RunAsync("MATCH (g:Guest{id:$GuestID})-[:IS_OWNER]->(h:Hotel{name:$HotelID})  RETURN h", new { GuestID = GuestID,HotelID=HotelID });

                            while (await reader.FetchAsync())
                            {
                                var hotelNode = reader.Current["h"].As<INode>();


                                hotels.Add(new Hotel
                                {
                                    ID = hotelNode.Properties["id"].As<int>(),
                                    Name = hotelNode.Properties["name"].As<string>(),
                                    NumberORooms = hotelNode.Properties["numberOfRooms"].As<int>(),
                                    Country = hotelNode.Properties["country"].As<string>(),
                                    Location = hotelNode.Properties["location"].As<string>(),
                                    Administrator = hotelNode.Properties["administrator"].As<int>(),
                                    OpisHotela = hotelNode.Properties["opis"].As<string>(),
                                    CenaZa7Dana = hotelNode.Properties["cenaZa7Dana"].As<int>(),
                                    Ocena = hotelNode.Properties["ocena"].As<int>(),

                                });
                           
                            }


            });
        }
        finally
        {
            await session.CloseAsync();
        }

        return hotels;

    }


















































    public void Dispose()
    {
        _driver?.Dispose();
    }
}