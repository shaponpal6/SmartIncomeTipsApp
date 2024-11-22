import React from "react";
import { ImageBackground, Text, View, FlatList, ScrollView, StyleSheet } from "react-native";
import { Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import HtmlContentRenderer from '../../component/HtmlContentRenderer';

const learnFromCourseList = [
    {
        id: '1',
        image: require("../../assets/images/new_course/new_course_1.png"),
        typeOfLearn: 'Full Language',
    },
    {
        id: '2',
        image: require("../../assets/images/new_course/new_course_2.png"),
        typeOfLearn: 'Practicals',
    },
    {
        id: '3',
        image: require("../../assets/images/new_course/new_course_1.png"),
        typeOfLearn: 'Full Language',
    },
    {
        id: '4',
        image: require("../../assets/images/new_course/new_course_1.png"),
        typeOfLearn: 'Full Language',
    },
]

const CourseOverViewScreen = ({content}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                {/* {dummyText(content)} */}
                <HtmlContentRenderer htmlContent={content} />
                {divider()}
                {title({ title: 'What you will get' })}
                {getFromCourseInfo({
                    iconName: "menu",
                    availability: '15 Videos Lessons'
                })}
                {getFromCourseInfo({
                    iconName: 'star-border',
                    availability: 'Exclusive Learning Materials'
                })}
                {getFromCourseInfo({
                    iconName: "check",
                    availability: '100% Guaranteed'
                })}
                {divider()}
                {title({ title: 'What you will learn' })}
                {learnFromCourse()}
            </ScrollView>
        </View>
    );

    function learnFromCourse() {
        const renderItem = ({ item }) => (
            <ImageBackground
                source={item.image}
                style={{ height: 190.0, width: 190.0, marginRight: Sizes.fixPadding }}
                borderRadius={Sizes.fixPadding * 2.0}
                resizeMode="cover"
            >
                <View style={styles.learnFromImageBlurContainerStyle}>
                    <Text style={{ ...Fonts.primaryColor23Bold }}>
                        {item.typeOfLearn}
                    </Text>
                </View>
            </ImageBackground>
        )

        return (
            <FlatList
                data={learnFromCourseList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                horizontal
                contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0, }}
            />
        )
    }

    function getFromCourseInfo({ iconName, availability }) {
        return (
            <View style={styles.getFromCourseInfoContainerStyle}>
                <MaterialIcons name={iconName} size={24} color="black" />
                <Text style={{ ...Fonts.black17Bold, marginLeft: Sizes.fixPadding * 2.0 }}>
                    {availability}
                </Text>
            </View>
        )
    }

    function title({ title }) {
        return (
            <Text style={{ ...Fonts.indigoColor18Bold }}>{title}</Text>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: '#E1E1E1',
                height: 2.0,
                marginVertical: Sizes.fixPadding + 5.0
            }}>
            </View>
        )
    }

    function dummyText(content) {
        return (
            <View>
                <Text>{content}</Text>
                <Text style={{ ...Fonts.indigoColor18Bold, marginTop: Sizes.fixPadding * 4.0 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </Text>
                <Text style={{ ...Fonts.gray16Regular, marginTop: Sizes.fixPadding + 5.0 }}>
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    learnFromImageBlurContainerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        height: 190.0, width: 190.0,
        borderRadius: Sizes.fixPadding * 2.0,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding
    },
    getFromCourseInfoContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding + 5.0
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: Sizes.fixPadding,
    }
})

export default CourseOverViewScreen;