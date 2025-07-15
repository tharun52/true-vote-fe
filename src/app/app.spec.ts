import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Navbar } from './shared/navbar/navbar/navbar';
import { Toast } from './shared/toast/toast';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Navbar, Toast, RouterOutlet],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });
});
