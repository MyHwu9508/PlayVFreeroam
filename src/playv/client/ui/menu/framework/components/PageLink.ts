import { LocalStorage } from '../../../../systems/localStorage';
import { menu, menuState } from '../State';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class PageLink extends BaseComponent {
  type = 'link';
  color: string;
  constructor(public text: string, public href: string) {
    super();
    this.proxiedKeys.push('text');
    this.omittedKeys.push('href');
    return this.__getProxy();
  }

  get can() {
    const page = menu.getPage(this.href);
    return page?.can && super.can;
  }

  right() {
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    menuState.setPath(this.href);
  }

  addConfig(config: Partial<Pick<PageLink, 'color'>>) {
    Object.assign(this, config);
    return this;
  }
}
