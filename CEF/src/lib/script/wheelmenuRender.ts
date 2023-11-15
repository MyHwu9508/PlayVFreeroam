import { browser } from '$app/environment';
import * as PIXI from 'pixi.js';

const textureNames = ['/img/registerWindow/joystick.png'];
const textures: Record<string, PIXI.Texture> = {};
if (browser) {
  for (const name of textureNames) {
    textures[name] = PIXI.Texture.from(name);
    textures[name].baseTexture.anisotropicLevel = 16;
  }
}

export function createWheelmenuRenderApp(resizeTo: Window | HTMLElement, elements: string[][]) {
  const app = new PIXI.Application({ resizeTo, backgroundAlpha: 0, antialias: true });
  const width = app.screen.width;
  const height = app.screen.height;
  const center = { x: width / 2, y: height / 2 };
  const radius = (width < height ? width : height) / 3.1;
  const segments = elements.length;
  const segmentAngle = (2 * Math.PI) / segments;
  const start = -segmentAngle / 2 - Math.PI / 2;
  let selectedElement = 0;
  const selectTweenDuration = 0.65;
  let selectRotation = start;
  let selectRotationTarget = start;
  const colorString = getComputedStyle(document.body).getPropertyValue('--color-primary-600');
  const color = new PIXI.Color(colorString.split(' ').map((c) => Number(c) / 255));
  const surfaceColorString = getComputedStyle(document.body).getPropertyValue('--color-surface-200');
  const surfaceColor = new PIXI.Color(surfaceColorString.split(' ').map((c) => Number(c) / 255));
  let stageScale = 0;
  let stageScaleTarget = 1;
  const introTweenDurationScale = 0.25;
  const bobTweenDurationScale = 0.65;
  const stageScaleBobMax = 1.05;
  app.stage.position.set(center.x - center.x * stageScale, center.y - center.y * stageScale);
  app.stage.scale.set(stageScale);

  function createElement(i: number) {
    const image = new PIXI.Sprite(textures['/img/registerWindow/joystick.png']);
    image.anchor.set(0.5);
    image.width = radius / 3;
    image.height = radius / 3;
    const angle = start + i * segmentAngle + segmentAngle / 2;
    image.x = center.x + radius * Math.cos(angle);
    image.y = center.y + radius * Math.sin(angle);
    return image;
  }

  //TODO Resize with window
  const bgArc = new PIXI.Graphics();
  bgArc.lineStyle(radius / 2.7, surfaceColor);
  bgArc.drawCircle(center.x, center.y, radius);
  app.stage.addChild(bgArc);

  const select = new PIXI.Graphics();
  select.lineStyle(radius / 2.5, color);
  select.arc(center.x, center.y, radius, start, start + segmentAngle);
  const display = select.clone();
  display.rotation = select.rotation;
  bgArc.addChild(display);

  const font = getComputedStyle(document.body).getPropertyValue('--theme-font-family-base').split(',');
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  const texts = new PIXI.Container();
  const textTitle = new PIXI.Text('Title', {
    fontFamily: font,
    fontSize: fontSize * 8,
    fontWeight: 'bold',
    align: 'center',
    wordWrap: true,
    wordWrapWidth: radius * 2.5,
    fill: surfaceColor.toHex(),
  });
  const textDescription = new PIXI.Text('Description' + font, {
    fontFamily: font,
    fontSize: fontSize * 4,
    align: 'center',
    wordWrap: true,
    wordWrapWidth: radius * 2.5,
    fill: surfaceColor.toHex(),
  });
  texts.addChild(textTitle);
  textTitle.anchor.set(0.5, 0);
  textTitle.y = -textTitle.height;
  textTitle.scale.set(0.5);
  textDescription.anchor.set(0.5, 0);
  textDescription.y = textTitle.y + textTitle.height;
  textDescription.scale.set(0.5);
  texts.addChild(textDescription);
  texts.position.set(center.x, center.y);
  app.stage.addChild(texts);

  const filter = new PIXI.ColorMatrixFilter();
  filter.matrix = [0, 0, 0, color.red, 0, 0, 0, 0, color.green, 0, 0, 0, 0, color.blue, 0, 0, 0, 0, 1, 0];
  const whiteFilter = new PIXI.ColorMatrixFilter();
  whiteFilter.matrix = [
    0,
    0,
    0,
    surfaceColor.red,
    0,
    0,
    0,
    0,
    surfaceColor.green,
    0,
    0,
    0,
    0,
    surfaceColor.blue,
    0,
    0,
    0,
    0,
    1,
    0,
  ];

  const images = new PIXI.Container();
  const whiteImages = new PIXI.Container();
  for (let i = 0; i < segments; i++) {
    images.addChild(createElement(i));
    const whiteImage = createElement(i);
    whiteImage.filters = [whiteFilter];
    whiteImages.addChild(whiteImage);
  }
  images.filters = [filter];
  const mask = new PIXI.MaskData(select);
  whiteImages.mask = mask;
  app.stage.addChild(images);
  app.stage.addChild(whiteImages);

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  app.stage.addEventListener('pointermove', (e) => {
    const angle = Math.atan2(e.y - center.y, e.x - center.x);
    const newElement = getNearestSegment(angle, segments);
    if (selectedElement === newElement) return;
    selectedElement = newElement;
    selectRotation = selectRotation % (2 * Math.PI);
    if (selectRotation < 0) selectRotation += 2 * Math.PI;
    const targetRotation = start + selectedElement * segmentAngle;
    selectRotationTarget =
      Math.abs(targetRotation - selectRotation) > Math.PI ? targetRotation + 2 * Math.PI : targetRotation;
    stageScaleTarget = stageScaleBobMax;
  });
  app.ticker.add((delta) => {
    if (selectRotation !== selectRotationTarget) {
      selectRotation += (selectRotationTarget - selectRotation) * (delta * selectTweenDuration);
      display.clear();
      display.lineStyle(radius / 2.5, color);
      display.arc(center.x, center.y, radius, selectRotation, selectRotation + segmentAngle);
      select.clear();
      select.lineStyle(radius / 2.5, color);
      select.arc(center.x, center.y, radius, selectRotation, selectRotation + segmentAngle);
    }
    if (stageScale !== stageScaleTarget) {
      const stageTweenDuration = stageScaleTarget <= 1 ? introTweenDurationScale : bobTweenDurationScale;
      stageScale += (stageScaleTarget - stageScale) * (delta * stageTweenDuration);
      app.stage.position.set(center.x - center.x * stageScale, center.y - center.y * stageScale);
      app.stage.scale.set(stageScale);
    }
    if (stageScale >= stageScaleBobMax - 0.01) {
      stageScaleTarget = 1;
    }
  });

  return app;
}

function getNearestSegment(angle: number, segments: number) {
  angle += Math.PI / 2;
  const segmentAngle = (2 * Math.PI) / segments;
  const index = Math.round(angle / segmentAngle);
  return index < 0 ? segments + index : index;
}
