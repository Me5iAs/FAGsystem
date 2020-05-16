import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// const url_api = "http://192.168.1.42/subirArchivo.php";
const url_api = "http://localhost/subirArchivo.php";
// const url_api = "backend/subirArchivo.php";

const Cabecera: HttpHeaders = new HttpHeaders();
Cabecera.append('Content-Type','application/json');
Cabecera.append("Access-Control-Allow-Origin", "*");
// Cabecera.append("Access-Control-Allow-Credentials", "true");
Cabecera.append("Content-Type: multipart/form-data","charset=UTF-8");
Cabecera.append("Access-Control-Allow-Methods","PUT, GET, POST, FILES");
Cabecera.append("Allow","GET, POST, OPTIONS, PUT, DELETE");
Cabecera.append("Access-Control-Max-Age","3600");
Cabecera.append("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


@Injectable({
  providedIn: 'root'
})

export class SubirService {
  
 
	constructor(private http: HttpClient){}

	public postFileImagen(imagenParaSubir: File, Nombre:string){

		const formData = new FormData(); 
    formData.append('imagenPropia', imagenParaSubir, imagenParaSubir.name); 
		formData.append("Nombre",Nombre);
		return this.http.post(url_api, formData,{headers: Cabecera});

	}
  
}

