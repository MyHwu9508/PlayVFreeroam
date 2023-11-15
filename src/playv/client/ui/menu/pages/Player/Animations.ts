import alt from 'alt-client';
import { Page } from '../../framework/Page';
import { menu } from '../../framework/State';
import native from 'natives';
import { LocalStorage } from '../../../../systems/localStorage';
import { pushToast } from '../../../hud/toasts';
import { Overlay } from '../../framework/components/Overlay';

const customAnimations: AnimationDictionary[] = JSON.parse(alt.File.read('@assets/customAnimations.json'));
export interface AnimationDictionary {
  categoryName: string;
  animations: Animation[];
}

export interface Animation {
  Name: string;
  Dict: string;
  Anim: string;
  Flag?: number;
}

const page = new Page('Animations');

page.addButton('Stop All Animations').onInput(() => {
  alt.emitServerRaw('stopAnyAnimation');
});

page
  .addOverlay('Play Favorite Animation', [])
  .onInput(comp => {
    const savedAnimations = LocalStorage.get('savedAnimations');
    const anim = savedAnimations[comp.currentIndex];

    if (!anim) return pushToast('error', 'This animation is not saved!');
    alt.emitServerRaw('playAnimation', anim[1], anim[2], anim[3]);
  })
  .onBeforeActive(async comp1 => {
    const savedAnimations = LocalStorage.get('savedAnimations');
    comp1.inputs = savedAnimations.map(x => x[0]);
  });

page.addConfirm('Clear Favorite Animations', 'Are you sure you want to clear all saved animations?').onInput(() => {
  LocalStorage.set('savedAnimations', []);
});

page.addButton('').addConfig({ line: true, lineColor: 'primary' });

Object.values(customAnimations).forEach(animDict => {
  const animPage = new Page(animDict.categoryName);
  menu.addPage('/player/animations/' + animDict.categoryName, animPage);
  page.addLink(animDict.categoryName, '/player/animations/' + animDict.categoryName);

  animDict.animations.forEach(anim => {
    animPage.addOverlay(anim.Name, ['Play', 'Stop Animation', 'Save as Favorite']).onInput(comp => {
      switch (comp.value) {
        case 'Play':
          alt.emitServerRaw('playAnimation', anim.Dict, anim.Anim, anim.Flag);
          break;
        case 'Save as Favorite':
          {
            const savedAnimations = LocalStorage.get('savedAnimations');
            if (savedAnimations.findIndex(x => x[1] === anim.Dict && x[2] === anim.Anim) !== -1) return pushToast('error', 'This animation is already saved!');
            savedAnimations.push([anim.Name, anim.Dict, anim.Anim, anim.Flag]);
            LocalStorage.set('savedAnimations', savedAnimations);
          }
          break;
        case 'Stop Animation':
          alt.emitServerRaw('stopAnyAnimation');
          break;
      }
    });
  });
});

export default page;
