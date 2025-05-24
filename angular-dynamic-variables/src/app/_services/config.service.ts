// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// Declare the global APP_CONFIG
declare global {
  interface Window {
    APP_CONFIG?: EnvironmentConfig;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: EnvironmentConfig;

  constructor() {
    // Initialize config with environment values
    this.config = {
      apiUrl: environment.apiUrl,
      favColor: environment.favColor,
      favCatchPhrase: environment.favCatchPhrase,
    };

    // In production, override with window.APP_CONFIG values where they exist
    if (environment.production && window.APP_CONFIG) {
      // Check and override top-level properties
      if (
        window.APP_CONFIG.apiUrl !== undefined &&
        window.APP_CONFIG.apiUrl !== null
      ) {
        this.config.apiUrl = window.APP_CONFIG.apiUrl;
      }

      // Check and override nested auth properties
      if (window.APP_CONFIG.favColor) {
        this.config.favColor = window.APP_CONFIG.favColor;
      }
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get favColor(): string {
    return this.config.favColor;
  }
  get favCatchPhrase(): string {
    return this.config.favCatchPhrase;
  }
}
export interface EnvironmentConfig{
  apiUrl: string;
  favColor: string;
  favCatchPhrase: string;
}
export interface Environment extends EnvironmentConfig {
  production: boolean;
  cache: {
    logging: boolean;
  };
}
