import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root",
})
export class EvaluacionesService {

    private apiUrl = "http://localhost:3000/api/";
    // private apiUrl = "http://192.168.100.40:3000/api/"; 

    constructor(private http: HttpClient) { }

    ExisteEvaluacionCompra(compraid: number): Observable<boolean> {
        const url = `${this.apiUrl}evaluaciones/existeEvaluacion`;
        const data = { compra_id: compraid };
        return this.http.post<boolean>(url, data).pipe();

    }

    EvaluarVendedor(evaluacion: any) {
        const url = `${this.apiUrl}evaluaciones/evaluarVendedor`;
        this.http.post<boolean>(url, evaluacion).pipe().subscribe();
    }
    EvaluarCliente(evaluacion: any) {
        const url = `${this.apiUrl}evaluaciones/evaluarCliente`;
        this.http.post<boolean>(url, evaluacion).pipe().subscribe();
    }

    YaCompletoEvaluacionCliente(compraid:any) {
        const url = `${this.apiUrl}evaluaciones/YaCompletoEvaluacionCliente`;
       return this.http.post<any>(url, compraid).pipe();
    }

    YaCompletoEvaluacionVendedor(compraid:any) {
        const url = `${this.apiUrl}api/evaluaciones/YaCompletoEvaluacionVendedor`;
        return this.http.post<boolean>(url, compraid).pipe();
    }

}