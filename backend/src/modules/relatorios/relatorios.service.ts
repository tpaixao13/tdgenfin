import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class RelatoriosService {
  constructor(private readonly usuariosService: UsuariosService) {}

  listarPermissoesUsuarios() {
    return this.usuariosService.listarComPermissoes();
  }
}
