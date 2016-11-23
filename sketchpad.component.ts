import { Component, Input, Output, OnInit } from '@angular/core';
import { ClickBox } from './click-box';
import { Stroke } from './stroke';

@Component({
  selector: 'my-sketchpad',
  template: `

  	<div>
	  	<ul class="row" *ngFor="let row of sketchPad">
			<li *ngFor="let box of row">

				<my-click-box [clickBox]="box"
				(clickBoxEmitter)="assignToggle($event)"></my-click-box>

			</li>
		</ul>
	</div>


  `,
  styles: [`
	ul {
		list-style: none;
		margin: 0;
	}

	.row {
		display:flex;
	}
`]
})



export class SketchpadComponent {

	@Input() x_max: number;
	@Input() y_max: number;
	@Input() color: string;
	@Input() fontsize: number;

	x_start: number;
	y_start: number;
	drag: boolean;

	//put in global file
	default_color = '#CAA';

	sketchPad: ClickBox[][] = [];
	stroke: Stroke = null;
	selectedStrokeView: Stroke = null;
	selectedStrokeData: Stroke = null;

	isMouseDown: boolean = false;

	strokeList: Stroke[] = [];

	ngOnInit(): void {

		for (var x = 0; x < this.x_max; x++) {
			for (var y = 0; y < this.y_max; y++) {
				if (x == 0) {
					this.sketchPad.push([]);
				}
				var box = new ClickBox;
				box.x = x;
				box.y = y;

				this.sketchPad[y].push(box);	
			}
		}
	}

	assignToggle(data: any[]) {
		var box = data[0];
		var id = data[1];
		switch (id) {

			case 0:
				this.toggleMouseClick(box);
				break;

			case 1:
				this.toggleMouseDown(box);
				break;

			case 2:
				this.toggleMouseUp(box);
				break;

			case 3:
				this.toggleMouseMove(box);
				break;
			
			default:
				console.log("error in switch");
				break;
		}
	}

	// on mouse down, the user will either draw a stroke or select a stroke
	// depending on whether a stroke has been selected and where the mouse is
	toggleMouseDown(clickBox: ClickBox) {
		if (this.selectedStrokeView && this.selectedStrokeView.containsBox(clickBox)) {

			this.x_start = clickBox.x;
			this.y_start = clickBox.y;
			this.drag = true;
			console.log("This would be dragged");

		} else {

			this.selectedStrokeData = null;
			this.selectedStrokeView = null;
			this.isMouseDown = true;
			this.stroke = new Stroke;
		}

		console.log("mousedown");
	}

	toggleMouseMove(clickBox: ClickBox) {

		if (this.drag == true) {
			this.selectedStrokeData = this.deleteStroke(this.selectedStrokeData);
			this.moveStroke(this.selectedStrokeData, clickBox.x-this.x_start, clickBox.y-this.y_start);
			this.x_start = clickBox.x;
			this.y_start = clickBox.y;
			this.strokeList.push(this.selectedStrokeData);
			this.clearSketchPad();
			this.repopulate();

		} else {

			if (this.isMouseDown) {
				
				var array = this.strokeWidth(clickBox);

				for (let box of array) {
					if (!this.sketchPad[box.y][box.x].activated){
						box.changeColor(this.color);
						this.sketchPad[box.y][box.x].activate();
						this.stroke.boxes.push(box);
					}
				}

				this.drawStroke(this.stroke);

			}
		}

		console.log("mousemove");
	}

	toggleMouseUp(clickBox: ClickBox) {

		this.drag = false;
		this.isMouseDown = false;

		if (this.stroke){
			this.stroke.deactivate();
			this.strokeList.push(this.stroke);
		}

		console.log("mouseup");
	}

	toggleMouseClick(clickBox: ClickBox) {

		this.selectedStrokeData = this.getStroke(clickBox);
		this.selectedStrokeView = this.trimStroke(this.selectedStrokeData)
		
		if (!this.selectedStrokeData) {
			this.stroke = new Stroke;

			var array = this.strokeWidth(clickBox);

			for (let box of array) {
				box.changeColor(this.color);
				this.stroke.boxes.push(box);		
			}

			this.drawStroke(this.stroke);		
			this.strokeList.push(this.stroke);
		}		

		console.log("mouseclick");
	}















	///////////////////////////////////////////////////////////////////////////////
	// Generic functions
	///////////////////////////////////////////////////////////////////////////////

	dist(x1: number, y1: number, x2:number, y2: number): number {
		return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
	}




	///////////////////////////////////////////////////////////////////////////////
	// DATA --------------> VIEW
	///////////////////////////////////////////////////////////////////////////////

	unselectStroke() {

	}
	
	trimStroke(stroke: Stroke): Stroke { // trims sketchpad ClickBoxes which correspond to the stroke data

		if (stroke) {
			var trimStroke = new Stroke;
			for (let box of stroke.boxes) {
				if ((box.x >= 0) && (box.x < this.x_max) && (box.y >= 0) && (box.y < this.y_max)) {
					trimStroke.boxes.push(this.sketchPad[box.y][box.x]);
				}
			}
			return trimStroke;
		} else {
			return null;
		}
	}

	// input should be stroke data, fit for the sketchpad
	drawStroke(stroke: Stroke) {
		for (let box of stroke.boxes) {
			if ((box.x >= 0) && (box.x < this.x_max) && (box.y >= 0) && (box.y < this.y_max)) {
				this.sketchPad[box.y][box.x].copy(box);
			}
		}
	}

	// redraw all strokes
	repopulate() {
		for (let str of this.strokeList) {
			this.drawStroke(str);
		}
	}

	removeStroke(stroke: Stroke) {
		var trim = this.trimStroke(stroke);
		this.strokeList.splice(this.strokeList.indexOf(stroke), 1);
		for (let box of trim.boxes) {
			for (let strk of this.strokeList) {
				if (strk.containsBox(box)) {
					var index = strk.containsBox(box);
					box.color = strk.boxes[index].color;
				} else {
					box.color = this.default_color;
				}
			}
		}
	}

	///////////////////////////////////////////////////////////////////////////////
	// DATA --------------> DATA
	///////////////////////////////////////////////////////////////////////////////


	// returns true if a stroke was cleaned, false if no strokes were cleaned
	cleanStrokes(): boolean {
		for (var i = 0; i < this.strokeList.length - 1; i++) {
			for (var j = i+1; j < this.strokeList.length; j++) {
				var count: number = 0;
				for (let box of this.strokeList[i].boxes) {
					if (!this.strokeList[j].containsBox(box)) {
						break;
					} else {
						count += 1;
					}
				}

				if (count == this.strokeList[i].boxes.length) {
					this.strokeList.splice(i, 1);
					return true;
				}
			} 
		}

		return false;
	}

	deleteStroke(stroke: Stroke): Stroke {
		this.strokeList.splice(this.strokeList.indexOf(stroke), 1);
		return stroke;
	}

	concatStrokes(strk1: Stroke, strk2: Stroke): Stroke {
		var strk = new Stroke;
		for (let box of strk1.boxes) {
			strk.boxes.push(box);
		}

		for (let box of strk2.boxes) {
			strk.boxes.push(box);
		}

		return strk;
	}

	moveStroke(stroke: Stroke, dx: number, dy: number) {
		for (let box of stroke.boxes){
			box.x = box.x + dx;
			box.y = box.y + dy;
		}
	}

	// experimental method for connecting strokes
	snap() {

	}




	///////////////////////////////////////////////////////////////////////////////
	// VIEW --------------> DATA
	///////////////////////////////////////////////////////////////////////////////



	//
	strokeWidth(clickBox: ClickBox): ClickBox[] {
		var blot: ClickBox[] = [];
		var f = this.fontsize;
		for (var x = clickBox.x-f; x <= clickBox.x+f; x++) {
			for (var y = clickBox.y-f; y <= clickBox.y+f; y++) {
				if (this.dist(x, y, clickBox.x, clickBox.y) <= this.fontsize+.5) {
					blot.push(this.sketchPad[y][x].clone());
				}
			}
		}

		return blot;
	}

	// returns the highest index element of strokeList which contains box
	getStroke(box: ClickBox): Stroke {
		for (let strk of this.strokeList.reverse()) {
			if (strk.containsBox(box)) {
				this.strokeList.reverse();
				return strk;
			}
		}

		return null;
	}


	///////////////////////////////////////////////////////////////////////////////
	// VIEW --------------> VIEW
	///////////////////////////////////////////////////////////////////////////////

	clearSketchPad() {
		for (let row of this.sketchPad) {
			for (let box of row) {
				box.clear();
			}
		}
	}





}

