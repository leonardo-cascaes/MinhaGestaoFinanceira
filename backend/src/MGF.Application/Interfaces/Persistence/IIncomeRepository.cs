using MGF.Application.Entities;

namespace MGF.Application.Interfaces.Persistence;

public interface IIncomeRepository : IRepository<Income>
{
    Task<IReadOnlyList<Income>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default);
}
