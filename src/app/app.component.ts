import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "Y-D/MAX FARC";
  currentYear = new Date().getFullYear();
  

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  selectedImage: string | null = null;

  openLightbox(imageUrl: string) {
    this.selectedImage = imageUrl;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }
}