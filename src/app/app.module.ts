import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransitionServiceService } from './service/transition-service.service';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule],
  // providers: [TransitionServiceService],
  bootstrap: [],
})
export class AppModule {}
