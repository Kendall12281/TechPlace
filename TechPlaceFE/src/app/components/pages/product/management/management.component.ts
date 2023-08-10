import { Component,ViewChild,AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/productos.service';
import { GuardService } from 'src/app/services/guard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements AfterViewInit, OnInit{
  productos: ProductoModel[];

  displayedColumns: string[] = ['Producto', 'Descripcion', 'Categoria', 'Precio', 'Cantidad', 'Acciones'];
  dataSource = new MatTableDataSource<ProductoModel>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private paginatorIntl: MatPaginatorIntl, private productoService: ProductoService,
    private guardService: GuardService, private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
        this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
        this.paginatorIntl.firstPageLabel = 'Primera';
        this.paginatorIntl.lastPageLabel = 'Última';
        this.paginatorIntl.nextPageLabel = 'Siguiente';
        this.paginatorIntl.previousPageLabel = 'Anterior';    
        this.loadData();
    }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }

  loadData(){
    // const usuario_id = 2;
    this.productoService.getProductosVendedor().subscribe((productos) => {
      this.productos = productos;
      this.dataSource = new MatTableDataSource<ProductoModel>(this.productos);
    });
  }

  EliminarProducto(productoId:number){
    this.productoService.eliminarProduct(productoId)

       location.reload();

  }
}



const ELEMENT_DATA: ProductoModel[] = [
];