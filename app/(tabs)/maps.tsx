import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface SearchParams {
    latitude?: number | string;
    longitude?: number | string;
    address?: string;
}

const Maps = () => {
    const item: Partial<SearchParams> = useLocalSearchParams();
    const initialLatitude = item.latitude ? parseFloat(item.latitude.toString()) : 38.9072;
    const initialLongitude = item.longitude ? parseFloat(item.longitude.toString()) : -77.0369;

    const [region, setRegion] = useState({
        latitude: initialLatitude,
        longitude: initialLongitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    });

    useEffect(() => {
        if (item.latitude && item.longitude) {
            const latitude = parseFloat(item.latitude.toString());
            const longitude = parseFloat(item.longitude.toString());

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
            });
        }
    }, [item]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {region.latitude && region.longitude && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={region}
                        region={region}
                        onRegionChangeComplete={setRegion}
                        customMapStyle={mapStyle}>
                        <Marker
                            draggable
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            onDragEnd={(e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate;
                                setRegion((prevRegion) => ({
                                    ...prevRegion,
                                    latitude,
                                    longitude,
                                }));
                            }}
                            title={item?.address || ""}
                        />
                    </MapView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Maps;

const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
    },
];

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
