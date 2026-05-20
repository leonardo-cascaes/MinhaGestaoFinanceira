using Microsoft.Extensions.DependencyInjection;
using MGF.Application.Interfaces.Services;
using MGF.Application.Services;

namespace MGF.Application.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IIncomeService, IncomeService>();
        services.AddScoped<IBalanceService, BalanceService>();

        return services;
    }
}
