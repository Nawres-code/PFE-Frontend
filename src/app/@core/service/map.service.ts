import { EventEmitter, Injectable } from '@angular/core';
import { Station } from '../data/data';
import Marker = L.Marker;
import * as L from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  public baseMaps: any;
  public map: any;
  public mapLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  myIcon = L.icon({
    iconUrl: 'assets/images/pin.png',
    iconRetinaUrl: 'my-icon@2x.png',
    iconSize: [30, 50]
  });
  selectedIcon = L.icon({
    iconUrl: 'assets/images/pin_orange.png',
    iconRetinaUrl: 'my-icon@3x.png',
    iconSize: [30, 50]
  });

  markers = new Map();
  currentUserId;
  constructor() {
    this.currentUserId = localStorage.getItem('id');
    this.baseMaps = {
      Fleet: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      })/*,
      OpenStreetMap: P.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 20,
        maxNativeZoom: 17,
        attribution:
          '&copy; <a href="#">Fleet</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
      CartoDB: P.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 20,
        maxNativeZoom: 17,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }),
      'Sat Full HD': P.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 20,
          maxNativeZoom: 17,
          attribution: 'Fleet'
        }
      ),
      'Google Streets': P.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      'Google Hybrid': P.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      'Google Sat': P.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      'Google Terrain': P.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      })*/
    };

  }

  addMarker(idStation:string,lat: number,lon: number, popupText: string){
    // ******************************  init the RT marker !!! ******************************
    let marker=this.markers.get(idStation);
    if(!marker){
      marker = new Marker([lat,lon], {icon: this.myIcon});
      marker.on("mouseover", () => {
        marker.openPopup();
      });
      let popup = popupText;
      marker.bindPopup(popup);
    }
    // marker.addTo(this.map);
    // this.map.invalidateSize(true);

    this.markers.set(idStation, marker);
  }

  openStationPopup(station: Station) {  
    this.markers.forEach(m=> {m.setIcon(this.myIcon); m.closePopup();});
    let marker= this.markers.get(station.id);

    if(marker) {
     // 
     try {
      this.map.flyTo([station.y, station.x], 17);
     // this.map.setView(marker.getLatLng, 20);
     } catch (error) {
     }
      marker.setIcon(this.selectedIcon);
      marker.openPopup();
    }
  }

  getPopupContent(s: Station) {
    return ` <div class="leaflet-popup-content m-0" style="font-family: sans-serif;">
                <h5 class="mb-0">
                  <span class="badge pull-right" style="color: #ffffff; background-color: #f97d83;">
                    ${s.name? s.name.toUpperCase(): s.id.toUpperCase()}
                  </span>
                </h5>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span title="altitude" class="font-weight-bold">Altitude: ${s.altitude} m</span>
                  <span class="badge badge-pill badge-secondary pull-right" title="Type">
                    ${s.type}
                  </span>
                </div>
                <hr class="my-2">
                <span title="Description">${s.description}</span>
            </div>`;
  }

}
