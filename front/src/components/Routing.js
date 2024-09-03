import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

export default function Routing({ startPoint, endPoint }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !startPoint || !endPoint) return;

        // Supprimer l'instance précédente du contrôle de routage s'il existe
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        // Créer une nouvelle instance du contrôle de routage
        const routingControl = L.Routing.control({
            waypoints: [L.latLng(startPoint.lat, startPoint.lng), L.latLng(endPoint.lat, endPoint.lng)]
        }).addTo(map);

        // Mettre à jour la référence vers la nouvelle instance du contrôle de routage
        routingControlRef.current = routingControl;

        // Retourner une fonction de nettoyage pour supprimer le contrôle de routage
        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [map, startPoint, endPoint]);

    return null;
}

