import $ from 'jquery';

import './utils'
import { MainAlert } from './realtime_dom'
import { WebSocketClient } from './websocket'
import '../scss/realtime.scss'
import '../scss/index.scss'

// (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
//   key: "AIzaSyBnu90JFkKv6iaafwM9T5fyqePlUfvZS8Y",//"AIzaSyBnu90JFkKv6iaafwM9T5fyqePlUfvZS8Y",
//   v: "weekly",
//   // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
//   // Add other bootstrap parameters as needed, using camel case.
// });

// let map;
// async function initMap() {
//   const position = {lat:  31.0461, lng: 34.8516};
//   const { Map } = await google.maps.importLibrary("maps");

//   map = new Map($("#googleMap"), {
//     zoom: 4,
//     center: position,
//     mapId: "d2018be95485546f"
//   })
// }

// initMap()