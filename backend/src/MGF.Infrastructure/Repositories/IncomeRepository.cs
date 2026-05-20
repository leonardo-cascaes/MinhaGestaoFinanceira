using MGF.Application.Entities;
using MGF.Application.Interfaces.Persistence;
using MGF.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MGF.Infrastructure.Repositories;

public class IncomeRepository(MgfDbContext context) : IIncomeRepository
{
    public async Task<Income?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await context.Incomes
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Income>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.Incomes.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Income>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default) =>
        await context.Incomes
            .AsNoTracking()
            .Where(i => i.Month == month && i.Year == year)
            .OrderBy(i => i.Date)
            .ToListAsync(cancellationToken);

    public async Task<Income> AddAsync(Income entity, CancellationToken cancellationToken = default)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        context.Incomes.Add(entity);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task UpdateAsync(Income entity, CancellationToken cancellationToken = default)
    {
        context.Incomes.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await context.Incomes.FindAsync([id], cancellationToken);
        if (entity is null)
            return;

        context.Incomes.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}
