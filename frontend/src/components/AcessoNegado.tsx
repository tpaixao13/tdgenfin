import { Lock } from 'lucide-react';

export default function AcessoNegado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="bg-red-50 rounded-full p-6">
        <Lock size={40} className="text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700">Acesso negado</h2>
      <p className="text-sm text-gray-400 max-w-sm">
        Você não tem permissão para acessar esta funcionalidade. <br />
        Solicite ao administrador do sistema.
      </p>
    </div>
  );
}
