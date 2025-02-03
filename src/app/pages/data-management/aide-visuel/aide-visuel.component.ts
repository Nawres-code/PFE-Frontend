import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Device, DeviceData, Image, ImageD, TenantData } from '../../../@core/data/data';
import { DataManagementService } from '../../../@core/service/data-management.service';

@Component({
  selector: 'ngx-aide-visuel',
  templateUrl: './aide-visuel.component.html',
  styleUrls: ['./aide-visuel.component.scss']
})
export class AideVisuelComponent implements OnInit {


  public imageSrc: string = '';
  iconDelete: boolean;
  image: Image = new Image();
  imageData: ImageD = new ImageD();
  devices: DeviceData[] = [];
  images: any[] = [];

  private alive: boolean = true;

  options = [
    { value: 'MO', label: 'M.Opérateur', checked: true }, //checked true not working
    { value: 'AV', label: 'Aide Visuel' },
  ];

  constructor(public dataManagementService: DataManagementService) {
  }

  init(tenantData: TenantData) {
    this.devices = [];
    for (let j = 0; j < this.dataManagementService.tenantData.zones.length; j++) {
      let z = this.dataManagementService.tenantData.zones[j];
      for (let i = 0; i < z.installations.length; i++) {
        let inst = z.installations[i];
        for (let k = 0; k < inst.devices.length; k++) {

          this.devices.push({ id: inst.devices[k].id, name: inst.devices[k].name });
        }
      }
    }
  }

  ngOnInit(): void {

    try {
      this.dataManagementService.tenantData.zones[0].name;
      this.init(this.dataManagementService.tenantData);
    } catch (error) { }

    this.dataManagementService.GroupsLoaded$
      .pipe(takeWhile(() => this.alive))
      .subscribe(tenantData => {
        this.init(tenantData);
      });

  }

  handleInputChange(e) {
    this.iconDelete = !this.iconDelete;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }


  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
  }

  saveImage() {
    if (this.imageSrc != null) {
      this.image.url = this.imageSrc;
      this.image.type = "AD";
      this.dataManagementService.addImage(this.image).subscribe(res => {

        this.dataManagementService.showToast('success', 'Bien energister')
      })
    }
    this.deleteImage();
    this.image = new Image();
    this.images = null;

  }

  editImage() {

  }

  deleteImage() {
    if (this.imageSrc != null) {
      this.iconDelete = false;
      this.imageSrc = null;
    }
  }


  findImageByDeviceIdType(id: number, type: string) {

    this.imageData.id = id;
    this.imageData.type = "AD";
    this.dataManagementService.findImageByDeviceIdType(this.imageData).subscribe(res => {
      this.images = res;
    })
  }

}

