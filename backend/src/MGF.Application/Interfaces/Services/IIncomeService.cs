using MGF.Application.Entities;

namespace MGF.Application.Interfaces.Services;

public interface IIncomeService
{
    Task<IReadOnlyList<Income>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default);
    Task<Income?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Income> CreateAsync(Income income, CancellationToken cancellationToken = default);
    Task UpdateAsync(Income income, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
