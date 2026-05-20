using MGF.Application.Entities;
using MGF.Application.Interfaces.Persistence;
using MGF.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MGF.Infrastructure.Repositories;

public class ExpenseRepository(MgfDbContext context) : IExpenseRepository
{
    public async Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await context.Expenses
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Expense>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.Expenses.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Expense>> GetByMonthAsync(int month, int year, CancellationToken cancellationToken = default) =>
        await context.Expenses
            .AsNoTracking()
            .Where(e => e.Month == month && e.Year == year)
            .OrderBy(e => e.Date)
            .ToListAsync(cancellationToken);

    public async Task<Expense> AddAsync(Expense entity, CancellationToken cancellationToken = default)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        context.Expenses.Add(entity);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task UpdateAsync(Expense entity, CancellationToken cancellationToken = default)
    {
        context.Expenses.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await context.Expenses.FindAsync([id], cancellationToken);
        if (entity is null)
            return;

        context.Expenses.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}
