using MGF.Application.Enums;

namespace MGF.Application.Entities;

public class InstallmentInfo
{
    public int TotalInstallments { get; set; }
    public int CurrentInstallment { get; set; }
    public decimal InstallmentAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public int StartMonth { get; set; }
    public int StartYear { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public List<AdvancePaymentInfo> AdvancePayments { get; set; } = [];
}
