using Microsoft.AspNetCore.Mvc;

namespace MGF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() =>
        Ok(new
        {
            status = "healthy",
            application = "Minha Gestão Financeira",
            version = "1.0.0",
        });
}
