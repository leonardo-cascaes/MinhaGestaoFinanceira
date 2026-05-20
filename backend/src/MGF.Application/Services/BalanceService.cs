using MGF.Application.Entities;
using MGF.Application.Interfaces.Persistence;
using MGF.Application.Interfaces.Services;

namespace MGF.Application.Services;

public class BalanceService(
    IIncomeRepository incomeRepository,
    IExpenseRepository expenseRepository) : IBalanceService
{
    public async Task<MonthlyBalance> GetMonthlyBalanceAsync(int month, int year, CancellationToken cancellationToken = default)
    {
        var incomes = await incomeRepository.GetByMonthAsync(month, year, cancellationToken);
        var expenses = await expenseRepository.GetByMonthAsync(month, year, cancellationToken);

        var totalIncome = incomes.Sum(i => i.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var balance = totalIncome - totalExpenses;
        var savingsRate = totalIncome > 0 ? balance / totalIncome : 0m;

        return new MonthlyBalance
        {
            Month = month,
            Year = year,
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            Balance = balance,
            SavingsRate = savingsRate,
            AccumulatedBalance = balance, // evolução acumulada será refinada com histórico completo
        };
    }

    public Task<IReadOnlyList<MonthlyBalance>> GetEvolutionAsync(int months, CancellationToken cancellationToken = default)
    {
        // Implementação futura: percorrer meses e compor saldo acumulado
        IReadOnlyList<MonthlyBalance> empty = [];
        return Task.FromResult(empty);
    }
}
