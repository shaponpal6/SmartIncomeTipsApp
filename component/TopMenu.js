import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";

const TopMenu = () => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'right',
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('user/profileScreen')}
            // style={{width: 50, height: 50}}
            >
                <MaterialIcons
                    name="notifications"
                    size={25}
                    color="black"
                // onPress={() => navigation.push('user/profileScreen')}
                />
            </TouchableOpacity>
            {/* <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => navigation.push('accountSetting/accountSettingsScreen')}
                            >
                            <Image
                                style={{ height: 30.0, width: 30.0, borderRadius: 15.0, }}
                                source={require('../../../assets/images/user_profile/user_3.jpg')}
                                resizeMode="contain"
                            />
                        </TouchableOpacity> */}
        </View>
    )
}

export default TopMenu

const styles = StyleSheet.create({})