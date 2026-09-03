import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErroIdentificado } from '../interfaces/erro-identificado.interface';

@Injectable()
export class TratarErrosCoreService {
  lancar(erroIdentificado: ErroIdentificado): never {
    if (erroIdentificado.erroOriginal instanceof HttpException) {
      throw erroIdentificado.erroOriginal;
    }
    throw new InternalServerErrorException(erroIdentificado.mensagem);
  }
}
