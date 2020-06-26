import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export class CheckStreamerService {

  emitChange$: Subject<any> = new BehaviorSubject<any>(null);
  constructor() { }
  emit(value: any) {
    this.emitChange$.next(value);
  }
  get emitChange(): BehaviorSubject<any> {
    return (this.emitChange$ as BehaviorSubject<any>);
  }
}
