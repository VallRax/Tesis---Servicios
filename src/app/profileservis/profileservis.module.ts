import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileservisPageRoutingModule } from './profileservis-routing.module';

import { ProfileservisPage } from './profileservis.page';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileservisPageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileservisPage]
})
export class ProfileservisPageModule {}
