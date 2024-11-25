import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Fonts, Colors } from "../constant/styles";
import MyStatusBar from "../component/myStatusBar";
import { useNavigation } from "expo-router";
import { registerBackgroundFetch } from '../store/backgroundFetchSetup';
import { useDatabase } from '../store/SQLiteDatabaseContext';
import { updateData } from '../store/fetchLiveDataService';

const SplashScreen = () => {
    const { insertDataWithTransaction, homePageData, isDataEmpty, migrateDB } = useDatabase();
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        registerBackgroundFetch();
    }, []);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (isMounted) {
                setLoading(true);
                try {
                    // Initial data fetch when app loads
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    // if (!await isDataEmpty()) {
                        const isEmpty = await isDataEmpty();
                        // const isEmpty = true;
                        console.log('isEmpty :>> ', isEmpty);
                        if (isEmpty) {
                            await migrateDB();
                            const data = await updateData();
                            if(data) await insertDataWithTransaction(data);
                        }
                    // }
                    // Navigate only after the data is loaded and `loading` is set to `false`
                    setLoading(false);
                } catch (error) {
                    console.error('Error loading data:', error);
                    setLoading(false);
                }
            }
        }
        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            navigation.push('(tabs)');
        }
    }, [loading, navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: '#001c30' }}>
            <MyStatusBar />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...Fonts.white60Regular }}>
                    Welcome
                </Text>
                <Text style={{ color: '#FFF' }}>{loading ? 'Preparing App ...' : ''}</Text>
            </View>
        </View>
    );
};

export default SplashScreen;
