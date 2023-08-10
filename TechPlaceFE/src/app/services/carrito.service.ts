import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoModel } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
    private carritoSubject: BehaviorSubject<CarritoModel[]> = new BehaviorSubject<CarritoModel[]>([]);
    carrito$: Observable<CarritoModel[]> = this.carritoSubject.asObservable();
  
    constructor() {}
  
    addArticle(article: CarritoModel): void {
      this.validate(article);
    }
  
    removeArticle(article: CarritoModel): void {
      const currentArticles = this.carritoSubject.getValue();
      const index = currentArticles.findIndex(a => a.producto_id === article.producto_id);
      
      if (index !== -1) {
        currentArticles.splice(index, 1);
        this.carritoSubject.next(currentArticles);
      }
    }

    removeArticleByID(id: number): void {
      const currentArticles = this.carritoSubject.getValue();
      const index = currentArticles.findIndex(a => a.producto_id === id);
      
      if (index !== -1) {
        currentArticles.splice(index, 1);
        this.carritoSubject.next(currentArticles);
      }
    }

    cleanCar(): void {
      this.carritoSubject.next([]);
    }
    
    validate(article: CarritoModel){
      const currentArticles = this.carritoSubject.getValue();
      const index = currentArticles.findIndex(a => a.producto_id === article.producto_id);
      
      if (index !== -1) {
        let cantidadVieja:number = currentArticles[index].cantidad;
        currentArticles.splice(index, 1);
        this.carritoSubject.next(currentArticles);
        let cantidadNueva:number = Number(article.cantidad) + cantidadVieja;
        article.cantidad = cantidadNueva;
        this.add(article);
      }else{
        this.add(article);
      }
    }

    add(article: CarritoModel){
      const currentArticles = this.carritoSubject.getValue();
      currentArticles.push(article);
      this.carritoSubject.next(currentArticles);
    }
}
