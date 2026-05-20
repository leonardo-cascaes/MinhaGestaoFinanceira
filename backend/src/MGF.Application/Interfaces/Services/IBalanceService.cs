using MGF.Application.Entities;

namespace MGF.Application.Interfaces.Services;

public interface IBalanceService
{
    Task<MonthlyBalance> GetMonthlyBalanceAsync(int month, int year, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MonthlyBalance>> GetEvolutionAsync(int months, CancellationToken cancellationToken = default);
}
