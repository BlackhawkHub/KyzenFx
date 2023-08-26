import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceipientsComponent } from './receipients.component';

describe('ReceipientsComponent', () => {
  let component: ReceipientsComponent;
  let fixture: ComponentFixture<ReceipientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceipientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
