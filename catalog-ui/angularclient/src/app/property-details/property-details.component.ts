import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyType } from '../model/property-type';
import { Property } from '../model/property';
import { handleError } from '../model/errorUtil';
import { PropertiesService } from '../service/properties.service';
import { AlertComponent } from '../alert/alert.component';
import { Alertable } from '../model/alertable';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements Alertable {

  propertiesService: PropertiesService = inject(PropertiesService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  property: Property;
  originalProperty: Property;
  modified = false;
  readonly = true;
  alertMessage = '';

  constructor() {
    this.property = { name: '', type: PropertyType[PropertyType.string]}
    this.originalProperty = this.rememberOriginalProperty(this.property);
    const propertyId = this.route.snapshot.params['propertyId'];
    if (propertyId === 'new') {
      this.onEdit();
    } else {
        this.propertiesService.findById(Number(propertyId))
        .subscribe(
          { next: (property) => {
              this.rememberOriginalProperty(property);
              this.property = property;
            },
            error: (err) => {handleError(this, err);}
          }
        );
    }
  }

  isReadonly(): boolean {
    return this.readonly;
  }

  isAdd(): boolean {
    return this.property.id === undefined;
  }

  onReload(): void {
    this.propertiesService.findById(Number(this.property.id))
    .subscribe(
      {next: (property) => {
        this.rememberOriginalProperty(property);
        this.property = property;
      },
      error: (err) => {handleError(this, err);}
    });
  }

  onEdit(): void {
    this.readonly = false;
  }

  onSave(): void {
    if (this.isAdd()) {
      this.propertiesService.create(this.property).subscribe({next: (property) => {
        this.property = property;
        this.rememberOriginalProperty(property);
        this.readonly = true;
        },
      error: (err) => {handleError(this, err);} });
    } else {
      this.propertiesService.update(this.property).subscribe({next: (property) => {
         this.property = property;
         this.rememberOriginalProperty(property);
         this.readonly = true;
        },
        error: (err) => {handleError(this, err);} });
    }
  }

  onCancel(): void {
    this.readonly = true;
    this.property = this.originalProperty;
    this.rememberOriginalProperty(this.originalProperty);
  }

  onDelete(): void {
    if (this.property.id !== undefined) {
      this.propertiesService.delete(this.property.id).subscribe({next:() => {this.router.navigate(["properties"]);},
      error: (err) => {handleError(this, err);}});
    }
  }

  onBack(): void {
    this.router.navigate(['/properties']);
  }

  onChange(event: any): void {
    this.modified = true;
  }

  get propertyTypeNames(): String[] {
    return Object
        .keys(PropertyType)
        .filter((v) => isNaN(Number(v)));
  }

  showAlert(message: string): void {
    this.alertMessage = message;
  }

  clearAlert() {
    this.alertMessage = '';
  }

  rememberOriginalProperty(property: Property): Property {
    this.originalProperty = {
      id: property.id,
      name: property.name,
      type: property.type
    }
    return this.originalProperty;
  }
}
