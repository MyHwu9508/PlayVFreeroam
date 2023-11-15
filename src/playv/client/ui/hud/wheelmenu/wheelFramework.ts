export const wheels: Map<string, WheelMenu> = new Map();
let idCounter = 0;

type MenuItem = {
  id: number;
  name: string;
  description: string;
  icon: string;
  onInput?: () => void;
  href?: string;
};

export class WheelMenu {
  items: MenuItem[] = [];
  constructor(
    public name: string,
    public onBeforeOpenCallback?: (items: string[][]) => Promise<void> | void,
  ) {}

  getForWebView() {
    return this.items.map((item) => [item.id, item.name, item.description, item.icon]);
  }

  add(name: string, description: string, icon: string, action: () => void | string) {
    const item: MenuItem = { id: idCounter++, name, description, icon };
    if (typeof action === 'string') {
      item.href = action;
    } else {
      item.onInput = action;
    }
    this.items.push(item);
  }
}
