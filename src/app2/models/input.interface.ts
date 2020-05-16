// referencias:
// * Sólo se puede subir una unica imagen
// * cuando se sube una imagen va devolver un array de 2 elementos, 
// * el primero con la imagen y el segundo con la informacion del  
// * formulario.
//* en caso de tipo "archivo" el valor de Type debe ser las extensiones : ".gif,.jpg,.jpeg,.png"

import {Validators} from "@angular/forms";

export interface inputI {
  Titulo:string;
  Campos:campoI[]
}

export interface campoI{
  Nombre: string;
  Tipo: "Texto"|"Fecha"|"Select"|"Archivo";
  Type?: string; // "text"|"password"|"email"|"number"|".gif.,.jpg,.png";
  Etiqueta: string;
  Placeholder?: string;
  Valor?: any;
  Validacion?: Validators;
  Opciones?: opcionI[];
}

export interface opcionI{
  Valor: string;
  Texto: string;
}
//
  /*
 Titulo:"Buscar Cliente",
      Campos: [
        {
          Nombre: "Texto1",
          Tipo:"Texto",
          Etiqueta:"Campo1",
          Placeholder:"PHCampo1",
          Valor:"valor de campo1",
          Requerido?: true,
          validacion?: "requiredFileType('png')"" 
        },
        {
          Nombre: "Fecha1",
          Tipo:"Fecha",
          Etiqueta:"Fecha",
          DatePicker: "Picker1",
          Valor:new Date()
        },
        {
          Nombre: "Select1",
          Tipo:"Select",
          Etiqueta:"Select1",
          Opciones: [
            {Valor: 1, Texto:"uno"},
            {Valor: 2, Texto:"dos"}
          ],
          Valor:2
        }
      ]
    }
    */