import {enableProdMode, NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {SettingsComponent} from './settings/settings.component';
import {ProcessViewerComponent} from './process-viewer/process-viewer.component';
import {MaterialComponentsModule} from "./material-components/material-components.module";
import {RouterModule} from '@angular/router';
import {routerConfig} from "./app.router.config";
import {ProcessOverviewComponent} from './process-overview/process-overview.component';
import {ProcessDetailComponent} from './process-detail/process-detail.component';
import {ProcessInstanceListComponent} from './process-instance-list/process-instance-list.component';
import {ProcessInstanceDetailComponent} from './process-instance-detail/process-instance-detail.component';
import {ProcessMigrationDialogComponent} from "./process-migration-dialog/process-migration-dialog.component";
import {HomeComponent} from './home/home.component';
import {ProcessInstanceViewerComponent} from "./process-instance-viewer/process-instance-viewer.component";
import {ProcessInstanceVariableListComponent} from "./process-instance-variable-list/process-instance-variable-list.component";
import { AngularDraggableModule } from 'angular2-draggable';
import {HistoricComponent} from './historic/historic.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      routerConfig,
      { enableTracing: false } // <-- debugging purposes only
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularDraggableModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialComponentsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AppComponent,ProcessMigrationDialogComponent],
  declarations: [AppComponent,HistoricComponent,HomeComponent,ProcessMigrationDialogComponent,SettingsComponent,ProcessViewerComponent, ProcessInstanceViewerComponent, ProcessOverviewComponent, ProcessDetailComponent, ProcessInstanceListComponent, ProcessInstanceDetailComponent, HomeComponent, ProcessInstanceVariableListComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
if (environment.production) {
  enableProdMode();
}

