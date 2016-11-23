import { Component } from '@angular/core';
import { SketchpadComponent } from './sketchpad.component';


@Component({
    selector: 'my-app',
    template: `

		<my-sketchpad [x_max]="x_max" [y_max]="y_max" [color]="color" [fontsize]="fontsize"></my-sketchpad>

  	`,
  	styles: [`

  	`]
})


export class AppComponent {

	//Get these from global variable
	x_max = 100;
	y_max = 100;
	color = 'black';
	fontsize = 1;

}
