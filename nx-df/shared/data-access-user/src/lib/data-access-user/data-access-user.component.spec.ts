import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataAccessUserComponent } from './data-access-user.component';

describe('DataAccessUserComponent', () => {
  let component: DataAccessUserComponent;
  let fixture: ComponentFixture<DataAccessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAccessUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
