import React, { useState, useEffect }  from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Fonts, Sizes, Colors, CommonStyles } from "../../../constant/styles";
import CollapsingToolbar from "../../../component/sliverAppBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Search from "../../../component/Search";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Image from '../../../component/LazyImage';

import { useDatabase } from '../../../store/SQLiteDatabaseContext';

const { width } = Dimensions.get('window');
const image = require("../../../assets/images/new_course/new_course_2.png");

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
    const [listData, setListData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();
    // const { id, category } = useLocalSearchParams();
    
    async function loadData(search="") {
        setLoading(true);
        // console.log('id :>> ', id);
        try{
            const data = await searchPosts({ search: search, page: 1, limit: 10, postType: 'post'});
            setData(data);
            setListData(data);
            setLoading(false);
        }catch(err){
            setLoading(false);
            console.error('err :>> ', err);
        }
    }
    useEffect(() => {
        loadData('');
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <CollapsingToolbar
            leftItem={
                <Logo text={"Smart Income Tips"}/>
            }
            rightItem={<TopMenu/>}
                element={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ ...Fonts.white60Regular, marginBottom: 30 }}>Courses</Text>
                    {/* <Search/> */}
                    <Search
                        placeholder="Type to search..."
                        onChange={(text) => loadData(text)}
                        onSubmit={(event) => loadData(event.nativeEvent.text)}
                    />
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={240}
                src={require('../../../assets/images/appbar_bg.png')}
            >
                <View style={{ paddingTop: Sizes.fixPadding }}>
                    {data.map(item => (
                        renderItem({ item })
                    ))}
                </View>
            </CollapsingToolbar>
        </View>
    )

    function renderItem({ item }) {
        return (
            <TouchableOpacity
                onPress={() => navigation.push('postDetail/postDetailScreen', {
                    image: image,
                    id: item.ID,
                    courseName: item.post_title,
                    content: item.post_content,
                    courseCategory: JSON.parse(item.categories).length > 0 ? JSON.parse(item.categories)[0] : "",
                    courseRating: '5.0',
                    courseNumberOfRating: '667',
                    coursePrice: '567',
                })}
                activeOpacity={0.9}
                key={item.ID} 
            >
            <View key={item.ID} style={styles.courseContainerStyle}>
                <Image
                    source={item?.post_image !==""? item.post_image : image}
                    style={styles.courseImageStyle}
                    resizeMode="cover"
                />
                <View style={styles.courseInfoContainerStyle}>
                    <Text style={{ ...Fonts.black17Bold }}>
                        {item.post_title}
                    </Text>
                    <Text numberOfLines={3} style={{ textAlign: 'left' }}>
                        {item.post_content.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '')}
                    </Text>
                    {/* <Text style={{ ...Fonts.indigoColor16Bold }}>
                        {item.getVideos}/{item.totalVideos} Videos
                    </Text> */}
                </View>
            </View>
            </TouchableOpacity>
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