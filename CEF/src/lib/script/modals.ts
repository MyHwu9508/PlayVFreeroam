import { writable } from 'svelte/store';
type TextArea = {
  title: string;
  text: string;
  editable: boolean;
  id: string;
  type: 'textArea';
};
type Modals = TextArea;

export const menuModals = writable<Modals[]>([]);

export function registerMenuModals() {
  alt.on('modal:textArea', showTextArea);
}

function showTextArea(title: string, text: string, editable: boolean, id: string) {
  menuModals.update(modals => [
    ...modals,
    {
      title,
      text,
      editable,
      id,
      type: 'textArea',
    },
  ]);
}
