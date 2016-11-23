import { ClickBox } from './click-box';

export class Stroke {
	boxes: ClickBox[];

	constructor () {
		this.boxes = [];
	}

	changeColor(newcolor: string) {
		for (let box of this.boxes) {
			box.changeColor(newcolor);
		}
	}

	containsBox(clickBox: ClickBox): number {
		for (let box of this.boxes) {
			if ((box.x == clickBox.x) && (box.y == clickBox.y)) {
				return this.boxes.indexOf(box);
			}
		}

		return null;
	}

	clone(): Stroke {
		var stroke = new Stroke;
		for (let box of this.boxes) {
			stroke.boxes.push(box.clone())
		}

		return stroke;
	}

	deactivate() {
		for (let box of this.boxes) {
			box.deactivate();
		}
	}

	flagStroke (boo: boolean) {
		for (let box of this.boxes) {
			box.flagBox(boo);
		}
	}


}