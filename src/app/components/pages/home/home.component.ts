import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  public Opciones= [
    {Title:"Usuarios" , Subtitle: "Gestión de Usuarios", Image: 'banner_usuarios.png', Link: 'usuarios'},
    {Title:"Registrar Documentos" , Subtitle: "Gestión de documentos", Image: 'banner_documentos.png', Link: 'documentos'},
    {Title:"Observaciones" , Subtitle: "Gestión de Observaciones", Image: 'banner_obs.png', Link: 'observaciones'},
    // {Title:"Ingresos y Egresos" , Subtitle: "Registra otros movimientos de dinero", Image: 'banner_ingresos.png', Link: 'movimientos'},
    // {Title:"Movimientos" , Subtitle: "Reporte de Movimientos", Image: 'banner_egresos.png', Link: 'rep_mov'},
    // {Title:"Clientes" , Subtitle: "Registra y actualiza los datos de los clientes", Image: 'banner_clientes.png', Link: 'clientes'},
    // {Title:"Contratos" , Subtitle: "Administra los contratos de los clientes", Image: 'banner_contratos.png', Link: 'contratos'}
  ];
  constructor() { }
  

  ngOnInit() {
    // console.log(this.Opciones);
  }

  
  
  
}
