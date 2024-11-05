import React from "react";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { Fonts, Sizes, Colors, CommonStyles } from "../../../constant/styles";
import CollapsingToolbar from "../../../component/sliverAppBar";

const { width } = Dimensions.get('screen');

const myCoursesList = [
    {
        id: '1',
        image: require('../../../assets/images/new_course/new_course_1.png'),
        course: 'Alice Water',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        getVideos: 20,
        totalVideos: 20,
    },
    {
        id: '2',
        image: require('../../../assets/images/new_course/new_course_2.png'),
        course: 'Gordon Ramsey',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        getVideos: 3,
        totalVideos: 12,
    },
    {
        id: '3',
        image: require('../../../assets/images/new_course/new_course_3.png'),
        course: 'Lisa Ling',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        getVideos: 0,
        totalVideos: 15,
    },
    {
        id: '4',
        image: require('../../../assets/images/new_course/new_course_4.png'),
        course: 'Wolfgang Puck',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        getVideos: 15,
        totalVideos: 30,
    }
];

const CoursesScreen = () => {

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <CollapsingToolbar
                element={
                    <Text style={{ ...Fonts.black25Bold }}>My Course</Text>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={230}
                src={require('../../../assets/images/appbar_bg.png')}
            >
                <View style={{ paddingTop: Sizes.fixPadding }}>
                    {myCoursesList.map(item => (
                        renderItem({ item })
                    ))}
                </View>
            </CollapsingToolbar>
        </View>
    )

    function renderItem({ item }) {
        return (
            <View key={item.id} style={styles.courseContainerStyle}>
                <Image
                    source={item.image}
                    style={styles.courseImageStyle}
                    resizeMode="cover"
                />
                <View style={styles.courseInfoContainerStyle}>
                    <Text style={{ ...Fonts.black17Bold }}>
                        {item.course}
                    </Text>
                    <Text style={{ ...Fonts.gray16Regular, marginVertical: Sizes.fixPadding - 3.0 }}>
                        {item.description}
                    </Text>
                    <Text style={{ ...Fonts.indigoColor16Bold }}>
                        {item.getVideos}/{item.totalVideos} Videos
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    courseContainerStyle: {
        flexDirection: 'row',
        width: width - 20,
        elevation: 2.0,
        ...CommonStyles.shadow,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding * 2.0,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding,
        alignItems: 'center'
    },
    courseImageStyle: {
        height: 115.0,
        width: 115.0,
        borderRadius: Sizes.fixPadding * 2.0,
        marginLeft: Sizes.fixPadding
    },
    courseInfoContainerStyle: {
        marginLeft: Sizes.fixPadding,
        width: width - 160,
        marginVertical: 3.0,
    },
});

export default CoursesScreen;