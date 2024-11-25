import React, { useState, useEffect }  from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Fonts, Sizes, Colors, CommonStyles } from "../constant/styles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Image from './LazyImage';

const { width } = Dimensions.get('window');
const image = require("../assets/images/new_course/new_course_2.png");

const PostList = ({posts=[]}) => {
    const [data, setData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        setData(posts);
    }, [posts]);

    return (
        <View style={{ paddingTop: Sizes.fixPadding }}>
            {data.map(item => (
                renderItem({ item })
            ))}
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
                        source={item?.post_image !== "" ? item.post_image : image}
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

export default PostList
