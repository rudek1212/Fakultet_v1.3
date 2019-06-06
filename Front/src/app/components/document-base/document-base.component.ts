import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileType, FileState } from 'src/app/models/api.model';
import { isNil } from 'lodash';
import { enumKeys } from 'src/app/utils/enum-keys';
import { FileStateTranslate } from 'src/app/utils/translate-enum/file-state.translate';
import { FileTypeTranslate } from 'src/app/utils/translate-enum/file-type.translate';

export interface DocumentEntity {
  name: string;
  documentType: FileType;
  author: string;
  createDate: string;
  expireDate: string;
  fileBase64?: string;
  documentState?: FileState;
  errors: string[];
  receivers?: string[];
}

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-document-base',
  templateUrl: './document-base.component.html',
  styleUrls: ['./document-base.component.scss']
})
export class DocumentBaseComponent implements OnInit {

  receivers: string[];
  receiverCtrl: FormControl;
  pdfSrc: string;
  documentForm: FormGroup;

  lastFile: File;

  canChangeFile = true;

  fileTypeOptions: SelectOption[];
  fileStateOptions: SelectOption[];

  errors: string[] = null;

  @Input() buttonLabel: string;
  @Input() externalButtons: TemplateRef<any>;
  @Input() title: TemplateRef<any>;

  @Output() save = new EventEmitter();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.fileStateOptions = enumKeys(FileState).map(enumKey => {
      const enumVal = FileState[enumKey];
      return {
        value: enumVal,
        label: FileStateTranslate[enumVal]
      };
    });

    this.fileTypeOptions = enumKeys(FileType).map(enumKey => {
      const enumVal = FileType[enumKey];
      return {
        value: enumVal,
        label: FileTypeTranslate[enumVal]
      };
    });

    this.receiverCtrl = this.fb.control(null, [Validators.email]);

    this.documentForm = this.fb.group({
      name: [null, Validators.required],
      documentType: [null, Validators.required],
      author: [null, Validators.required],
      createDate: [null, Validators.required],
      expireDate: [null, Validators.required]
    });
  }

  @Input() set entity(entity: DocumentEntity) {
    if (isNil(entity)) {
      return;
    }
    this.receivers = entity.receivers;

    const obj = {
      name: entity.name,
      documentType: entity.documentType,
      author: entity.author,
      createDate: new Date(entity.createDate).toJSON().split(':').slice(0, 2).join(':'),
      expireDate: new Date(entity.expireDate).toJSON().split(':').slice(0, 2).join(':'),
      documentStatus: entity.documentState
    };

    const documentStatusCtrl = this.documentForm.get('documentStatus');

    if (isNil(documentStatusCtrl)) {
      this.documentForm.addControl('documentStatus', this.fb.control(null));
    }

    this.documentForm.setValue(obj);
    this.pdfSrc = entity.fileBase64;

    this.canChangeFile = false;

    this.errors = entity.errors;
  }

  removeReceiver(receiver: string) {
    const index = this.receivers.indexOf(receiver);
    if (index !== -1) {
      this.receivers.splice(index, 1);
    }
  }

  addReceiver() {
    const receiver = this.receiverCtrl.value;
    const index = this.receivers.indexOf(receiver);
    if (index !== -1) {
      return;
    }
    this.receivers.push(receiver);
    this.receiverCtrl.setValue(null);
  }

  onFileChange(event) {

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.lastFile = file;
      this.calculatePdfSrc();
    }
  }

  onSubmit() {

    if (!this.documentForm.valid) {
      return;
    }

    const obj = {
      author: this.documentForm.value.author,
      createdAt: new Date(this.documentForm.value.createDate).toISOString(),
      expiredAt: new Date(this.documentForm.value.expireDate).toISOString(),
      fileType: this.documentForm.value.documentType,
      name: this.documentForm.value.name,
      file: this.lastFile,
      receivers: this.receivers,
      fileState: null
    };
    if (!isNil(this.documentForm.value.documentStatus)) {
      obj.fileState = this.documentForm.value.documentStatus;
    }

    this.save.emit(obj);
  }

  defaultCompareWithFn(newItem: any, oldItem: any) {
    return newItem === oldItem;
  }

  private calculatePdfSrc() {
    const reader = new FileReader();
    reader.readAsDataURL(this.lastFile);
    reader.onload = () => {
      this.pdfSrc = reader.result as string;
    };
  }

}
