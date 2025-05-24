import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './_services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isProduction = false;
  configSource = 'environment files';

  constructor(public configService: ConfigService) {}

  ngOnInit() {
    // Check if we're in production mode
    this.isProduction = this.checkProductionMode();

    // Determine config source
    this.configSource =
      this.isProduction && window.APP_CONFIG
        ? 'runtime configuration (window.APP_CONFIG)'
        : 'environment files';
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getGradientColor(): string {
    const color = this.configService.favColor;
    return `linear-gradient(90deg, ${color}, ${this.lightenColor(color, 20)})`;
  }

  private lightenColor(color: string, percent: number): string {
    // Simple color lightening - you might want to use a more robust solution
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)}`;
    }
    return color;
  }

  private checkProductionMode(): boolean {
    // You might need to inject environment or check it differently based on your setup
    return window.location.hostname !== 'localhost';
  }
}
