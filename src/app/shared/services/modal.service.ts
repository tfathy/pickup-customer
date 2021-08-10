import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalInst = [];
  i = 0;
  constructor() {}

  storeModal(x) {
    this.modalInst[this.i] = x;
    this.i++;
  }
}
