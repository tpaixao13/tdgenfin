import { Loader2 } from 'lucide-react';

export interface EnderecoFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Props {
  form: EnderecoFormData;
  onChange: (field: keyof EnderecoFormData, value: string) => void;
  onCepBlur: () => void;
  buscandoCep: boolean;
}

function maskCep(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400';

export default function EmpresaEnderecoForm({ form, onChange, onCepBlur, buscandoCep }: Props) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100 w-full">
        Endereço
      </legend>

      {/* CEP */}
      <div className="flex gap-3 items-end">
        <div className="w-44">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">CEP</label>
          <div className="relative">
            <input
              type="text"
              value={form.cep}
              onChange={(e) => onChange('cep', maskCep(e.target.value))}
              onBlur={onCepBlur}
              placeholder="00000-000"
              maxLength={9}
              className={inputCls}
            />
            {buscandoCep && (
              <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 pb-3">Preenchimento automático ao sair do campo</p>
      </div>

      {/* Logradouro + Número */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Logradouro</label>
          <input
            type="text"
            value={form.logradouro}
            onChange={(e) => onChange('logradouro', e.target.value)}
            placeholder="Rua, Av., etc."
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Número</label>
          <input
            type="text"
            value={form.numero}
            onChange={(e) => onChange('numero', e.target.value)}
            placeholder="Nº"
            className={inputCls}
          />
        </div>
      </div>

      {/* Complemento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Complemento</label>
        <input
          type="text"
          value={form.complemento}
          onChange={(e) => onChange('complemento', e.target.value)}
          placeholder="Sala, andar, bloco (opcional)"
          className={inputCls}
        />
      </div>

      {/* Bairro + Cidade + Estado */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bairro</label>
          <input
            type="text"
            value={form.bairro}
            onChange={(e) => onChange('bairro', e.target.value)}
            placeholder="Bairro"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
          <input
            type="text"
            value={form.cidade}
            onChange={(e) => onChange('cidade', e.target.value)}
            placeholder="Cidade"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
          <input
            type="text"
            value={form.estado}
            onChange={(e) => onChange('estado', e.target.value.toUpperCase().slice(0, 2))}
            placeholder="UF"
            maxLength={2}
            className={inputCls}
          />
        </div>
      </div>

    </fieldset>
  );
}
