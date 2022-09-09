import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado$: Subscription;

  public form: FormGroup;
  public funcionarioLogadoId: string;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      requisicao: new FormGroup({
        id: new FormControl(""),

        descricao: new FormControl("", [Validators.required, Validators.minLength(4)]),
        dataAbertura: new FormControl(""),

        funcionario: new FormControl(""),
        funcionarioId: new FormControl(""),

        departamentoId: new FormControl("", [Validators.required]),
        departamento: new FormControl(""),

        equipamento: new FormControl(""),
        equipamentoId: new FormControl(""),
      })
    });

    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.requisicoes$.subscribe(console.log);

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email = usuario?.email!;

      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => this.funcionarioLogadoId = funcionario.id)
    })
  }

  get id(): AbstractControl | null {
    return this.form.get("requisicao.id");
  }

  get funcionarioId(): AbstractControl | null {
    return this.form.get("requisicao.funcionarioId");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("requisicao.descricao");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get("requisicao.equipamentoId");
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  public async salvar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    const dataAbertura = new Date();
    this.form.get("requisicao.dataAbertura")?.setValue(dataAbertura.toLocaleDateString());

    this.form.get("requisicao.funcionarioId")?.setValue(this.funcionarioLogadoId);

    if (requisicao) {
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        funcionario,
        departamento,
        equipamento
      }

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {

        if (requisicao) {
          await this.requisicaoService.editar(this.form.get("requisicao")?.value);
        }

        else {
          await this.requisicaoService.inserir(this.form.get("requisicao")?.value);
        }

        this.toastrService.success(`A requisição foi salva com sucesso!`, "Cadastro de Requisições");
      }

      else this.toastrService.error("A requisição precisa ser preenchida.", "Cadastro de Requisições");

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1") {
        this.toastrService.error(`Houve um erro ao salvar a requisição. Tente novamente.`, "Cadastro de Requisições");
      }
    }
  }

  public async excluir(requisicao: Requisicao) {
    try {
      await this.requisicaoService.excluir(requisicao);

      this.toastrService.success(`A requisição foi excluída com sucesso!`, "Cadastro de Requisições");

    } catch (error) {
      this.toastrService.error(`Houve um erro ao excluir a requisição. Tente novamente.`, "Cadastro de Requisições");
    }
  }
}
