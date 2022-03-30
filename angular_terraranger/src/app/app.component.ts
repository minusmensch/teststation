import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {MqttService} from "./service/mqtt.service";
import {IMqttMessage} from "ngx-mqtt";
import {Messung, MessungBtn} from "./common/strings";
import {TemperatureStatus} from "./common/TemperatureStatus";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Teststation';
  TemperatureStatus = TemperatureStatus;

  private imgSubscription?: Subscription;
  private maxTempSubscription?: Observable<any>;

  imageUrl: string = '';
  temperatureStatus: TemperatureStatus = TemperatureStatus.NONE;

  instructions: string[] = [Messung.INTRODUCTION, Messung.INSTRUCTIONS];
  messenBtn: string = MessungBtn.START;

  constructor(private mqttService: MqttService) {
  }

  ngOnInit(): void {
    this.imgSubscription = this.mqttService.getThermalImage().subscribe((message: IMqttMessage) => {
      this.imageUrl = 'data:image/png;base64,' + message.payload.toString();
    });

    this.maxTempSubscription = this.mqttService.getMaxForeheadTemperature();
  }

  onMessenBtnClick() {
    if (this.messenBtn == MessungBtn.RESET) {
      this.resetMessenBtn();
    } else if (this.messenBtn == MessungBtn.START) {
      this.getMaxTemp();
    }
  }

  getMaxTemp() {
    this.temperatureStatus = TemperatureStatus.NONE;
    this.instructions.push(Messung.START);

    let counter = 5;
    this.messenBtn = counter.toString();
    let maxTemps: number[] = [];

    const counterInterval = setInterval(() => {
      this.maxTempSubscription?.subscribe((message: IMqttMessage) => maxTemps.push((Number(message.payload.toString()))));

      counter--;
      this.messenBtn = counter.toString();
    }, 1000);

    setTimeout(() => {
      clearInterval(counterInterval)

      const averageMaxTemp = this.calculateAverageMaxTemp(maxTemps);
      this.temperatureStatus = this.calculateTemperatureStatus(Number(averageMaxTemp));

      this.instructions.push(Messung.ERGEBNIS(averageMaxTemp));
      this.instructions.push(this.temperatureStatus);

      this.messenBtn = MessungBtn.RESET;
    }, 5000)
  }

  resetMessenBtn() {
    this.instructions = [Messung.INTRODUCTION, Messung.INSTRUCTIONS];
    this.messenBtn = MessungBtn.START;
    this.temperatureStatus = TemperatureStatus.NONE;
  }

  calculateAverageMaxTemp(maxTemps: number[]): string {
    let tempSum = 0;
    maxTemps.forEach(temp => {
      tempSum += temp;
    });

    return (tempSum / maxTemps.length).toPrecision(4);
  }

  calculateTemperatureStatus(maxTemp: number): TemperatureStatus {
    let status;

    if (maxTemp <= 37.0) {
      status = TemperatureStatus.NORMAL;
    } else if (maxTemp <= 37.5) {
      status = TemperatureStatus.ELEVATED;
    } else {
      status = TemperatureStatus.FEVER;
    }

    return status;
  }

  getMessageColor(text: string) {
    let color = "cornflowerblue";
    if (text.includes("Deine Gesichtstemperatur beträgt momentan") || this.includesTemperatureStatusStr(text)) {
      switch (this.temperatureStatus) {
        case TemperatureStatus.NORMAL:
          color = "mediumseagreen";
          break;
        case TemperatureStatus.ELEVATED:
          color = "coral";
          break;
        case TemperatureStatus.FEVER:
          color = "darkred";
          break;
        default:
          color = "cornflowerblue";
          break;
      }
    }

    return color;
  }

  includesTemperatureStatusStr(text: string) {
    return text.includes(TemperatureStatus.NORMAL) || text.includes(TemperatureStatus.ELEVATED) || text.includes(TemperatureStatus.FEVER);
  }
}
