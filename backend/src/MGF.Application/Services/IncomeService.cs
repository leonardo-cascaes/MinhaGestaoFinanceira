using MGF.Application.Entities;
using MGF.Application.Interfaces.Persistence;
using MGF.Application.Interfaces.Services;

namespace MGF.Application.Services;

public class IncomeService(IIncomeRepository repository) : IIncomeService
{
    public Task<IReadOnlyList<Income>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default) =>
        repository.GetByMonthAsync(month, year, cancellationToken);

    public Task<Income?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.GetByIdAsync(id, cancellationToken);

    public Task<Income> CreateAsync(Income income, CancellationToken cancellationToken = default) =>
        repository.AddAsync(income, cancellationToken);

    public Task UpdateAsync(Income income, CancellationToken cancellationToken = default) =>
        repository.UpdateAsync(income, cancellationToken);

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.DeleteAsync(id, cancellationToken);
}
