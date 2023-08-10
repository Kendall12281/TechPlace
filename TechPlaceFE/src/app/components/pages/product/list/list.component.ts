import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoModel } from 'src/app/models/producto.model';
import { GuardService } from 'src/app/services/guard.service';
import { ProductoService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  productos: ProductoModel[];
  productosFilter: ProductoModel[];
  categoryId: string;
  orderType: string = 'des';

  parameter: string | null;
  constructor(private route: ActivatedRoute, private productoService: ProductoService, private guardService: GuardService) { }
  ngOnChanges(changes: SimpleChanges): void {
    const parametro = this.route.snapshot.queryParamMap.get('search');
    console.log('Parámetro recibido:', parametro);
    this.searchText = parametro;
    this.parameter = parametro;
    }

  searchText: string|null = '';

  ngOnInit() {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.route.queryParams.subscribe(params => {
      const parametro = params['search'];
      console.log('Parámetro recibido:', parametro);
      this.parameter = parametro;
      this.loadData();
    });
  }

  loadData(){
    this.productoService.getProductos().subscribe((productos) => {
      this.productos = productos.filter((producto) => {
        const nombreCategoria = producto?.categorias?.nombre_categoria || '';

        return (this.parameter == '' || this.parameter == null) 
        || producto.nombre.toLocaleLowerCase().includes(this.parameter.toLocaleLowerCase())
        || producto.descripcion.toLocaleLowerCase().includes(this.parameter.toLocaleLowerCase())
        || nombreCategoria.toLocaleLowerCase().includes(this.parameter.toLocaleLowerCase());
      });
      this.loadFilterData();
    });
    
  }

  loadFilterData(){
    if(this.categoryId == '' || this.categoryId == undefined || this.categoryId == '0'){
      this.productosFilter = this.orderType == 'des' ? this.productos.slice().sort((a, b) => a.precio - b.precio):this.productos.slice().sort((a, b) => b.precio - a.precio);
    }else{
      this.productosFilter = this.orderType == 'des' ? this.productos.slice().filter((producto) => {
        const categoriaId = producto?.categorias?.categoria_id || 0;
        return categoriaId == Number(this.categoryId);
      }).sort((a, b) => a.precio - b.precio):this.productos.slice().filter((producto) => {
        const categoriaId = producto?.categorias?.categoria_id || 0;
        return categoriaId == Number(this.categoryId);
      }).sort((a, b) => b.precio - a.precio);
    }
  }

  onSelectionChangeFilter(){
    this.loadFilterData();
  }
}

