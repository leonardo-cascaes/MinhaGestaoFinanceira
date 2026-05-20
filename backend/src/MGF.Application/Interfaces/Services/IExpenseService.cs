using MGF.Application.Entities;

namespace MGF.Application.Interfaces.Services;

public interface IExpenseService
{
    Task<IReadOnlyList<Expense>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default);
    Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Expense> CreateAsync(Expense expense, CancellationToken cancellationToken = default);
    Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
