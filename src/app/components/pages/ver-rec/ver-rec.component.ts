import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "./../../../services/g-query.service";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {inputI} from "../../../models/input.interface"
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-ver-rec',
  templateUrl: './ver-rec.component.html',
  styleUrls: ['./ver-rec.component.styl']
})

export class VerRecComponent implements OnInit {
  // public texto;  
  // this.texto = this.rutaActiva.snapshot.params.IdObs
  // displayedColumns: string[] = ['Recomendacion', 'FechaImplementacion', "Responsable", 'Corresponsables', "Acciones"];
  displayedColumns: string[] = ['Recomendacion', "Acciones"];
  dataSource = new MatTableDataSource();
  
  Acciones = {Estado:0, Detalle:''} //0 lista, 1 nuevo, 2 editar, 3 detalle
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public input: inputI;
  public Observacion: any[];
  public Usuarios:any[] = [];
  public AreasControl:any[] = [];
  public respuestaImagenEnviada;
  public res= {Titulo:"", Doc:"", Incidencia:"" };
  
  constructor(private gQuery:gQueryService, public dialog: MatDialog, private ruta:ActivatedRoute ) {

  }

  ngOnInit() {
    // cargar info de observacion
    this.gQuery
    .sql("sp_observacion_devolver", this.ruta.snapshot.params.IdObs)
    .subscribe((data:any[]) =>{
      this.Observacion = data;
      console.log(this.Observacion[0]["Titulo"]);
      this.res.Titulo = this.Observacion[0]["NumObs"] + " "+ this.Observacion[0]["Titulo"];
      this.res.Doc = this.Observacion[0]["Documento"];
      this.res.Incidencia = this.Observacion[0]["Incidencia"];
    });


    // cargar usuarios
    this.gQuery
    .sql("sp_devolver_data_tabla", "usuarios|Id Valor, usuario Texto|Estado=1|usuario")
    .subscribe((data:any[]) =>{
       this.Usuarios = data;
    });
  
    this.cargarRecs()
  }

  cargarRecs(){
    // alert("cargando");
    this.gQuery
    .sql("sp_recomendaciones_devolver", this.ruta.snapshot.params.IdObs + "|" + "0, 1, 2") //0=pendiente, 1 en proceso, 2 implementado, 3 cerrado y verificado
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

  onNuevaRec(){
    this.input = <inputI> {
      Titulo : "Nueva Recomendación",
      Campos: [
        {Nombre:"NumRec",         Tipo:"Texto",   Etiqueta:"N° Rec.",             Valor:"",Validacion:[Validators.required]},
        {Nombre:"Recomendacion",  Tipo:"TextoL",  Etiqueta:"Recomendación",       Valor:"",Validacion:[Validators.required]},
        {Nombre:"FechaI",         Tipo:"Fecha",   Etiqueta:"Fecha Implementación",DatePicker: "Picker1",Valor:new Date()},
        {Nombre:"Responsable",    Tipo:"Select",  Etiqueta:"Responsable",         Opciones:  this.Usuarios},
        {Nombre:"CoResp",         Tipo:"Select",  Etiqueta:"Corresponsables",     Opciones:  this.Usuarios, Multiple:true},
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

        result.NumRec=result.NumRec.replace(/\|/g,"¦");
        result.Recomendacion=result.Recomendacion.replace(/\|/g,"¦");
        // result.FechaI=result.FechaI.replace(/\|/g,"¦");
        result.Responsable=result.Responsable.replace(/\|/g,"¦");
        result.CoResp=result.CoResp.toString();

        
        this.gQuery.sql(
          "sp_recomendacion_registrar",
          this.ruta.snapshot.params.IdObs     + "|" + 
          result.NumRec                       + "|" + 
          result.Recomendacion                + "|" + 
          this.gQuery.fecha_2b(result.FechaI) + "|" + 
          result.Responsable                  + "|" + 
          result.CoResp                       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarRecs();
            }
            alert(res[0].message);
          }
        );
      }
    })


  }

  onInfoRec(elem){
    var IdCo = elem.IdCoResp.split();
    this.input = <inputI> {
      Titulo : "Info de Recomendación",
      SoloLectura : true,
      Campos: [
        {Nombre:"NumRec",       Tipo:"Texto",   Etiqueta:"N° Rec.",             Valor:elem.NumRec},
        {Nombre:"Recomendacion",Tipo:"TextoL",  Etiqueta:"Recomendación",       Valor:elem.Recomendacion},
        {Nombre:"FechaI",       Tipo:"Texto",   Etiqueta:"Fecha Implementación",Valor:elem.FechaImplementacion},
        {Nombre:"Responsable",  Tipo:"Texto",   Etiqueta:"Responsable",         Valor:elem.Responsable},
        {Nombre:"CoResp",       Tipo:"Texto",   Etiqueta:"Corresponsables",     Valor:elem.Corresponsables},
      ]
    }
   
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '80%',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe()
  }

  onEditRec(elem){
    console.log(elem.IdCoResp.split());
    
    this.input = <inputI> {
      Titulo : "Nueva Recomendación",
      Campos: [
        {Nombre:"NumRec",       Tipo:"Texto",   Etiqueta:"N° Rec.",             Valor:elem.NumRec,        Validacion:[Validators.required]},
        {Nombre:"Recomendacion",Tipo:"TextoL",  Etiqueta:"Recomendación",       Valor:elem.Recomendacion, Validacion:[Validators.required]},
        {Nombre:"FechaI",       Tipo:"Fecha",   Etiqueta:"Fecha Implementación",DatePicker: "Picker1",    Valor:this.gQuery.fecha_n2d(elem.FechaImplementacion)},
        {Nombre:"Responsable",  Tipo:"Select",  Etiqueta:"Responsable",         Valor:elem.IdResponsable, Opciones:  this.Usuarios},
        {Nombre:"CoResp",       Tipo:"Select",  Etiqueta:"Corresponsables",     Valor:elem.IdCoResp.split(","), Opciones:  this.Usuarios, Multiple:true},
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
          "sp_recomendacion_update",
          elem.Id                             + "|" + 
          this.ruta.snapshot.params.IdObs     + "|" + 
          result.NumRec                       + "|" + 
          result.Recomendacion                + "|" +
          this.gQuery.fecha_2b(result.FechaI) + "|" +  
          result.Responsable                  + "|" +           
          result.CoResp       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarRecs();
            }
            alert(res[0].message);
          }
        );
      }
    })
  }

  onDelRec(elem){
    if(!confirm("¿Realmente desea eliminar esta Recomendación?")){
      return;
    }
    this.gQuery.sql("sp_recomendacion_delete",elem.Id)
      .subscribe(result =>{
        if(result[0].Estado==1){
          this.cargarRecs();
        }
        alert(result[0].message);
      })
  }

}





