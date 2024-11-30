import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from "expo-router";

const TopMenu = () => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'right',
                alignItems: 'center',
                // width: '100%',
                // alignItems: 'right',
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('notification/notificationScreen')}
            // style={{width: 50, height: 50}}
            >
                <MaterialIcons
                    name="notifications"
                    size={25}
                    color="black"
                // onPress={() => navigation.push('user/profileScreen')}
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('user/profileScreen')}
            style={{marginLeft: 15, marginBottom: 3}}
            >
                <FontAwesome5
                    name="user-graduate"
                    size={20}
                    color="black"
                // onPress={() => navigation.push('user/profileScreen')}
                />
            </TouchableOpacity>
        </View>
    )
}

export default TopMenu

const styles = StyleSheet.create({})