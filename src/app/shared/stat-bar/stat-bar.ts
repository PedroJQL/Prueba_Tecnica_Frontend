import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-bar.html',
  styleUrl: './stat-bar.css'
})
export class StatBarComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() percentage = 0;

  get barClass(): string {
    if (this.percentage > 65) return 'green';
    if (this.percentage >= 41) return 'orange';
    return 'red';
  }
}