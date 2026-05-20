namespace MGF.Application.Entities;

public class MonthlyBalance
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
    public decimal SavingsRate { get; set; }
    public decimal AccumulatedBalance { get; set; }
}
