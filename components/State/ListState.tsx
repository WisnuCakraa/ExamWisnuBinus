import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import axios from 'axios';

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
    const itemsPerPage: number = 10;
    const [refreshing, setRefreshing] = useState<boolean>(false);

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

        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
            loadMoreData();
        }
    };

    const onRefresh = (): void => {
        setRefreshing(true);
        setData([]);
        setPage(1);
        fetchData().then(() => setRefreshing(false));
    };

    const formatPopulation = (population: number): string => {
        return population.toLocaleString();
    };

    const renderItem = ({ item }: { item: StateData }) => {
        return (
            <View style={styles.card}>
                <Image
                    source={{ uri: `https://restcountries.com/data/${item["Slug State"].toLowerCase()}.svg` }}
                    style={styles.image}
                />
                <View style={styles.cardContent}>
                    <Text style={styles.state}>{item.State}</Text>
                    <Text style={styles.year}>Year: {item.Year}</Text>
                    <Text style={styles.population}>Population: {formatPopulation(item.Population)}</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>More info</Text>
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
                keyExtractor={item => item["ID State"]}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.1}
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
        padding: 10,
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: 15,
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
        backgroundColor: '#007BFF',
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
