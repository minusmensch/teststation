import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {IMqttServiceOptions, MqttModule} from "ngx-mqtt";

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 9001,
  path: ''
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    MatButtonModule,
    MatCardModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
