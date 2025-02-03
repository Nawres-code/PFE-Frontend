import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import * as L from 'leaflet';
import { MapService } from '../../../../@core/service/map.service';
import { LayoutService } from '../../../../@core/utils';
@Component({
  selector: 'ngx-metos-dash',
  templateUrl: './metos-dash.component.html',
  styleUrls: ['./metos-dash.component.scss', './maptile.scss']
})
export class MetosDashComponent implements OnInit , OnDestroy, AfterViewInit{

  constructor(private mapService: MapService, private sidebarService:NbSidebarService, private layoutService:LayoutService) { 

    if (document.getElementById("header-sidebar").classList.contains('expanded')) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.layoutService.changeLayoutSize();
    } }
  ngAfterViewInit(): void {
   //  throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.mapService.markers = new Map();
  }

  ngOnInit(): void {
 this.layersControl =  {
  baseLayers: {
    'fleet': L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
  },
  overlays : this.mapService.markers,
}
  }

  options = {
    layers: [
      L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        useCache: true,
	      crossOrigin: true
      }),
    ],
    zoom: 6,
    minZoom: 3,
    maxZoom: 20,
    maxNativeZoom: 17,
    center: L.latLng({ lat: 34, lng: 10 }),
  };

  layersControl ;

  getLayers(){
    try {
      return Array.from (this.mapService.markers.values());
    } catch (error) {
      return [];
    }
  }

  onMapReady(map: L.Map) {
    this.mapService.map = map;
    this.mapService.map.invalidateSize();
   // setInterval(function() {   this.mapService.map.invalidateSize(); }, 100);
  }


}
