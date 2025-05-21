import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
        group[field.key] = [''];
      }
      this.form = this.fb.group(group);
    }

    this.form?.valueChanges.subscribe(values => {
      this.filterChange.emit(values);
    });
  }
}
