namespace MGF.Application.Entities;

public class SubscriptionInfo
{
    public bool IsFixed { get; set; }
    public int StartMonth { get; set; }
    public int StartYear { get; set; }
    public int? EndMonth { get; set; }
    public int? EndYear { get; set; }
    public DateOnly? CancelledAt { get; set; }
    public bool IsActive { get; set; }
}
