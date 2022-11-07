import { API_KEY } from '$env/static/private'
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({fetch, params}) => {
    const mapUrl = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
    console.log(API_KEY);
    console.log(mapUrl);

    function initMap(): void {
    let map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        });
    }
    
    return {
        mapUrl: mapUrl,
        map: initMap(),
    }
}