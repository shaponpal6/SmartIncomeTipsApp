import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions
} from "react-native";
import { TabView, TabBar } from 'react-native-tab-view';
import CollapsingToolbar from "../../component/sliverAppBar";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../../constant/styles";
// import TabBarScreen from "../../component/tabBarScreen";
import MyStatusBar from "../../component/myStatusBar";
import Timeline from "../../component/Timeline";
import { Snackbar } from "react-native-paper";
import CourseOverViewScreen from "../courseOverView/courseOverViewScreen";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDatabase } from '../../store/SQLiteDatabaseContext';

const { width } = Dimensions.get('screen');

const CourseDetailScreen = () => {
    
    const navigation = useNavigation();

    const [isInWatchList, setIsInWatchList] = useState(false);

    const [showAccessDialog, setshowAccessDialog] = useState(false);

    const { id } = useLocalSearchParams();
    const { getPostById, addToInterest, getAllInterest, deleteFromInterest } = useDatabase();
    const { image, courseName, courseCategory, courseRating, courseNumberOfRating, coursePrice } = useLocalSearchParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);

    const addInterest = async () =>{
        // console.log('object :>> ', id, await deleteFromInterest(id));
        console.log('object :>> ', id, await getAllInterest());
        setIsInWatchList(!isInWatchList)
        await addToInterest({ uid: 1, pid: id, progress: 0, status: 0, sort: 0, note: ""})
        // console.log('getAllInterest :>> ', await getAllInterest());
    }

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
          if (isMounted) {
            setLoading(true);
            try {
              // Initial data fetch when app loads
            //   if(await isDataEmpty()) await updateData();
              const fetchedData = await getPostById(id);
              setPost(fetchedData);
            } catch (error) {
              console.error('Error loading data:', error);
            } finally {
              setLoading(false);
            }
          }
        }
        loadData();
        return () => {
          isMounted = false;
        };
      }, [id]);

    // console.log('posts :>> ', post);
    if(loading) return <Text>Loading...</Text>

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
                        onPress={() => addInterest()}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}
                    >
                        <MaterialIcons
                            name={isInWatchList ? "done" : "add"}
                            size={24}
                            color={Colors.primaryColor}
                        />
                        <Text style={{ ...Fonts.primaryColor16Regular, marginLeft: Sizes.fixPadding - 5.0 }}>
                            {isInWatchList ? "Added to Interest" : "Add to Interest"}
                        </Text>
                    </TouchableOpacity>
                }
                element={
                    courseInfo(post)
                    // <CourseOverViewScreen content={post?.post_content !=="" ? post.post_content : ""} />
                }
                borderBottomRadius={20}
                toolbarColor={Colors.whiteColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={370}
                isImageBlur={true}
                src={post?.post_image?.length > 10 ? {uri: post.post_image} :image}
                >
                <TabBarScreen navigation={navigation} setshowAccessDialog={setshowAccessDialog} post={post} />
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

    function courseInfo(post) {
        return (
            <View>
                <Text style={{ ...Fonts.primaryColor16Regular }}>{courseCategory}</Text>
                <Text style={{ ...Fonts.primaryColor28Bold, marginVertical: Sizes.fixPadding }}>
                    {post?.post_title !=="" ? post.post_title : ""}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ ...Fonts.primaryColor16Regular }}>
                            10
                        </Text>
                        <MaterialIcons name="star" size={17} color={Colors.primaryColor} />
                        <Text style={{ ...Fonts.primaryColor16Regular }}>
                            (244 Reviews)
                        </Text>
                    </View>
                    <Text style={{ ...Fonts.primaryColor25Bold }}>
                        Free
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('takeCourse/takeCourseScreen',
                        {
                            courseName: courseName,
                            image: image
                        }
                    )}
                    style={styles.takeTheCourseContainerStyle}>
                    <Text style={{ ...Fonts.black17Bold }}>Take the Course</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('watchTrailer/watchTrailerScreen')}
                    style={styles.watchTrailerContainerStyle}>
                    <Text style={{ ...Fonts.black17Bold }}>Watch Trailer</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const TabBarScreen = ({ navigation, setshowAccessDialog, post }) => {

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'OverView' },
        { key: 'second', title: 'Roadmap' },
    ]);

    const layout = useWindowDimensions();

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <CourseOverViewScreen content={post?.post_content !=="" ? post.post_content : ""} />;
            case 'second':
                return <Timeline uid="12" pid="13" timelineData={[]}/>;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: Colors.orangeColor, }}
                    tabStyle={{
                        width: layout.width / 2,
                    }}
                    style={{
                        backgroundColor: Colors.whiteColor,
                        borderBottomWidth: 1,
                        borderBottomColor: '#dddddd',
                        elevation: 0
                    }}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={{ ...Fonts.black17Bold }}>
                            {route.title}
                        </Text>
                    )}
                />
            )}
        />
    )
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

export default CourseDetailScreen;