import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'phoenix-blog';

  constructor(@Inject(DOCUMENT) document: Document) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = environment.urls.favicon;
    }
  }
}
