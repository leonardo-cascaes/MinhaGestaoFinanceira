using MGF.Application.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MGF.Infrastructure.Data.Configurations;

public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> builder)
    {
        builder.ToTable("expenses");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Description).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Amount).HasPrecision(18, 2);
        builder.Property(e => e.Notes).HasMaxLength(1000);

        builder.OwnsOne(e => e.Subscription, subscription =>
        {
            subscription.ToTable("expenses");
        });

        builder.OwnsOne(e => e.Installment, installment =>
        {
            installment.ToTable("expenses");
            installment.OwnsMany(i => i.AdvancePayments);
        });
    }
}
