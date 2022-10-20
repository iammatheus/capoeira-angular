import { MestreService } from './../../../services/mestre.service';
import { Mestre } from './../../../models/Mestre';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-mestre-lista',
  templateUrl: './mestre-lista.component.html',
  styleUrls: ['./mestre-lista.component.scss']
})
export class MestreListaComponent implements OnInit {

  modalRef?: BsModalRef;

  public mestres: Mestre[] = [];
  public mestresPorTipo: Mestre[] = [];
  public mestreId = 0;
  public largImg = 100;
  public altImg = 75;
  public margemImg = 2;
  public exibirImg = true;
  public tipo: string;
  public pagination = {} as Pagination;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  constructor(
    private mestreService: MestreService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1
    } as Pagination;
    this.carregarMestres();
  }

  public mostraImagem(imagemURL: string): string {
    return (imagemURL !== '')
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/img/sem-imagem.png';
  }

  public carregarMestres(tipo?: string): void {
    this.spinner.show();

    this.mestreService.getMestres(this.pagination.currentPage, this.pagination.itemsPerPage, tipo)
      .subscribe((res: PaginatedResult<Mestre[]>) => {
        this.mestres = res.result;
        this.pagination = res.pagination;
        this.tipo = tipo;
      },
        error => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os mestres.', 'Erro!')
        },
        () => this.spinner.hide()
      );
  }

  public filtrarMestres(mestre: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.mestreService.getMestres(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          ).subscribe(
            (res: PaginatedResult<Mestre[]>) => {
              this.mestres = res.result;
              this.pagination = res.pagination;
            },
            error => {
              this.spinner.hide();
              this.toastr.error('Erro ao carregar os mestres.', 'Erro!');
              console.error(error);
            },
            () => this.spinner.hide()
          );
        }
      )
    }
    this.termoBuscaChanged.next(mestre.value);
  }

  public exibirImagem(): void {
    this.exibirImg = !this.exibirImg;
  }

  openModal(event: any, template: TemplateRef<any>, mestreId: number): void {
    event.stopPropagation();
    this.mestreId = mestreId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.spinner.show();
    this.modalRef?.hide();
    this.mestreService.deleteMestre(this.mestreId).subscribe(
      (res: any) => {
        if (res.message === 'Deletado') {
          this.carregarMestres();
          this.toastr.success('Mestre deletado.', 'Sucesso!');
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o mestre ${this.mestreId}`, 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheMestre(id: number): void {
    this.router.navigate([`mestres/detalhe/${id}`]);
  }

  public pageChanged($event: any): void {
    this.pagination.currentPage = $event.page;
    this.carregarMestres(this.tipo)
  }

}
