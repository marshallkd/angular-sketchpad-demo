

export class ClickBox {
	x: number;
	y: number;
	color: string;
	activated: boolean;
	flag: boolean;

	constructor() {
		this.x = -1;
		this.y = -1;
		this.color = '#CAA';
		this.activated = false;
		this.flag = false;
	}

	changeColor(newcolor: string) {
		this.color = newcolor;
	}

	clone(): ClickBox {
		var newBox = new ClickBox();
		newBox.x = this.x;
		newBox.y = this.y;
		newBox.color = this.color;
		return newBox;
	}  

	activate() {
		this.activated = true;
	}

	deactivate() {
		this.activated = false;
	}

	flagBox (boo: boolean) {
		this.flag = boo;
	}

	copy (box: ClickBox) {
		this.x = box.x;
		this.y = box.y;
		this.color = box.color;
		this.activated = box.activated;
		this.flag = box.flag;
	}

	clear() {
		this.color = '#CAA';
		this.activated = false;
		this.flag = false;
	}

}