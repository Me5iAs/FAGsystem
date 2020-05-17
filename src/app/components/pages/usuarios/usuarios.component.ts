import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import {gQueryService} from "./../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {inputI} from "../../../models/input.interface"

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['Usuario', 'Cargo', 'Unidad', 'Acciones'];
  dataSource = new MatTableDataSource();

  Acciones = {Estado:0, Detalle:''} //0 lista, 1 nuevo, 2 editar, 3 detalle

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public input: inputI;
  public Cargos:any[] = [];

  constructor(private gQuery:gQueryService, private router:Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.gQuery
    .sql("sp_devolver_data_tabla", "cargos|Id Valor, Cargo Texto|estado=1|Cargo")
    .subscribe((data:any[]) =>{
      this.Cargos = data;
    });
  
    this.cargarUsuarios()
  }

  cargarUsuarios(){
    this.gQuery
    .sql("sp_usuarios_devolver")
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

  onNuevoUsuario(){
    this.input = <inputI> {
      Titulo : "Nuevo Usuario",
      Campos: [
        {Nombre:"Nombre",Tipo:"Texto",Etiqueta:"Nombre",Valor: "", Validacion:[Validators.required]}, 
        {Nombre:"Usuario",Tipo:"Texto",Etiqueta:"Usuario",Valor:"",Validacion:[Validators.required]},
         {Nombre: "Cargo",
         Tipo:"Select",
         Etiqueta:"Cargo",
         Opciones: this.Cargos,}
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
        
        
        this.gQuery.sql(
          "sp_usuario_registrar",
          result.Nombre         + "|" + 
          result.Usuario            + "|" + 
          result.Cargo       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarUsuarios();
            }
            alert(res[0].message);
          }
        );
      }
    })


  }

  onInfoUsuario(elem){
    
    this.input = <inputI> {
      SoloLectura:true,
      Titulo : "Info del  Usuario",
      Campos: [
        {Nombre:"Nombre",Tipo:"Texto",Etiqueta:"Nombre",Valor: elem.Nombre, Validacion:[Validators.required]}, 
        {Nombre:"Usuario",Tipo:"Texto",Etiqueta:"Usuario",Valor:elem.Usuario ,Validacion:[Validators.required]},
        {Nombre:"Cargo",Tipo:"Texto",Etiqueta:"Cargo",Valor:elem.Cargo ,Validacion:[Validators.required]}
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '400px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe()
  }

  onEditUsuario(elem){
    this.input = <inputI> {
      Titulo : "Editar  Usuario",
      Campos: [
        {Nombre:"Nombre",Tipo:"Texto",Etiqueta:"Nombre",Valor: elem.Nombre, Validacion:[Validators.required]}, 
        {Nombre:"Usuario",Tipo:"Texto",Etiqueta:"Usuario",Valor:elem.Usuario ,Validacion:[Validators.required]},
         {Nombre: "Cargo",
         Tipo:"Select",
         Etiqueta:"Cargo",
         Opciones: this.Cargos,
         Valor: elem.IdCargo
        }
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '400px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);    
        
        
        this.gQuery.sql(
          "sp_usuario_update",
          elem.Id          + "|" + 
          result.Nombre    + "|" + 
          result.Usuario   + "|" + 
          result.Cargo       
          ).subscribe(res =>{
            if(res[0].Estado==1){
              this.cargarUsuarios();
            }
            alert(res[0].message);
          }
        );
      }
    })
  }
  
  onDelUsuario(elem){
    if(!confirm("¿Realmente desea eliminar este usuario?")){
      return;
    }
    this.gQuery.sql("sp_usuario_delete",elem.Id)
      .subscribe(result =>{
        if(result[0].Estado==1){
          this.cargarUsuarios();
        }
        alert(result[0].message);
      })
       
    // console.log(elem);
    
  }


}
