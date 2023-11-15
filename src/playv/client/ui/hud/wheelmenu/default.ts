import { WheelMenu } from './wheelFramework';

const wheel = new WheelMenu('Default');

wheel.add('Item 1', 'This is item 1', 'icon', () => console.log('HI FROM ITEM 1'));
wheel.add('Item 2', 'This is item 2', 'icon', () => console.log('HI FROM ITEM 2'));
wheel.add('Item 3', 'This is item 3', 'icon', () => console.log('HI FROM ITEM 3'));
wheel.add('Item 4', 'This is item 4', 'icon', () => console.log('HI FROM ITEM 4'));
wheel.add('Item 5', 'This is item 5', 'icon', () => console.log('HI FROM ITEM 5'));
wheel.add('Item 6', 'This is item 6', 'icon', () => console.log('HI FROM ITEM 6'));
wheel.add('Item 7', 'This is item 7', 'icon', () => console.log('HI FROM ITEM 7'));
wheel.add('Item 8', 'This is item 8', 'icon', () => console.log('HI FROM ITEM 8'));

export default wheel;
