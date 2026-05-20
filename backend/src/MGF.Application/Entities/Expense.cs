using MGF.Application.Enums;

namespace MGF.Application.Entities;

public class Expense
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public ExpenseType Type { get; set; }
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateOnly Date { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public SubscriptionInfo? Subscription { get; set; }
    public InstallmentInfo? Installment { get; set; }
}
