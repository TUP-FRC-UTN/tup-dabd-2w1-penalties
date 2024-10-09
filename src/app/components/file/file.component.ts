import { Component, EventEmitter, Input, input, Output } from '@angular/core';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent {
  @Input() index:number=0
  @Input() file!:File
  @Output() selected = new EventEmitter<number>();

  deleteImg(){
    this.selected.emit(this.index)
  }

  truncateFileName(name: string, maxLength: number): string {
    if (name.length <= maxLength) return name;
    const extension = name.includes('.') ? name.split('.').pop() : '';
    const nameWithoutExtension = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name;
    const truncated = nameWithoutExtension.substring(0, maxLength - 1 - (extension?.length || 0));
    return `${truncated}...${extension}`;
  }
}
