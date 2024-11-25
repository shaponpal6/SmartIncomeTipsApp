import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Dimensions, FlatList, TouchableOpacity} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDatabase } from '../../store/SQLiteDatabaseContext';
import Image from '../../component/LazyImage';

const { width } = Dimensions.get('window');
const image = require("../../assets/images/new_course/new_course_2.png");

const categoryList = [
    {
        id: 1,
        image: require("../../assets/images/new_course/new_course_1.png"),
        name: "Design Instruments for Communication",
        rating: "4.0",
        price: "59"
    },
    {
        id: 2,
        image: require("../../assets/images/new_course/new_course_2.png"),
        name: "Weight Training Courses with Any Di",
        rating: "4.5",
        price: "64"
    },
    {
        id: 4,
        image: require("../../assets/images/new_course/new_course_4.png"),
        name: "How to be a DJ? Make Electronic Music",
        ourseRating: "4.8",
        price: "59"
    },
    {
        id: 3,
        image: require("../../assets/images/new_course/new_course_3.png"),
        name: "Console Development Basics with Unity",
        rating: "4.0",
        price: "64"
    },
    {
        id: 5,
        image: require("../../assets/images/new_course/new_course_1.png"),
        name: "Design Instruments for Communication",
        rating: "4.0",
        price: "59"
    },
    {
        id: 6,
        image: require("../../assets/images/new_course/new_course_2.png"),
        name: "Weight Training Courses with Any Di",
        rating: "4.5",
        price: "64"
    },
    {
        id: 7,
        image: require("../../assets/images/new_course/new_course_4.png"),
        name: "How to be a DJ? Make Electronic Music",
        ourseRating: "4.8",
        price: "59"
    },
    {
        id: 8,
        image: require("../../assets/images/new_course/new_course_3.png"),
        name: "Console Development Basics with Unity",
        rating: "4.0",
        price: "64"
    }
];

const CategoriesScreen = () => {
    const navigation = useNavigation();
    const { id, category } = useLocalSearchParams();
    const { insertDataWithTransaction,getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
          if (isMounted) {
            setLoading(true);
            try {
              // Initial data fetch when app loads
            //   if(await isDataEmpty()) await updateData();
                const data = await searchPosts({categories: [id], page: 1, limit: 10, postType: 'post'});
                setData(data);
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

    if(loading) return <Text>Loading...</Text>

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {data.length > 0 ? 
                categories(data) : <Text style={{ flex: 1 }}>{loading ? 'Loading...' : 'No items'}</Text>}
            </View>
        </View>
    )

    function categories(data) {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                onPress={() => navigation.push('postDetail/postDetailScreen', {
                    id: item.ID
                })}
                activeOpacity={0.9}
            >
                <View style={styles.categoriesContainerStyle}>
                    <Image
                        source={item?.post_image?.length > 10 ? item.post_image : image}
                        style={styles.categoryImageStyle}
                        resizeMode="cover"
                    />
                    <View style={styles.categoryInfoContainerStyle}>
                        <Text style={{ ...Fonts.black17Bold }}>
                            {item.post_title}
                        </Text>
                        {/* <Text style={{ ...Fonts.black17Bold, marginVertical: Sizes.fixPadding }}>
                            {item.exce}
                        </Text> */}
                        <Text numberOfLines={3} style={{ marginTop: -10, textAlign: 'left' }}>
                            {item.post_content.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '')}
                        </Text>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...Fonts.gray15Bold, marginRight: Sizes.fixPadding - 5.0 }}>
                                {'5.0'}
                            </Text>
                            <MaterialIcons name="star" size={17} color="black" />
                        </View> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={data}
                keyExtractor={(item) => `${item.ID}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: Sizes.fixPadding }}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerContainerStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color="black"
                    onPress={() => navigation.pop()}
                />
                <Text style={{ ...Fonts.black19Bold, marginLeft: Sizes.fixPadding }}>
                    {category}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        elevation: 10.0,
    },
    categoriesContainerStyle: {
        flexDirection: 'row',
        width: width - 30,
        elevation: 2.0,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding * 2.0,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding,
        ...CommonStyles.shadow
    },
    categoryImageStyle: {
        height: 110.0,
        width: 110.0,
        borderRadius: Sizes.fixPadding * 2.0,
        marginLeft: Sizes.fixPadding
    },
    categoryInfoContainerStyle: {
        marginLeft: Sizes.fixPadding,
        width: width - 180,
        marginVertical: 3.0
    }
})

export default CategoriesScreen;