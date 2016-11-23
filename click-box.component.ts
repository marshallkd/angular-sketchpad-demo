import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClickBox } from './click-box';

@Component({
  selector: 'my-click-box',
  template: `

    <div class="square" [style.background]="fill()"
    (click)="mouseClickEmit()"
    (mousedown)="mouseDownEmit()"
    (mouseup)="mouseUpEmit()"
    (mousemove)="mouseMoveEmit()"></div>

  `,
  styles: [`
	.square {
	  background: #CAA;
	  width: 2px;
	  height: 2px;
	}
  `]
})



export class ClickBoxComponent{

	@Input() clickBox: ClickBox;
	overlay_color = '#ACC';

	fill (): string {
		if (this.clickBox.flag == true) {
			return this.overlay_color;
		} else {
			return this.clickBox.color;
		}
	}
	
	@Output() clickBoxEmitter = new EventEmitter<[ClickBox, number]>();

	mouseClickEmit () {
		this.clickBoxEmitter.emit([this.clickBox, 0]);
	}

	mouseDownEmit () {
		this.clickBoxEmitter.emit([this.clickBox, 1]);
	}

	mouseUpEmit () {
		this.clickBoxEmitter.emit([this.clickBox, 2]);
	}

	mouseMoveEmit () {
		this.clickBoxEmitter.emit([this.clickBox, 3]);
	}


}

	// todo: Consolidate into one emitter
/*
	clickBox = new ClickBox;

	ngOnInit(): void {
		this.clickBox.x = this.x;
		this.clickBox.y = this.y;
		this.clickBox.color = this.color;

		if (this.x == 0) {
			mockData.push([]);
		}
		mockData[this.y].push(this.clickBox);

	}

	clickBoxEmit () {
		this.clickBoxEmitter.emit(this.clickBox);
	}

	clickBoxEmit2 () {
		this.clickBoxEmitter2.emit(this.clickBox);
	}

	clickBoxEmit3 () {
		this.clickBoxEmitter3.emit(this.clickBox);
	}

	clickBoxEmit4 () {
		this.clickBoxEmitter4.emit(this.clickBox);
	}*/



