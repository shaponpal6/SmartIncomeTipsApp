import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Fonts, Colors } from "../constant/styles";
import MyStatusBar from "./myStatusBar";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Loading = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#001c30' }}>
            <MyStatusBar />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...Fonts.white60Regular }}>
                    Welcome
                </Text>
                <Text style={{ color: '#FFF' }}>Preparing App ...</Text>
                <ActivityIndicator animating={true} color={MD2Colors.white60Regular} size="large"/>
            </View>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})