export interface ErroIdentificado {
  mensagem: string;
  statusCode: number;
  tipo: 'esperado' | 'inesperado';
  erroOriginal: unknown;
}
