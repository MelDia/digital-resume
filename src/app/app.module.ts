import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { TransitionServiceService } from './service/transition-service.service';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  // providers: [TransitionServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
