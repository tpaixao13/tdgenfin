interface CardSaldoProps {
  titulo: string;
  valor: number;
  cor?: 'default' | 'green' | 'red' | 'blue' | 'yellow';
  icone?: React.ReactNode;
  descricao?: string;
}

const corMap = {
  default: 'bg-white border-gray-200 text-gray-800',
  green: 'bg-green-50 border-green-200 text-green-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export default function CardSaldo({
  titulo,
  valor,
  cor = 'default',
  icone,
  descricao,
}: CardSaldoProps) {
  const formatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

  return (
    <div className={`rounded-xl border p-5 ${corMap[cor]}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium opacity-70">{titulo}</p>
        {icone && <span className="opacity-60">{icone}</span>}
      </div>
      <p className="text-2xl font-bold">{formatado}</p>
      {descricao && <p className="text-xs mt-1 opacity-60">{descricao}</p>}
    </div>
  );
}
