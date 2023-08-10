import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  baseUrl = 'https://ubicaciones.paginasweb.cr/';

  constructor(private http: HttpClient) { }

  getProvincias() {
    return this.http.get(this.baseUrl + 'provincias.json');
  }

  getCantones(id_provincia: number) {
    return this.http.get(this.baseUrl + 'provincia/' + id_provincia + '/cantones.json');
  }

  getDistritos(id_provincia: number, id_canton: number) {
    return this.http.get(this.baseUrl + 'provincia/' + id_provincia + '/canton/' + id_canton + '/distritos.json');
  }
}