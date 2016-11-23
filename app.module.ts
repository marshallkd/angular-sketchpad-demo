import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { SketchpadComponent } from './sketchpad.component';
import { ClickBoxComponent } from './click-box.component';

@NgModule({
  	imports: [ 
  	    BrowserModule,
 	],
	declarations: [
	    AppComponent,
	    SketchpadComponent,
	    ClickBoxComponent,

  	],  
  	bootstrap: [ AppComponent ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AppModule { }
