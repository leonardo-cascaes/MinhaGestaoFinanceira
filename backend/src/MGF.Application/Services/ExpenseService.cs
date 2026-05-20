using MGF.Application.Entities;
using MGF.Application.Interfaces.Persistence;
using MGF.Application.Interfaces.Services;

namespace MGF.Application.Services;

public class ExpenseService(IExpenseRepository repository) : IExpenseService
{
    public Task<IReadOnlyList<Expense>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default) =>
        repository.GetByMonthAsync(month, year, cancellationToken);

    public Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.GetByIdAsync(id, cancellationToken);

    public Task<Expense> CreateAsync(Expense expense, CancellationToken cancellationToken = default) =>
        repository.AddAsync(expense, cancellationToken);

    public Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default) =>
        repository.UpdateAsync(expense, cancellationToken);

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        repository.DeleteAsync(id, cancellationToken);
}
