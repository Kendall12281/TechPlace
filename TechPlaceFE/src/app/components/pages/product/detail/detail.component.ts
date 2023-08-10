import { Component, OnInit  } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoModel } from 'src/app/models/carrito.model';
import { CarritoService } from 'src/app/services/carrito.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal.service';
import { GuardService } from 'src/app/services/guard.service';


@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {


	product: ProductoModel | null;
	parameter: Number | null;
	cantidad: number | null = 1;
	pregunta: string = ""
	esCliente: boolean
	esVendedorDelProducto: boolean
	esVendedor: boolean = false
	usuario_id: number

	constructor(private router: Router, private route: ActivatedRoute, private productoService: ProductoService,
		private carritoService: CarritoService, public modal: ModalService,
		private guardService: GuardService) { }

	imageSlides: OwlOptions = {
		items: 2,
		nav: true,
		loop: true,
		dots: true,
		autoplay: false,
		smartSpeed: 1000,
		autoplayHoverPause: true,
		navText: [
			"<i class='flaticon-chevron-1'></i>",
			"<i class='flaticon-chevron'></i>"
		]
	}

	ngOnInit(): void {
		this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
		this.route.queryParams.subscribe(params => {
			const parametro = params['id'];
			this.parameter = parametro;
			this.loadData();
		});

		this.EsCliente();
		this.EsVendedorDelProducto();
	}

	 loadData() {
		if (this.parameter == null || this.parameter.toString() == '') {
			this.router.navigateByUrl('/');
		} else {
			const product_id = Number(this.parameter);
			 this.productoService.getProdutoDetail(product_id).subscribe((producto) => {
				this.usuario_id = producto.usuario_id
				this.product = producto ? producto : null;
			});
		}
	}

	addToCart() {
		let producto: CarritoModel = {
			producto_id: this.product.producto_id,
			producto_nombre: this.product.nombre,
			cantidad: this.cantidad,
			costo: this.product.precio
		}
		this.carritoService.addArticle(producto);
		this.openDialog();
	}

	openDialog() {
		this.modal.openSuccessDialog();
	}

	HacerPreguntaCliente() {
		const usuario = JSON.parse(localStorage.getItem("usuario"));

		const data = { producto_id: Number(this.parameter), usuario_id: usuario.usuario_id, pregunta: this.pregunta }

		this.productoService.HacerPreguntaCliente(data);
		location.reload();

	}
	EnviarRespuestaVendedor(preguntasproductoid:any) {

		
		const id = preguntasproductoid.toString()
		
		const element = document.getElementById(id) as HTMLInputElement;
		const data = { preguntas_producto_id: preguntasproductoid,respuesta: element.value}

		this.productoService.ResponderPreguntaVendedor(data);
		location.reload();

	}

	EsCliente() {
		const usuario = JSON.parse(localStorage.getItem("usuario"));
		if (usuario != null) {
			if(usuario.rol_id == 2){
				this.esVendedor = true;
			}
			if (usuario.rol_id == 3) {
				this.esCliente = true;
			} else {
				this.esCliente = false;
			}
		}
	}

	EsVendedorDelProducto() {
		setTimeout(()=>{

			const usuario = JSON.parse(localStorage.getItem("usuario"));
			if (usuario != null) {
				if (usuario.usuario_id == this.product.usuario_id) {
					this.esVendedorDelProducto = true;
				} else {
					this.esVendedorDelProducto = false;
				}
			}
		},500)

	}

	ExisteRespuestaVendedor(respuesta:any){
		if(respuesta == null){
			return true;
		}else{
			return false;
		}
	}
}
