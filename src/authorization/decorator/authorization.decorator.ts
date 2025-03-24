import { SetMetadata } from '@nestjs/common';

/**
 * Chave de metadado que indica que a rota não requer proteção.
 */
export const META_UNPROTECTED = 'MetaUnprotected';

/**
 * Chave de metadado que indica que a rota não requer autenticação, mas tentará autenticar.
 */
export const META_UNPROTECTED_AUTH = 'MetaUnprotectedAuth';

/**
 * Decorador que marca uma rota como protegida, ou seja, requer autenticação.
 * 
 * Por padrão, as rotas são protegidas, ou seja, requerem autenticação.
 * 
 * @returns Decorador de metadado.
 */
export const Protected = () => SetMetadata(META_UNPROTECTED, false);

/**
 * Decorador que marca uma rota como pública, ou seja, não requer proteção.
 * 
 * @returns Decorador de metadado.
 */
export const Public = () => SetMetadata(META_UNPROTECTED, true);

/**
 * Decorador que marca uma rota como pública, mas tentará autenticar.
 * 
 * @returns Decorador de metadado.
 */
export const PublicAuth = () => SetMetadata(META_UNPROTECTED_AUTH, true);