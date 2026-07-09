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
  sliderValue1 = 50;
  sliderValue2 = 50;
  
  selectedImage: string | null = null;
  activeSlider: number | null = null;

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateSlider1(event: Event): void {
    this.sliderValue1 = +(event.target as HTMLInputElement).value;
  }

  updateSlider2(event: Event): void {
    this.sliderValue2 = +(event.target as HTMLInputElement).value;
  }

  openLightbox(imageUrl: string) {
    this.selectedImage = imageUrl;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

  openSlider(id: number) {
    if (window.innerWidth <= 992) {
      this.activeSlider = id;
      document.body.style.overflow = 'hidden';
    }
  }

  closeSlider() {
    this.activeSlider = null;
    document.body.style.overflow = '';
  }

  async submitForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    const originalText = button.innerText;
    button.innerText = 'Envoi en cours...';
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Merci ! Votre demande a bien été envoyée.');
        form.reset();
      } else {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi. Veuillez vérifier votre connexion.');
    } finally {
      button.innerText = originalText;
      button.disabled = false;
    }
  }
}