import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao {
  id: string;
  descricao: string;
  dataAbertura: Date | any;

  funcionario?: Funcionario;
  funcionarioId: string;

  departamento?: Departamento;
  departamentoId: string;

  equipamento?: Equipamento | null;
  equipamentoId?: string;

  status: string;
  ultimaAtualizacao: Date | any;
  movimentacoes: Movimentacao[];
}
