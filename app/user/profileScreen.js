import React from "react";
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import CollapsingToolbar from "../../component/sliverAppBar";
import { Fonts, Sizes, Colors } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const ProfileScreen = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CollapsingToolbar
            leftItem={
                <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color={Colors.primaryColor}
                    onPress={() => navigation.pop()}
                />
            }
            
                element={
                    <Text style={{ ...Fonts.black25Bold }}>Settings</Text>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={230}
                childrenMinHeight={730}
                src={require('../../assets/images/appbar_bg.png')}>
                <View style={{
                    paddingBottom: Sizes.fixPadding * 7.0,
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginTop: Sizes.fixPadding * 4.0
                }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('accountSetting/accountSettingsScreen')}
                    >
                        {settingInfo({ info: 'Account Settings' })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('appSetting/appprofileScreen')}
                    >
                        {settingInfo({ info: 'App Settings' })}
                    </TouchableOpacity>
                </View>
            </CollapsingToolbar>
        </SafeAreaView>
    )

    function settingInfo({ info }) {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 5.0 }}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                }}>
                    <View style={{ width: width - 80, }}>
                        <Text style={{ ...Fonts.black19Bold, }}>{info}</Text>
                    </View>

                    <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
                </View>
                <View style={{ height: 0.3, backgroundColor: 'gray', marginTop: Sizes.fixPadding }}>
                </View>
            </View>
        )
    }
}

export default ProfileScreen;