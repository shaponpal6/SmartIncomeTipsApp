import React, { useState } from "react";
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import CollapsingToolbar from "../../component/sliverAppBar";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../../constant/styles";
import TabBarScreen from "../../component/tabBarScreen";
import MyStatusBar from "../../component/myStatusBar";
import { Snackbar } from "react-native-paper";
import CourseOverViewScreen from "../courseOverView/courseOverViewScreen";
import { useLocalSearchParams, useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const PostDetailScreen = () => {

    const navigation = useNavigation();

    const [isInWatchList, setIsInWatchList] = useState(false);

    const [showAccessDialog, setshowAccessDialog] = useState(false);

    const { image, courseName, courseCategory, courseRating, courseNumberOfRating, coursePrice } = useLocalSearchParams();
    const image2= require('../../assets/images/new_course/new_course_3.png');

    return (
        <View style={{ flex: 1, }}>
            <MyStatusBar />
            <CollapsingToolbar
                leftItem={
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={24}
                        color={Colors.primaryColor}
                        onPress={() => navigation.pop()}
                    />
                }
                rightItem={
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setIsInWatchList(!isInWatchList)}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}
                    >
                        <MaterialIcons
                            name={isInWatchList ? "done" : "add"}
                            size={24}
                            color={Colors.primaryColor}
                        />
                        <Text style={{ ...Fonts.primaryColor16Regular, marginLeft: Sizes.fixPadding - 5.0 }}>
                            {isInWatchList ? "Added to Wishlist" : "Add to Wishlist"}
                        </Text>
                    </TouchableOpacity>
                }
                element={
                    courseInfo()
                }
                borderBottomRadius={20}
                toolbarColor={Colors.whiteColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={370}
                isImageBlur={true}
                src={image2}>
                <CourseOverViewScreen/>
                {/* <TabBarScreen navigation={navigation} setshowAccessDialog={setshowAccessDialog} /> */}
            </CollapsingToolbar>

            <Snackbar
                style={styles.snackbarStyle}
                elevation={0}
                visible={showAccessDialog}
                onDismiss={() => setshowAccessDialog(false)}
            >
                First purchase this course then you access this lesson.
            </Snackbar>
        </View>
    )

    function courseInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.primaryColor16Regular }}>{courseCategory}</Text>
                <Text style={{ ...Fonts.primaryColor28Bold, marginVertical: Sizes.fixPadding }}>
                    {courseName}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    takeTheCourseContainerStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center', justifyContent: 'center', width: width - 40,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding + 3.0,
        marginBottom: Sizes.fixPadding
    },
    watchTrailerContainerStyle: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        borderRadius: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding - 5.0,
    },
    snackbarStyle: {
        position: 'absolute',
        left: -10.0,
        right: -10.0,
        bottom: -10.0,
        backgroundColor: '#333333',
    }
})

export default PostDetailScreen;