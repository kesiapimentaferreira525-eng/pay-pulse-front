import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TransactionRequest } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent {
  @Input() loading = false;
  @Output() submitted = new EventEmitter<TransactionRequest>();

  model: { accountId: string; amount: number | null } = { accountId: '', amount: null };

  get amountInvalid(): boolean {
    return this.model.amount === null || Number(this.model.amount) <= 0;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.amountInvalid || this.loading) {
      form.control.markAllAsTouched();
      return;
    }
    this.submitted.emit({ accountId: this.model.accountId.trim(), amount: Number(this.model.amount) });
  }

  reset(form: NgForm): void {
    form.resetForm();
    this.model = { accountId: '', amount: null };
  }
}
