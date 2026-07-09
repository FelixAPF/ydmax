import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = "Y-D/MAX FARC";
  sliderValue1 = 70;
  sliderValue2 = 70;
  
  selectedImage: string | null = null;
  activeSlider: number | null = null;

  // Variables pour l'animation des compteurs
  experienceCount = 0;
  projectsCount = 0;
  seasonsCount = 0;
  private hasAnimated = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Existing stats counter observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateCounters();
          this.hasAnimated = true;
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('statistiques');
    if (statsSection) {
      observer.observe(statsSection);
    }

    // New scroll-reveal observer
    this.initScrollReveal();
  }
}

  animateCounters() {
    this.animateValue('experienceCount', 0, 40, 2000);
    this.animateValue('projectsCount', 0, 300, 2500);
    this.animateValue('seasonsCount', 0, 4, 1500);
  }

  animateValue(prop: 'experienceCount' | 'projectsCount' | 'seasonsCount', start: number, end: number, duration: number) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress); // Ease out pour ralentir à la fin
      this[prop] = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

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

  private initScrollReveal(): void {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target); // animate once, then stop watching
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  const revealTargets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-stagger'
  );
  revealTargets.forEach(el => revealObserver.observe(el));
}
}