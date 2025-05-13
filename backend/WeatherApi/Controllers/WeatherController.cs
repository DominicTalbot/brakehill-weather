using Microsoft.AspNetCore.Mvc;
using System.Net;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public WeatherController(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try 
        {
            var apiKey = _config["OpenWeather:ApiKey"];
            var url = $"https://api.openweathermap.org/data/2.5/weather?lat=52.597713&lon=0.874447&appid={apiKey}&units=metric";
            
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var weatherData = await response.Content.ReadAsStringAsync();
            return Content(weatherData, "application/json");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                error = "Error fetching weather data",
                details = ex.Message 
            });
        }
    }
}