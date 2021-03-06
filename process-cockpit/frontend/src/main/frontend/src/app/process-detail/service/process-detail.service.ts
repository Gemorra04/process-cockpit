/* tslint:disable:max-line-length */
import {Injectable} from '@angular/core';
import {SettingsService} from "../../settings/service/settings.service";
import {HttpClient} from '@angular/common/http';
import {ProcessInstanceListService} from "../../process-instance-list/service/process-instance-list.service";
import {Router} from '@angular/router';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProcessDetailService {
  private endpointXML: string = 'process-definition/{id}/xml';

  private endpointToken: string = 'process-definition/{id}/statistics?incidents=true';

  private endpointActivityHistory: string = 'history/activity-instance?processDefinitionId={id}';

  private endpointAllVersions: string = 'process-definition?key={key}';

  private endpointLatestVersion: string = 'process-definition?key={key}&latest=true';

  private retryJob: string = 'job/{jobId}/retries';

  private allJobsWithException: string = 'job?withException=true&processDefinitionKey={processDefinitionKey}';

  private generateMigrationPlan: string = 'migration/generate';

  private executeMigrationPlan: string = 'migration/execute';

  constructor(private http: HttpClient, private SettingsService: SettingsService, private ProcessInstanceListService: ProcessInstanceListService,private Router: Router) {
  }
  private allInstancesForProcessDefinitionId : string = 'process-instance/?processDefinitionId={id}';

  private deleteProcessInstance : string = 'process-instance/{id}';

  private deleteProcessDefinition : string = 'process-definition/{id}?cascade=true&skipCustomListeners=true';

  public getProcessXML(processDefinitionId) {
    return this.http.get(this.SettingsService.getRestCallUrl(this.endpointXML.replace('{id}', processDefinitionId)));
  }

  public getProcessTokens(processDefinitionId) {
    return this.http.get(this.SettingsService.getRestCallUrl(this.endpointToken.replace('{id}', processDefinitionId)));
  }

  public getActivityHistory(processDefinitionId) {
    return this.http.get(this.SettingsService.getRestCallUrl(this.endpointActivityHistory.replace('{id}', processDefinitionId)));
  }

  public getAllVersions(processDefinitionKey) {
    return this.http.get(this.SettingsService.getRestCallUrl(this.endpointAllVersions.replace('{key}', processDefinitionKey)))
      .pipe(map((source: any[]) => source.sort((a, b) => (a.version > b.version) ? 1 : ((b.version > a.version) ? -1 : 0))));
  }

  public getLatestVersion(processDefinitionKey) {
    return this.http.get(this.SettingsService.getRestCallUrl(this.endpointLatestVersion.replace('{key}', processDefinitionKey)));
  }


  private retries = {"retries": 1};

  retryAllProcesses(processDefinitionKey) {
    this.http.get(this.SettingsService.getRestCallUrl(this.allJobsWithException.replace('{processDefinitionKey}', processDefinitionKey))).subscribe((data: any[]) => {
      data.forEach(job => {
          this.retrySingleJob(job);
        }
      );
      return data.length;
    });
  }

  public retrySingleJob(job) {
    this.http.put(this.SettingsService.getRestCallUrl(this.retryJob.replace('{jobId}', job.id)), this.retries).subscribe();
  }

  migrateVersion(processDefinitionKey: any, versionFrom: any, versionTo: any) {
    let request = {
      "sourceProcessDefinitionId": versionFrom,
      "targetProcessDefinitionId": versionTo,
      "updateEventTriggers": false
    };
    this.http.post(this.SettingsService.getRestCallUrl(this.generateMigrationPlan), request).subscribe((migrationPlan: any) => {
      this.ProcessInstanceListService.getInstances({
        "processDefinitionId": versionFrom
      }).subscribe((processInstanceIds:any[]) => {
        let migration = {
          "migrationPlan": migrationPlan,
          "processInstanceIds": processInstanceIds.map(processInstanceId => processInstanceId.id),
          "skipCustomListeners": true
        }
        this.http.post(this.SettingsService.getRestCallUrl(this.executeMigrationPlan), migration).subscribe();
      });
    });
  }

    deleteAllProcesses(processDefinitionId) {
        this.http.get(this.SettingsService.getRestCallUrl(this.allInstancesForProcessDefinitionId.replace('{id}',processDefinitionId))).subscribe((data:any[]) => {
            data.forEach(instance =>{
              this.http.delete(this.SettingsService.getRestCallUrl(this.deleteProcessInstance.replace('{id}',instance.id))).subscribe();
                }
            );
            return data.length;
        });
    }

    removeProcessDefinition(processDefinitionKey) {
        this.getAllVersions(processDefinitionKey)
            .subscribe((data: any[]) => {
               data.forEach( dataItem =>
                    this.http.delete(this.SettingsService.getRestCallUrl(this.deleteProcessDefinition.replace('{id}', dataItem.id))).subscribe()
               );
            });
    }

    openSubProcess(processDefintionKey){
      this.getLatestVersion(processDefintionKey).subscribe(data =>{
        this.Router.navigate(['/processDetail', data[0].id]);
      });
    }
}
