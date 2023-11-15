import { Page } from '../../framework/Page';
import alt from 'alt-client';
import native from 'natives';

const page = new Page('Scenarios');
const scenarios: string[] = JSON.parse(alt.File.read('@assets/dump/scenariosCompact.json'));

page.addButton('Stop All Scenarios').onInput(() => {
  alt.emitServerRaw('stopAnyAnimation');
});

for (const scenario of scenarios) {
  page.addButton(scenario).onInput(() => {
    native.taskStartScenarioInPlace(localPlayer, scenario, 0, true);
  });
}

export default page;
