import React from "react";
import { Text, View, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import CollapsingToolbar from "../../../component/sliverAppBar";
import { Fonts, Sizes, Colors } from "../../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import Roadmap from "../../../component/Roadmap";
import Timeline from "../../../component/Timeline";
// import Timeline1 from "../../../component/Timeline2";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Loading from '../../../component/Loading';

const timelineData = [
    {
        id: 1,
        parent: 0,
        title: "Meet the Artist",
        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
        progress: "25%", // Use this default
        status: 1,
        input: 0,
        answer: "",
        tasks: [
            { // TODO: All tasks item will be like tab. Title will display default, when tab then show desc below and if input=1 then also display Text Input $ save (one lime).
                id: 13,
                parent: 1,
                title: "Meet the Artist", // Use this default
                desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                progress: "2%",
                status: 1,
                input: 1,
                answer: "",
                tasks: [
                    { // TODO: All tasks item will be like tab. Title will display default, when tab then show desc below and if input=1 then also display Text Input $ save (one lime).
                        id: 134,
                        parent: 13,
                        title: "Meet the Artist",
                        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                        progress: "2%",
                        status: 1,
                        input: 1,
                        answer: "",
                        tasks: []
                    },
                    {
                        id: 1324,
                        parent: 13,
                        title: "Meet the Artist",
                        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                        progress: "5%",
                        status: 1,
                        input: 1,
                        answer: "",
                        tasks: []
                    },
                    // TODO: every Last Of tasks - Add new button "+ Add new Task"
                ]
            },
            {
                id: 134,
                parent: 1,
                title: "Meet the Artist",
                desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                progress: "5%",
                status: 1,
                input: 1,
                answer: "",
                tasks: []
            },
            // TODO: every Last Of tasks - Add new button "+ Add new Task"
        ]
    },
    {
        id: 2,
        parent: 0,
        title: "Meet the Artist",
        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
        progress: "25%",
        status: 1,
        input: 0,
        answer: "",
    },
    {
        id: 3,
        parent: 0,
        title: "Meet the Artist",
        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
        progress: "25%",
        status: 1,
        input: 0,
        answer: "",
        tasks: [
            { // TODO: All tasks item will be like tab. Title will display default, when tab then show desc below and if input=1 then also display Text Input $ save (one lime).
                id: 1343,
                parent: 3,
                title: "Meet the Artist",
                desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                progress: "2%",
                status: 1,
                input: 1,
                answer: "",
                tasks: []
            },
            {
                id: 1534,
                parent: 3,
                title: "Meet the Artist",
                desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
                progress: "5%",
                status: 1,
                input: 1,
                answer: "",
                tasks: []
            },
            // TODO: every Last Of tasks - Add new button "+ Add new Task"
        ]
    },
    {
        id: 4,
        parent: 0,
        title: "Meet the Artist",
        desc: "Meet the artist, a live AMA with SHAG will be scheduled and held on discord.",
        progress: "25%",
        status: 1,
        input: 0,
        answer: "",
    },
];

const { width } = Dimensions.get('screen');

const SettingScreen = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CollapsingToolbar
            leftItem={
                <Logo text={"Smart Income Tips"}/>
            }
            rightItem={<TopMenu/>}
                element={
                    <Text style={{ ...Fonts.black25Bold }}>Settings</Text>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={230}
                childrenMinHeight={730}
                src={require('../../../assets/images/appbar_bg.png')}>
                <View style={{
                    paddingBottom: Sizes.fixPadding * 7.0,
                    // marginHorizontal: Sizes.fixPadding * 2.0,
                    marginTop: Sizes.fixPadding * 4.0
                }}>
                    <Timeline uid="12" pid="13" timelineData={timelineData}/>
                    {/* <Timeline1 uid="12" pid="13" timelineData={timelineData}/> */}
                    {/* <Roadmap/> */}
                    {/* <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('accountSetting/accountSettingsScreen')}
                    >
                        {settingInfo({ info: 'Account Settings' })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('appSetting/appSettingScreen')}
                    >
                        {settingInfo({ info: 'App Settings' })}
                    </TouchableOpacity> */}
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

export default SettingScreen;