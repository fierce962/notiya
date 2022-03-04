import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoadingSendNotificationComponent } from './loading-send-notification.component';

describe('LoadingSendNotificationComponent', () => {
  let component: LoadingSendNotificationComponent;
  let fixture: ComponentFixture<LoadingSendNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingSendNotificationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSendNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
