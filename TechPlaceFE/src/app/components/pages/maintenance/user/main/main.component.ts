import { Component, ViewChild } from '@angular/core';
import { UsuarioModel } from '../../../../../models/usuario.model';
import { UsuarioService } from '../../../../../services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { GuardService } from 'src/app/services/guard.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {


  usuarios: UsuarioModel[] = [
    // Datos de usuarios
  ];

  usuario: UsuarioModel;
  displayedColumns: string[] = ['id', 'nombre', 'identificacion', 'telefono', 'correo_electronico', 'estado', 'editar'];
  dataSource = new MatTableDataSource<UsuarioModel>(this.usuarios);

  pending = true;
  outOfStock = true;
  delivered = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private usuariosService: UsuarioService, private router: Router,
    private guardService: GuardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.guardService.ValidatePermission(this.route.snapshot.routeConfig.path);
    this.usuariosService.GetUsers().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.dataSource = new MatTableDataSource<UsuarioModel>(this.usuarios);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error);
      }
    );
  }
  
}
