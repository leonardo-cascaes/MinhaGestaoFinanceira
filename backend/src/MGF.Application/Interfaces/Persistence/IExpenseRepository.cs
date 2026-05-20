using MGF.Application.Entities;

namespace MGF.Application.Interfaces.Persistence;

public interface IExpenseRepository : IRepository<Expense>
{
    Task<IReadOnlyList<Expense>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default);
}
