import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { TransactionApiService } from '../../../../core/services/transaction-api.service';
import { Transaction, TransactionRequest, TransactionStatus } from '../../../../core/models/transaction.model';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';

type TransactionFilter = 'ALL' | TransactionStatus;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, TransactionFormComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(TransactionApiService);

  @ViewChild(TransactionFormComponent) form?: TransactionFormComponent;

  readonly transactions = signal<Transaction[]>([]);
  readonly loadingList = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly statusFilter = signal<TransactionFilter>('ALL');
  readonly today = new Date();

  readonly totalApproved = computed(() =>
    this.transactions()
      .filter((t) => t.status === 'APPROVED')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );
  readonly totalVolume = computed(() =>
    this.transactions().reduce((sum, t) => sum + Number(t.amount), 0)
  );
  readonly totalPending = computed(() =>
    this.transactions()
      .filter((t) => t.status === 'PENDING')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );
  readonly approvedCount = computed(() =>
    this.transactions().filter((t) => t.status === 'APPROVED').length
  );
  readonly pendingCount = computed(() =>
    this.transactions().filter((t) => t.status === 'PENDING').length
  );
  readonly rejectedCount = computed(() =>
    this.transactions().filter((t) => t.status === 'REJECTED').length
  );
  readonly totalCount = computed(() => this.transactions().length);
  readonly approvalRate = computed(() =>
    this.totalCount() ? (this.approvedCount() / this.totalCount()) * 100 : 0
  );
  readonly averageTicket = computed(() =>
    this.totalCount() ? this.totalVolume() / this.totalCount() : 0
  );
  readonly filteredTransactions = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.transactions().filter((transaction) => {
      const matchesStatus = status === 'ALL' || transaction.status === status;
      const matchesSearch = !query ||
        transaction.accountId.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loadingList.set(true);
    this.api.findAll().subscribe({
      next: (list) => {
        this.transactions.set(list ?? []);
        this.error.set(null);
        this.loadingList.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loadingList.set(false);
      }
    });
  }

  onCreate(request: TransactionRequest): void {
    this.submitting.set(true);
    this.api.create(request).subscribe({
      next: (tx) => {
        this.transactions.update((list) => [tx, ...list]);
        this.error.set(null);
        this.submitting.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.submitting.set(false);
      }
    });
  }

  badgeClass(status: TransactionStatus): string {
    switch (status) {
      case 'APPROVED': return 'badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15';
      case 'REJECTED': return 'badge bg-rose-50 text-rose-700 ring-1 ring-rose-600/15';
      default: return 'badge bg-amber-50 text-amber-700 ring-1 ring-amber-600/15';
    }
  }

  statusLabel(status: TransactionStatus): string {
    switch (status) {
      case 'APPROVED': return 'Aprovada';
      case 'REJECTED': return 'Recusada';
      default: return 'Pendente';
    }
  }

  setSearchTerm(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.searchTerm.set(event.target.value);
    }
  }

  setStatusFilter(event: Event): void {
    if (event.target instanceof HTMLSelectElement) {
      this.statusFilter.set(event.target.value as TransactionFilter);
    }
  }
}
