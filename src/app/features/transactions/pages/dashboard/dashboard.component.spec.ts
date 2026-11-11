import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { TransactionApiService } from '../../../../core/services/transaction-api.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  const api = jasmine.createSpyObj('TransactionApiService', ['findAll', 'create']);

  beforeEach(async () => {
    api.findAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: TransactionApiService, useValue: api }]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('exibe mensagem de lista vazia', () => {
    expect(fixture.nativeElement.textContent).toContain('Nenhuma transação registrada até o momento.');
  });

  it('soma apenas aprovadas no Total Aprovado', () => {
    api.create.and.returnValue(of({ id: '1', accountId: 'ACC-123', amount: 150, status: 'APPROVED' }));
    fixture.componentInstance.onCreate({ accountId: 'ACC-123', amount: 150 });
    api.create.and.returnValue(of({ id: '2', accountId: 'ACC-999', amount: 15000, status: 'REJECTED' }));
    fixture.componentInstance.onCreate({ accountId: 'ACC-999', amount: 15000 });
    expect(fixture.componentInstance.totalApproved()).toBe(150);
    expect(fixture.componentInstance.totalCount()).toBe(2);
  });

  it('calcula o volume, o ticket médio e a taxa de aprovação', () => {
    fixture.componentInstance.transactions.set([
      { id: '1', accountId: 'ACC-123', amount: 100, status: 'APPROVED' },
      { id: '2', accountId: 'ACC-456', amount: 50, status: 'PENDING' },
      { id: '3', accountId: 'ACC-789', amount: 50, status: 'REJECTED' }
    ]);

    expect(fixture.componentInstance.totalVolume()).toBe(200);
    expect(fixture.componentInstance.averageTicket()).toBeCloseTo(66.67, 2);
    expect(fixture.componentInstance.approvalRate()).toBeCloseTo(33.33, 2);
    expect(fixture.componentInstance.totalPending()).toBe(50);
  });

  it('filtra transações por conta e por status', () => {
    fixture.componentInstance.transactions.set([
      { id: '1', accountId: 'ACC-123', amount: 100, status: 'APPROVED' },
      { id: '2', accountId: 'ACC-456', amount: 50, status: 'PENDING' }
    ]);

    fixture.componentInstance.searchTerm.set('acc-123');
    expect(fixture.componentInstance.filteredTransactions().map((transaction) => transaction.id)).toEqual(['1']);

    fixture.componentInstance.searchTerm.set('');
    fixture.componentInstance.statusFilter.set('PENDING');
    expect(fixture.componentInstance.filteredTransactions().map((transaction) => transaction.id)).toEqual(['2']);
  });
});
