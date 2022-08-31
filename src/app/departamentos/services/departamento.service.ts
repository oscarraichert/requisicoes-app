import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  inserir(registro: Departamento) {

  }

  private registros: AngularFirestoreCollection<Departamento>;

  constructor(private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Departamento>("departamentos");
  }

  public selecionarTodos(): Observable<Departamento[]> {
    return this.registros.valueChanges();
  }
}
