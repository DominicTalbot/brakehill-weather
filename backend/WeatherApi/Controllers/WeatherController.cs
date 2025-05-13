using Microsoft.AspNetCore.Mvc;
using System.Net;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly IConfiguration _config;
    private const string Location = "Downham Market,UK"; // Nearest town to Brake Hill Barns

    public WeatherController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try 
        {
            var apiKey = _config["OpenWeather:ApiKey"]; // Securely get API key from config
            using var client = new HttpClient();
            var url = $"https://api.openweathermap.org/data/2.5/weather?q={Location}&appid={apiKey}&units=metric";
            
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var weatherData = await response.Content.ReadAsStringAsync();
            return Content(weatherData, "application/json");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, $"Weather API error: {ex.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Unexpected error: {ex.Message}");
        }
    }
}