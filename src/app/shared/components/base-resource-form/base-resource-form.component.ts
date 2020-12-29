import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) { 
      this.router = injector.get(Router);
      this.route = injector.get(ActivatedRoute);
      this.formBuilder = injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    //depois de todo o carregamento
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      //new case
      this.createResource();
    } else {
      //edit case
      this.updateResource();
    }
  }


  protected setCurrentAction() {
    this.route.snapshot.url[0].path == 'new' ?
      this.currentAction = 'new' :
      this.currentAction = 'edit';
  }

  protected loadResource() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        // pegando parametro da rota
        switchMap(params => this.resourceService.getById(+params.get("id")))
      )
      .subscribe(resource => {
        this.resource = resource;
        this.resourceForm.patchValue(this.resource);
      }, error => alert('Erro no Servidor, tente mais tarde!'));
    }
  }

  protected setPageTitle() {
    this.currentAction === 'new' ? 
      this.pageTitle = this.creationPageTitle(): 
      this.pageTitle = this.editionPageTitle();
  }

  protected creationPageTitle(): string {
    return 'Novo'
  }

  protected editionPageTitle(): string {
    return `Edição`;
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error),
    );
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error),
    );
  }

  protected actionsForSuccess(resource: T) {
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
    toastr.success("Solicitação processada com sucesso!");
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath, resource.id, "edit"])
    )
  }

  protected actionsForError(error) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor!"];
    }
  }

  protected abstract buildResourceForm(): void;
}
