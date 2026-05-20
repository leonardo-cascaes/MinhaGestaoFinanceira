using MGF.Application.Entities;
using Microsoft.EntityFrameworkCore;

namespace MGF.Infrastructure.Data;

public class MgfDbContext(DbContextOptions<MgfDbContext> options) : DbContext(options)
{
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Income> Incomes => Set<Income>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MgfDbContext).Assembly);
    }
}
