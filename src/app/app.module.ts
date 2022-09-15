//Module Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//composants
import { AppComponent } from './app.component';

//Routing
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './core/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
