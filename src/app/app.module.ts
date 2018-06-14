import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';
import {TreeModule} from 'primeng/tree';
import {GrowlModule} from 'primeng/growl';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SliderModule, Slider} from 'primeng/slider';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import {MaxValidator} from './directives/max-directive';
import {MinValidator} from './directives/min-directive';
import {NodeService} from './services/node.service';

@NgModule({
  declarations: [
    AppComponent,
    MinValidator,
    MaxValidator
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TreeModule,
    GrowlModule,
    OverlayPanelModule,
    SliderModule,
    TabViewModule,
    PanelModule,
    ButtonModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [NodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
