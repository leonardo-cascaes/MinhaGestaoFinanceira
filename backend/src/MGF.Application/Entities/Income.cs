using MGF.Application.Enums;

namespace MGF.Application.Entities;

public class Income
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public IncomeType Type { get; set; }
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateOnly Date { get; set; }
    public bool Recurring { get; set; }
    public int? RecurringEndMonth { get; set; }
    public int? RecurringEndYear { get; set; }
    public string? Notes { get; set; }
}
