import native from 'natives';
import alt from 'alt-client';
import { Page } from '../framework/Page';
import { ContextText } from '../framework/types';

export const page = new Page('Test');

page.onOpen(() => {
  console.log('Page opened');
});

page.onClose(() => {
  console.log('Page closed');
});

alt.on('disconnect', () => {
  native.setLocalPlayerAsGhost(false, false);
});

page
  .addColorPicker('Color Picker', '#FF55F6')
  .onInput(comp => {
    console.log(comp.value);
  })
  .onFinished(comp => {
    console.log('Color Picker finished:', comp.value);
  });

page
  .addInput('Input', 'Value')
  .onInput(comp => {
    console.log(comp.value);
  })
  .onFinished(confirm => {
    console.log('Input finished:', confirm);
  });

page.addOverlay('Overlay', ['Button 1', 'Button 2', 'Button 3', ['select', false], 'Button 5']).onInput(comp => {
  console.log('Overlay:', comp.value);
});

page.addSelect('Select', ['fsfbsfsdfbsdf', ' dahdi asduiha iu', 'Odfg']).onInput(comp => {
  console.log(comp.value);
});

page.addNumberSelect('mappi', 0, 2000, 100).onInput(comp => {
  native.setRadarZoom(comp.value);
});

page.addConfirm('Delete Vehicle?', 'Are you sure?', 'error').onInput(comp => {
  console.log('Confirm pressed');
  comp.color = 'surface';
});

page.addButton('Button').onInput(comp => {
  console.log('Button pressed');
  comp.line = true;
  comp.text = 'Button pressed';
  comp.color = 'secondary';
  comp.lineColor = 'primary';
});
page.addToggle('Toggle');

let slider = 0;
page
  .addSlider('Slider', 0, 100, 1, slider)
  .addContext([{ type: 'text', text: ['Current Value:', { text: '0' }] }])
  .onInput(comp => {
    ((comp.context[0] as ContextText).text[1] as ContextText).text = comp.value.toFixed(1);
    slider = comp.value;
  });

page.addButton('Add Buttons').onInput(() => {
  for (let i = 0; i < slider; i++) {
    page.addButton(`Button ${i}`);
  }
});
