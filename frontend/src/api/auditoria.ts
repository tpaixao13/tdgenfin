import { api } from './client';
import type { AuditoriaLog, Paginated } from '../types';

export const auditoriaApi = {
  listar: (page = 1, limit = 50) =>
    api
      .get<Paginated<AuditoriaLog>>('/auditoria', { params: { page, limit } })
      .then((r) => r.data),
};
