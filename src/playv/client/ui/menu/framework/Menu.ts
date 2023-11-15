import type { Page } from './Page';
import type { MenuState } from './State';

export class Menu {
  private pages: Map<string, Page> = new Map();
  webViewReady: boolean = false;

  constructor(public state: MenuState) {}

  addPage(path: string, page: Page) {
    this.pages.set(path, page);
  }

  getPage(path: string) {
    return this.pages.get(path);
  }

  hasPage(path: string) {
    return this.pages.has(path);
  }

  removePage(path: string) {
    this.pages.delete(path);
    if (this.state.currentPath === path) this.state.traceBackPath();
  }

  removePagesContaining(path: string) {
    for (const [key] of this.pages) {
      if (key.includes(path)) this.pages.delete(key);
    }
    if (this.state.currentPath?.includes(path)) this.state.traceBackPath();
  }
}
