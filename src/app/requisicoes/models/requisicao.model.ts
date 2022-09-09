import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
  id: string;
  funcionario?: Funcionario;
  funcionarioId: string;
  descricao: string;
  departamento?: Departamento;
  departamentoId: string;
  dataAbertura: Date | any;
  equipamento?: Equipamento | null;
  equipamentoId?: string;
}
