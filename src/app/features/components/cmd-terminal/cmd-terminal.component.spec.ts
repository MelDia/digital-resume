import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdTerminalComponent } from './cmd-terminal.component';

describe('CmdTerminalComponent', () => {
  let component: CmdTerminalComponent;
  let fixture: ComponentFixture<CmdTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmdTerminalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmdTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
