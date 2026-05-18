import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { PontoFluxoCaixa } from '../types';

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const valor = payload[0].value;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`font-semibold ${valor >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
        {brl(valor)}
      </p>
    </div>
  );
}

interface Props {
  dados: PontoFluxoCaixa[];
}

export default function FluxoCaixaChart({ dados }: Props) {
  if (dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sem lançamentos futuros para projetar.
      </div>
    );
  }

  const minSaldo = Math.min(...dados.map((d) => d.saldo));
  const maxSaldo = Math.max(...dados.map((d) => d.saldo));
  const margin = Math.abs(maxSaldo - minSaldo) * 0.1 || 100;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={dados} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="data"
          tickFormatter={fmtDate}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) =>
            new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
          }
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          domain={[minSaldo - margin, maxSaldo + margin]}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
        <Line
          type="monotone"
          dataKey="saldo"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
