import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ver-rec',
  templateUrl: './ver-rec.component.html',
  styleUrls: ['./ver-rec.component.styl']
})

export class VerRecComponent implements OnInit {
  public texto;  
  constructor(private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.texto = this.rutaActiva.snapshot.params.IdObs
  }
  
  
}
