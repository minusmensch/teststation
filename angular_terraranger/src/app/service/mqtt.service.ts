import { Injectable } from '@angular/core';
import {MqttService as Mqtt} from "ngx-mqtt";

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  constructor(private mqttService: Mqtt) { }

  getThermalImage() {
    return this.mqttService.observe('thermal/img');
  }

  getMaxForeheadTemperature() {
    return this.mqttService.observe("thermal/max_temp");
  }
}
