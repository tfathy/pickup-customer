import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  VoiceRecorder,
  VoiceRecorderPlugin,
  RecordingData,
  GenericResponse,
} from 'capacitor-voice-recorder';
@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent implements OnInit {
  form: FormGroup;
  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      locationType: new FormControl('', []),
      sourceLocationType: new FormControl('', []),
    });

    VoiceRecorder.requestAudioRecordingPermission().then(
      (result: GenericResponse) => console.log(result.value)
    );
  }
  startRecord() {
    VoiceRecorder.hasAudioRecordingPermission().then(
      (result: GenericResponse) => {
        console.log(result.value);
        VoiceRecorder.startRecording()
          .then((recordResult: GenericResponse) =>
            console.log(recordResult.value)
          )
          .catch((error) => console.log(error));
      }
    );
  }

  stopRecord() {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => console.log(result.value))
      .catch((error) => console.log(error));
  }
  onImagePicked(event){
    console.log(event);
  }
  back() {}
  nextStep() {}
}
