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
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.styl']
})
export class DocumentosComponent implements OnInit {
  displayedColumns: string[] = ['Ente_control', 'Fecha', 'Numero', 'Asunto', 'Acciones'];
  dataSource = new MatTableDataSource();

  Acciones = {Estado:0, Detalle:''} //0 lista, 1 nuevo, 2 editar, 3 detalle
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public input: inputI;
  public AreasControl:any[] = [];
  public respuestaImagenEnviada;
  public resultadoCarga;


  constructor(private gQuery:gQueryService, public dialog: MatDialog, private enviandoImagen: SubirService) {}

  ngOnInit() {
    this.gQuery
    .sql("sp_devolver_data_tabla", "unidades|Id Valor, Unidad Texto|Control=1 and Estado=1|Unidad")
    .subscribe((data:any[]) =>{
      this.AreasControl = data;
    });
  
    this.cargarDocs()
  }

  cargarDocs(){
    // alert("cargando");
    this.gQuery
    .sql("sp_documentos_devolver","0")
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

  onNuevoDoc(){
    this.input = <inputI> {
      Titulo : "Nuevo Documento",
      Campos: [
        {Nombre:"Area",     Tipo:"Select",Etiqueta:"Area",    Opciones: this.AreasControl},
        {Nombre:"Fecha",    Tipo:"Fecha", Etiqueta:"Fecha Emisión", DatePicker: "Picker1",Valor:new Date()},
        {Nombre:"NumeroDoc",Tipo:"Texto", Etiqueta:"Numero",Valor:"",Validacion:[Validators.required]},
        {Nombre:"Asunto",Tipo:"Texto",Etiqueta:"Asunto",Valor: "", Validacion:[Validators.required]},
        {Nombre:"Glosa",Tipo:"Texto",Etiqueta:"Glosa",Valor: ""},
        {Nombre:"Archivo",Tipo:"Archivo",Etiqueta:"Archivo (no editable a futuro)",Valor: "", Type:".*,", Validacion:[Validators.required]},         
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '400px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.gQuery.sql(
          "sp_documento_registrar",
          result[1].Area    + "|" + 
          this.gQuery.fecha_2b(result[1].Fecha)   + "|" + 
          result[1].NumeroDoc  + "|" + 
          result[1].Asunto  + "|" + 
          result[1].Glosa   + "|" + 
          result[0].name      
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.enviandoImagen.postFileImagen(result[0], result[0].name)
              .subscribe(
                response => {
                  this.respuestaImagenEnviada = response; 
                  if(this.respuestaImagenEnviada <= 1){
                    // console.log("error 0");
                    alert("Error subiendo el archivo al servidor"); 
                  }else{
                    if(this.respuestaImagenEnviada.code == 200 && this.respuestaImagenEnviada.status == "success"){
                      this.resultadoCarga = 1;
                      this.cargarDocs();
                    }else{
                      // console.log("error 2");
                      this.resultadoCarga = 2;
                    }
                  }
                  
                }
              )

            }
            alert(res[0].message);
          }
        );
      }
    })


  }

  onInfoDoc(elem){

    this.input = <inputI> {
      SoloLectura:true,
      Titulo : "Info del Documento",
      Campos: [
        {Nombre:"Area",     Tipo:"Texto", Etiqueta:"Area",  Valor:elem.Unidad,  Validacion:[Validators.required]},
        {Nombre:"Fecha",    Tipo:"Texto", Etiqueta:"Fecha", Valor:elem.Fecha,         Validacion:[Validators.required]},
        {Nombre:"NumeroDoc",Tipo:"Texto", Etiqueta:"Numero",Valor:elem.Numero,        Validacion:[Validators.required]},
        {Nombre:"Asunto",   Tipo:"Texto", Etiqueta:"Asunto",Valor:elem.Asunto,        Validacion:[Validators.required]},
        {Nombre:"Glosa",    Tipo:"Texto", Etiqueta:"Glosa", Valor: elem.Glosa},
      ]
    }    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '400px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe()
  }

  onEditDoc(elem){
    
    this.input = <inputI> {
      Titulo : "Editar  Documento",
      Campos: [
        {Nombre:"Area",     Tipo:"Select",Etiqueta:"Area",    Valor: elem.IdArea, Opciones: this.AreasControl},
        {Nombre:"Fecha",    Tipo:"Fecha", Etiqueta:"Fecha Emisión", DatePicker: "Picker1",Valor: this.gQuery.fecha_n2d(elem.Fecha) },
        {Nombre:"NumeroDoc",Tipo:"Texto", Etiqueta:"Numero",Valor:elem.Numero,Validacion:[Validators.required]},
        {Nombre:"Asunto",Tipo:"Texto",Etiqueta:"Asunto",Valor: elem.Asunto, Validacion:[Validators.required]},
        {Nombre:"Glosa",Tipo:"Texto",Etiqueta:"Glosa",Valor: elem.Glosa},
      ]


    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '400px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // console.log(result);  

        this.gQuery.sql(
          "sp_documento_update",
          elem.Id          + "|" + 
          result.Area      + "|" + 
          this.gQuery.fecha_2b(result.Fecha)  + "|" + 
          result.NumeroDoc + "|" + 
          result.Asunto    + "|" + 
          result.Glosa       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarDocs();
            }
            alert(res[0].message);
          }
        );
      }
    })
  }

  onDelDoc(elem){
    
    if(!confirm("¿Realmente desea eliminar este documento?")){
      return;
    }
    this.gQuery.sql("sp_documento_delete",elem.Id)
      .subscribe(result =>{
        if(result[0].Estado==1){
          this.cargarDocs();
        }
        alert(result[0].message);
      })
  }
  
  onVerDoc(elem){
    console.log(elem);
    
    let ruta = "http://localhost/archivos/";
    window.open(ruta + elem.Ruta);   
  }


}