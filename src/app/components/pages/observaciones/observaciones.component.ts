import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "./../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {inputI} from "../../../models/input.interface"
import {MatDialog} from '@angular/material/dialog';
import { SubirService } from "../../../services/subir.service"

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.styl']
})
export class ObservacionesComponent implements OnInit {
  displayedColumns: string[] = ['Nro', 'Obs', 'Area', "FechaImp", 'Doc', 'Categoria', "Acciones"];
  dataSource = new MatTableDataSource();
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public input: inputI;
  public Documentos:any[] = [];
  public AreasControl:any[] = [];
  public respuestaImagenEnviada;
  public resultadoCarga;

  constructor(private gQuery:gQueryService, public dialog: MatDialog) {}

  ngOnInit() {
    // cargar documentos
    this.gQuery
    .sql("sp_devolver_data_tabla", "documentos|Id Valor, Numero Texto|Estado=1|Numero")
    .subscribe((data:any[]) =>{
      // console.log(data);
      
      this.Documentos = data;
    });

     // cargar entidades
     this.gQuery
     .sql("sp_devolver_data_tabla", "Unidades|Id Valor, Unidad Texto|Estado=1 and Control=1|Unidad")
     .subscribe((data:any[]) =>{
       this.AreasControl = data;
     });
  
    this.cargarObs()
  }

  cargarObs(){
    // alert("cargando");
    this.gQuery
    .sql("sp_observaciones_devolver","0, 1, 2") //0=pendiente, 1 en proceso, 2 implementado, 3 cerrado y verificado
    .subscribe(data =>{
      this.dataSource= new MatTableDataSource(<any> data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNuevaObs(){
    this.input = <inputI> {
      Titulo : "Nueva Observación",
      Campos: [
        {Nombre:"Documento",  Tipo:"Select",  Etiqueta:"Documento",            Opciones:  this.Documentos},
        {Nombre:"Area",       Tipo:"Select",  Etiqueta:"Area",                 Opciones: this.AreasControl},
        {Nombre:"Categoria",  Tipo:"Texto",   Etiqueta:"Categoria",            Valor:"",Validacion:[Validators.required]},
        {Nombre:"NumeroObs",  Tipo:"Texto",   Etiqueta:"N° Obs",               Valor:"",Validacion:[Validators.required]},
        {Nombre:"Titulo",     Tipo:"Texto",   Etiqueta:"Titulo",               Valor:"",Validacion:[Validators.required]},
        {Nombre:"Incidencia", Tipo:"TextoL",  Etiqueta:"Incidencia",           Valor:"",Validacion:[Validators.required]},
        {Nombre:"FechaP",     Tipo:"Fecha",   Etiqueta:"Fecha Pedido",         DatePicker: "Picker1",Valor:new Date()},
        {Nombre:"FechaI",     Tipo:"Fecha",   Etiqueta:"Fecha Implementación", DatePicker: "Picker1",Valor:new Date()},
        {Nombre:"Glosa",      Tipo:"TextoL",  Etiqueta:"Glosa",                Valor:""},
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '600px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        // return;
        // str=str.replace(/abc/g," ");
        result.Documento=result.Documento.replace(/\|/g,"¦");
        result.Area=result.Area.replace(/\|/g,"¦");
        result.Categoria=result.Categoria.replace(/\|/g,"¦");
        result.NumeroObs=result.NumeroObs.replace(/\|/g,"¦");
        result.Titulo=result.Titulo.replace(/\|/g,"¦");
        result.Incidencia=result.Incidencia.replace(/\|/g,"¦");


        // result =result.replace(/|/g, "¦")


        this.gQuery.sql(
          "sp_observacion_registrar",
          result.Documento                     + "|" + 
          result.Area                          + "|" + 
          result.Categoria                     + "|" + 
          result.NumeroObs                     + "|" + 
          result.Titulo                        + "|" + 
          result.Incidencia                    + "|" + 
          this.gQuery.fecha_2b(result.FechaP)  + "|" + 
          this.gQuery.fecha_2b(result.FechaI)  + "|" + 
          result.Glosa
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarObs();
            }
            alert(res[0].message);
          }
        );
      }
    })


  }

  onInfoObs(elem){
    this.input = <inputI> {
      Titulo      : "Nueva Observación",
      SoloLectura : true,
      Campos: [
        {Nombre:"Documento",  Tipo:"Texto",   Etiqueta:"Documento",             Valor: elem.Doc},
        {Nombre:"Area",       Tipo:"Texto",   Etiqueta:"Area",                  Valor: elem.Unidad},
        {Nombre:"Categoria",  Tipo:"Texto",   Etiqueta:"Categoria",             Valor: elem.Categoria},
        {Nombre:"NumeroObs",  Tipo:"Texto",   Etiqueta:"N° Obs",                Valor: elem.NumeroObs},
        {Nombre:"Titulo",     Tipo:"Texto",   Etiqueta:"Titulo",                Valor: elem.Titulo},
        {Nombre:"Incidencia", Tipo:"TextoL",  Etiqueta:"Incidencia",            Valor: elem.Incidencia},
        {Nombre:"FechaP",     Tipo:"Texto",   Etiqueta:"Fecha Pedido",          Valor: elem.FechaPedido},
        {Nombre:"FechaI",     Tipo:"Texto",   Etiqueta:"Fecha Implementación",  Valor: elem.FechaImplementacion},
        {Nombre:"Glosa",      Tipo:"TextoL",  Etiqueta:"Glosa",                 Valor: elem.Glosa},
      ]
    }
   
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '80%',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe()
  }

  onEditObs(elem){

    this.input = <inputI> {
      Titulo : "Nueva Observación",
      Campos: [
        {Nombre:"Documento",  Tipo:"Select",  Etiqueta:"Documento",            Valor: elem.IdDoc,                                       Validacion:[Validators.required], Opciones: this.Documentos},
        {Nombre:"Area",       Tipo:"Select",  Etiqueta:"Area",                 Valor: elem.IdUnidad,                                    Validacion:[Validators.required], Opciones: this.AreasControl},
        {Nombre:"Categoria",  Tipo:"Texto",   Etiqueta:"Categoria",            Valor: elem.Categoria,                                   Validacion:[Validators.required]},
        {Nombre:"NumeroObs",  Tipo:"Texto",   Etiqueta:"N° Obs",               Valor: elem.NumeroObs,                                   Validacion:[Validators.required]},
        {Nombre:"Titulo",     Tipo:"Texto",   Etiqueta:"Titulo",               Valor: elem.Titulo,                                      Validacion:[Validators.required]},
        {Nombre:"Incidencia", Tipo:"TextoL",  Etiqueta:"Incidencia",           Valor: elem.Incidencia,                                  Validacion:[Validators.required]},
        {Nombre:"FechaP",     Tipo:"Fecha",   Etiqueta:"Fecha Pedido",         Valor: this.gQuery.fecha_n2d(elem.FechaPedido),          Validacion:[Validators.required], DatePicker: "Picker1"},
        {Nombre:"FechaI",     Tipo:"Fecha",   Etiqueta:"Fecha Implementación", Valor: this.gQuery.fecha_n2d(elem.FechaImplementacion),  Validacion:[Validators.required], DatePicker: "Picker1"},
        {Nombre:"Glosa",      Tipo:"TextoL",  Etiqueta:"Glosa",                Valor: elem.Glosa},
      ]
    }


    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '80%',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        
        this.gQuery.sql(
          "sp_observacion_update",
          elem.Id                              + "|" + 
          result.Documento                     + "|" + 
          result.Area                          + "|" + 
          result.Categoria                     + "|" + 
          result.NumeroObs                     + "|" + 
          result.Titulo                        + "|" + 
          result.Incidencia                    + "|" + 
          this.gQuery.fecha_2b(result.FechaP)  + "|" + 
          this.gQuery.fecha_2b(result.FechaI)  + "|" + 
          result.Glosa       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarObs();
            }
            alert(res[0].message);
          }
        );
      }
    })
  }

  onDelObs(elem){
    if(!confirm("¿Realmente desea eliminar esta Observación?")){
      return;
    }
    this.gQuery.sql("sp_observacion_delete",elem.Id)
      .subscribe(result =>{
        if(result[0].Estado==1){
          this.cargarObs();
        }
        alert(result[0].message);
      })
  }
  
  onNewRec(elem){
    console.log(elem);
    
  }


}





