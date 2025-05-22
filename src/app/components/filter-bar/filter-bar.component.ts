import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
  ],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent {
  @Input() fields: { key: string; label: string; type: 'text' | 'select' | 'boolean'; options?: string[] }[] = [];
  @Output() filterChange = new EventEmitter<Record<string, any>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnChanges(): void {
    if (this.fields?.length) {
      const group: Record<string, any> = {};
      for (const field of this.fields) {
        switch (field.type) {
          case 'select':
            group[field.key] = [[]];
            break;
          case 'boolean':
            group[field.key] = [undefined];
            break;
          default:
            group[field.key] = [''];
        }
      }
      this.form = this.fb.group(group);
    }
  
    this.form?.valueChanges.subscribe(values => {
      console.log('Filter values changed:', values);
      this.filterChange.emit(values);
    });
  }  
}