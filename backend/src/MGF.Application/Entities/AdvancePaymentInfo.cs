namespace MGF.Application.Entities;

public class AdvancePaymentInfo
{
    public int InstallmentsAdvanced { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal OriginalAmount { get; set; }
    public decimal Discount { get; set; }
    public DateOnly Date { get; set; }
}
