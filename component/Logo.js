import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Fonts } from "../constant/styles";
import { useNavigation } from "expo-router";

const Logo = ({text="Smart Income Tips"}) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginLeft: 40
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('accountSetting/accountSettingsScreen')}
            >
                <Text style={{ ...Fonts.black25Bold, width: '100%' }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Logo

const styles = StyleSheet.create({})