import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/productos.service';
import { GuardService } from 'src/app/services/guard.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  validation_message: String = '';
  parameter: Number | null;
  productId: Number | null = null;
  product: ProductoModel | null;
  producto = {
    nombre: '',
    descripcion: '',
    precio: '0',
    cantidad: '0',
    categoria_id: '0',
    estado: '',
    usuario_id: ''
  }

  constructor(private router: Router, private route: ActivatedRoute,
    private guardService: GuardService, private cdr: ChangeDetectorRef, private productoService: ProductoService) { }

  ngOnInit(): void {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    if (urlSegments.includes('edit')) {
      this.route.queryParams.subscribe(params => {
        const parametro = params['id'];
        this.parameter = parametro;
        this.loadData();
      });
    }
  }

  loadData() {
    if (this.parameter == null || this.parameter.toString() == '') {
      this.router.navigateByUrl('/');
    } else {
      const product_id = Number(this.parameter);
      this.productoService.getProdutoDetail(product_id).subscribe((producto) => {
        this.product = producto ? producto : null;
        this.convertProductToTemplate();
      });
    }
  }

  selectedImages: File[] = [];

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedImages.push(files[i]);
    }
    console.log(this.selectedImages);
  }
  getImageUrl(image: File): string {
    return URL.createObjectURL(image);
  }
  removeImage(image: File) {
    const index = this.selectedImages.indexOf(image);
    if (index !== -1) {
      this.selectedImages.splice(index, 1);
    }
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async save() {
    // if(!this.validateForm()){
    //   return;
    // }

    let fotosproducto: any[] = [];

    var convertImg = await this.selectedImages.forEach(async (file) => {
      var img64 = await this.convertFileToBase64(file).then((base64String) => {
        console.log('in base64', base64String);

        fotosproducto.push(
          { "foto_Base64": base64String }
        );
      }).catch((error) => {
        console.error("Hubo un error al convertir el archivo a Base64", error);
      });
    });

    await this.delay(2000);
    const usuario: any = JSON.parse(localStorage.getItem("usuario"));
    let data: any = {
      "producto": [
        {
          "nombre": this.producto.nombre,
          "descripcion": this.producto.descripcion,
          "precio": parseInt(this.producto.precio),
          "cantidad": parseInt(this.producto.cantidad),
          "categoria_id": parseInt(this.producto.categoria_id),
          "estado": this.producto.estado,
          "usuario_id": usuario.usuario_id
        }
      ],
      "fotosproducto": fotosproducto
    };

    // if(this.productId != null){
    if (this.validateForm()) {
      if(this.productId != null){

        data.producto[0].producto_id = this.productId;
        this.productoService.saveProduct(data, false).then(success => {
          if (success) {
            this.router.navigateByUrl('product/management');
          }
        });
      }else{
        data.producto[0].product_id = undefined;
        this.productoService.saveProduct(data, true).then(success => {
          if (success) {
            this.router.navigateByUrl('product/management');
          }
        });
      }
    }

    // }
  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  convertProductToTemplate() {
    this.productId = this.product.producto_id;
    this.producto = {
      nombre: this.product.nombre,
      descripcion: this.product.descripcion,
      precio: this.product.precio ? this.product.precio.toString() : null,
      cantidad: this.product.cantidad ? this.product.cantidad.toString() : null,
      categoria_id: this.product.categoria_id ? this.product.categoria_id.toString() : null,
      estado: this.product.estado,
      usuario_id: this.product.usaurio_id ? this.product.usaurio_id.toString() : null
    }
    this.loadImages();
  }

  loadImages() {
    console.log(this.product);
    if (this.product?.fotosproducto != null) {
      this.product?.fotosproducto.forEach(foto => {
        let imgFile: File = this.base64ToFile(foto.foto_Base64);
        this.selectedImages.push(imgFile);
      });
    }
  }

  base64ToFile(dataurl: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let blob = new Blob([u8arr], { type: mime });
    return new File([blob], 'imagen', { type: mime });
  }

  validateForm(): boolean {
    if (this.producto.nombre.trim().length < 1) {
      this.validation_message = 'Debe agregar un nombre';
    } else if (this.producto.descripcion.trim().length < 1) {
      this.validation_message = "Debe ingresar una descripcion"
    } else if (this.producto.cantidad.trim().length < 1) {
      this.validation_message = "Debe ingresar una cantidad mayor a 0"
    } else if (isNaN(parseInt(this.producto.cantidad))) {
      this.validation_message = "La cantidad debe ser un número"
    }
    else if (this.producto.precio.trim().length < 1) {
      this.validation_message = "Debe ingresar un precio mayor a 0"
    } else if (isNaN(parseFloat(this.producto.precio))) {
      this.validation_message = "El precio debe ser un número"
    } else if (this.producto.estado.trim().length < 1) {
      this.validation_message = 'Debe seleccionar un estado'
    } else if (this.producto.categoria_id.trim().length < 1) {
      this.validation_message = 'Debe seleccionar una categoria'
    } else if (this.selectedImages == null || this.selectedImages.length == 0) {
      this.validation_message = 'Debe cargar al menos 1 imagen'
    }
    else {
      return true;
    }
    return false;
  }
}
