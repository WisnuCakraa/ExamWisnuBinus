import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { getFlagPng } from './importFlagPng';
import { router } from 'expo-router'

interface StateData {
    "ID State": string;
    "State": string;
    "ID Year": number;
    "Year": string;
    "Population": number;
    "Slug State": string;
}

const ListState: React.FC = () => {
    const [data, setData] = useState<StateData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const itemsPerPage: number = 10;

    const handleMoreInfo = async (state: string) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${state}&key=YOUR_API_KEY`);
            const { results } = response.data;
            
            if (results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                const params: any = {
                    latitude: lat,
                    longitude: lng,
                    address: results[0].formatted_address
                };
                router.push({ pathname: `/maps`, params: params })

            } else {
                Alert.alert('Error', 'Location not found');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'Failed to fetch location. Using default coordinates for Washington D.C.');
        }
    };
    


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        try {
            const response = await axios.get('https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const loadMoreData = (): void => {
        if (loading) return;

        setLoading(true);

        setTimeout(() => {
            const newData: StateData[] = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
            setData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
            setRefreshing(false);
        }, 500);
    };

    const handleScroll = ({ nativeEvent }: any): void => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const currentPositionY = contentOffset.y;

        if (currentPositionY <= 0 && currentPositionY < scrollPosition) {
            setRefreshing(true);
            onRefresh();
        }

        setScrollPosition(currentPositionY);
    };

    const onRefresh = (): void => {
        setData([]);
        setPage(1);
        fetchData().then(() => setRefreshing(false));
    };

    const formatPopulation = (population: number): string => {
        return population.toLocaleString();
    };

    const renderItem = ({ item }: { item: StateData }) => {
        const flagUrl = getFlagPng(item["Slug State"]);

        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.imageWrapper}>
                        {flagUrl && (
                            <Image
                                source={flagUrl}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                    <Text style={styles.state}>{item.State}</Text>
                    <Text style={styles.year}>Year: {item.Year}</Text>
                    <Text style={styles.population}>Population: {formatPopulation(item.Population)}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => handleMoreInfo(item.State)}>
                        <Text style={styles.buttonText}>Go To Maps</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => item["ID State"] + index}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.1}
                onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#DDDDDD',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 15,
    },
    imageWrapper: {
        padding: 10
    },
    image: {
        flex: 1,
        width: 'auto',
        height: 200,
    },
    state: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    year: {
        color: '#555',
        marginVertical: 5,
    },
    population: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#76885B',
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default ListState;
