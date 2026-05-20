using Microsoft.OpenApi;

namespace MGF.Api.Extensions;

public static class SwaggerServiceCollectionExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "MGF API",
                Version = "v1",
                Description = "API da Minha Gestão Financeira",
            });
        });

        return services;
    }

    public static WebApplication UseSwaggerDocumentation(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
            return app;

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "MGF API v1");
            options.RoutePrefix = "swagger";
            options.DocumentTitle = "MGF API — Swagger";
        });

        return app;
    }
}
