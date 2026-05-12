import { api } from './client';
import type { EnderecoCep } from '../types';

export const enderecosApi = {
  buscarCep: (cep: string) =>
    api
      .get<EnderecoCep>(`/enderecos/cep/${cep.replace(/\D/g, '')}`)
      .then((r) => r.data),
};
