import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ImageBackground as ImageBackgroundRoot,
    TouchableOpacity,
    FlatList,
    // Image,
    ScrollView
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel-v4';
import CollapsingToolbar from "../../../component/sliverAppBar";
import Roadmap from "../../../component/Roadmap";
import TagsComponent from "../../../component/TagsComponent";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Button from "../../../component/Button";
import FindMyIncomeTips from "../../../component/FindMyIncomeTips";
import HtmlContentRenderer from '../../../component/HtmlContentRenderer';
import Image from '../../../component/LazyImage';
import Loading from '../../../component/Loading';
import ImageBackground from '../../../component/LazyImageBackground';
// import Roadmap from '../../../component/Roadmap';
// import {fetchAndStoreData} from "../../../store/dataStoreService";
import DatabaseTest from "../../../store/DatabaseTest";
// import { fetchAndStoreData } from '../../../store/services/dataService'
// import {initializeDatabase} from "../../../store/database";
import { useNavigation } from "expo-router";
import { useDatabase } from '../../../store/SQLiteDatabaseContext';

const width = Dimensions.get('window').width;

const itemWidth = Math.round(width * 0.7);

const carouselItems = [
    {
        image: require('../../../assets/images/new_course/new_course_4.png'),
    },
    {
        image: require('../../../assets/images/new_course/new_course_2.png'),
    },
    {
        image: require('../../../assets/images/new_course/new_course_3.png'),
    },
];

const HomeScreen = () => {

    const { homePageData, isDataEmpty } = useDatabase();

    
    const [data, setData] = useState({posts:[], tags:[], configs: [{key: 'site_title', value: 'Smart Income Tips'}], categories:[], courses: [], featurePosts: [], topPosts: [], newPosts: [], otherPosts: []});
    const [columns, setColumns] = useState(2);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const flatListRef = useRef();

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
          if (isMounted) {
            setLoading(true);
            try {
              // Initial data fetch when app loads
            //   if(await isDataEmpty()) await updateData();
              const fetchedData = await homePageData();
              setData(fetchedData);
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
      }, []);
      

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if(flatListRef && flatListRef?.current) flatListRef.current.startAutoplay((instantly = false));
        });
        return unsubscribe;
        

    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if(flatListRef && flatListRef?.current) flatListRef.current.stopAutoplay();
        });
        return unsubscribe;
    }, [navigation]);
    const site_title = data.configs.find(config => config.key === 'site_title') || {value: "Smart Income Tips"};
    const categoryImage = require('../../../assets/images/bg.jpg');
    if(loading) {
        return <Loading/>
    }
    return (
        <View style={{ flex: 1, }}>
            <ImageBackgroundRoot source={categoryImage} style={{flex: 1}} imageStyle={{}}>
            <CollapsingToolbar
                leftItem={
                    <Logo text={site_title?.value || "Smart Income Tips"}/>
                }
                rightItem={<TopMenu/>}
                element={
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: '100%',
                            alignItems: 'center'
                        }}
                    >
                        {/* <FindMyIncomeTips/> */}
                        
                        {/* <Button
                            title="Fetch and Store Data"
                            onPress={handleFetchData}
                        /> */}
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={20}
                toolbarMaxHeight={60}
                // src={require('../../../assets/images/appbar_bg.png')}
            >
                <View style={{backgroundColor: Colors.bgColor}}>
                {/* <DatabaseTest/> */}
                    
                    {autoScroller()}
                    
                    {/* <Roadmap/> */}
                    {/* <TagsComponent tags={data.categories} maxItemsToDisplay={20} /> */}
                    {/* {title({ title: 'Top Income Sectors' })}
                    {categoriesList()} */}
                    {title({ title: 'Top Income Sectors' })}
                    {categories()}
                    {title({ title: 'Popular Tips' })}
                    {popularPosts()}
                    {title({ title: 'Popular Courses' })}
                    {popularCourses()}
                    {title({ title: 'New Courses' })}
                    {newCourses()}
                    {/* {title({ title: 'Instructor' })}
                    {instructors()} */}
                </View>
            </CollapsingToolbar>
            </ImageBackgroundRoot>
        </View>
    )

    function categories() {
        const categoryImage = require('../../../assets/images/category/category_1.jpg');
        const categories = data.categories;
        if(loading) return <Text>Loading...</Text>
        if(!loading && categories.length <= 0) return <Text>No Category</Text>
        // console.log('categories :>> ', categories[2]);
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('category/categoriesScreen', {id: item.term_id, category: item.name })}
                style={styles.categoryContainerStyle}
            >
                <ImageBackground
                    source={item?.image?.length >10 ? {uri: item.image} : categoryImage}
                    // source={{uri: 'https://legacy.reactjs.org/logo-og.png'}}
                    style={{ width: 140.0, height: 140.0, borderRadius: 70.0 }}
                    resizeMode="cover"
                >
                    <View style={styles.categoryBlurContainerStyle}>
                        <Text
                            numberOfLines={2}
                            style={{
                                textAlign: "center",
                                ...Fonts.white16Bold,
                                letterSpacing: 1
                            }}
                        >
                            {/* {item?.image?.length} */}
                            {item.name}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={categories}
                keyExtractor={(item) => `${item.term_id}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    paddingVertical: Sizes.fixPadding * 1.4,
                }}
            />
        )
    }

    function categoriesList() {
        const categoryImage = require('../../../assets/images/category/category_1.jpg');
        const categories = data.categories;
        if(loading) return <Text>Loading...</Text>
        if(!loading && categories.length <= 0) return <Text>No Category</Text>

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('category/categoriesScreen', { id: item.term_id, category: item.name })}
                style={styles.categoryListContainerStyle}
            >
                <ImageBackground
                    source={item?.image ?? categoryImage}
                    style={styles.categoryImageBackgroundStyle}
                    imageStyle={{ borderRadius: 0 }} // Circular image
                    resizeMode="cover"
                >
                    <View style={styles.categoryListBlurContainerStyle}>
                        <Text
                            numberOfLines={2}
                            style={styles.categoryTextStyle}
                        >
                            {item.name}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
        return (
            <FlatList
                data={categories}
                keyExtractor={(item) => `${item.term_id}`}
                renderItem={renderItem}
                numColumns={2}  // Creates a grid layout with 2 columns
                contentContainerStyle={styles.categoryListContentStyle}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true} // Only FlatList handles scrolling
            />
        );
    }

    function autoScroller() {
        const image = require('../../../assets/images/category/category_1.jpg');
        const posts = data.featurePosts;
        // console.log('posts :>> ', posts[0]);
        if(loading) return <Text>Loading...</Text>
        if(!loading && posts.length <= 0) return <Text>No items</Text>
        const renderItem = ({ item, index }) => { 
            // console.log('item :>> ',index, item.post_image);
            return (
            <TouchableOpacity
                onPress={() => navigation.push('postDetail/postDetailScreen', {
                    id: item.ID
                })}
                activeOpacity={0.9}
            >
                <ImageBackground
                    // source={item?.post_image?.length > 10  ? item.post_image : image }
                    source={{ uri: item?.post_image?.length > 10  ? item.post_image : image }}
                    // source={{ uri: 'https://smartincome.tips/wp-content/uploads/2024/08/image-21.webp' }}
                    fallbackUrl={Image}
                    style={{
                        width: itemWidth - 6,
                        height: 200,
                        alignItems: "center",
                        justifyContent: 'center',
                        paddingHorizontal: Sizes.fixPadding
                    }}
                    borderRadius={Sizes.fixPadding - 5.0}
                >
                    <Text numberOfLines={2} style={{ ...Fonts.white25Bold }}>
                        {item.post_title?.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '')}
                    </Text>
                        {/* <HtmlContentRenderer htmlContent={item.excerpt} /> */}
                    <Text numberOfLines={3} style={{ ...Fonts.white15Regular, textAlign: 'center', marginTop: 4 }}>
                        {item.post_content?.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '')}
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        )}

        return (
            <Carousel
                ref={flatListRef}
                data={posts}
                sliderWidth={width}
                itemWidth={itemWidth}
                renderItem={renderItem}
                autoplay={true}
                loop={true}
                containerCustomStyle={{ marginTop: Sizes.fixPadding * 2.0,  marginBottom: Sizes.fixPadding * 2.0  }}
                autoplayInterval={4000}
            />
        );
    }

    function popularCourses() {
        const image = require('../../../assets/images/category/category_1.jpg');
        const posts = data.courses;
        if(loading) return <Text>Loading...</Text>
        if(!loading && posts.length <= 0) return <Text>No items</Text>

        const renderItem = ({ item }) => (
            <TouchableOpacity
                onPress={() => navigation.push('courseDetail/courseDetailScreen',
                    {
                        image: image,
                        id: item.ID,
                        courseName: item.post_title,
                        content: item.post_content,
                        courseCategory: JSON.parse(item.categories).length > 0 ? JSON.parse(item.categories)[0] : "",
                        courseRating: '5.0',
                        courseNumberOfRating: '667',
                        coursePrice: '567',
                    }
                )}
                activeOpacity={0.9}
                style={styles.popularCoursesContainerStyle}>
                <Image
                    source={item?.post_image ?? image}
                    resizeMode="cover"
                    style={styles.popularCoursesImageStyle}
                />
                <View style={styles.popularCoursesInformationContainerStyle}>
                    <Text style={{ ...Fonts.gray15Regular }}>
                        {item.post_title}
                    </Text>
                    <Text style={{ ...Fonts.black17Bold, marginVertical: Sizes.fixPadding - 5.0 }}>
                        {JSON.parse(item.categories).length > 0 ? JSON.parse(item.categories)[0] : ""}
                    </Text>
                    <View style={{ backgroundColor: 'gray', height: 0.2, }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding - 5.0 }}>
                        <Text style={{ ...Fonts.black15Bold }}>{'5.0'}</Text>
                        <MaterialIcons name="star" size={17} color="black" />
                        <Text style={{ ...Fonts.black15Bold, marginLeft: Sizes.fixPadding - 5.0 }}>
                            ({'768'})
                        </Text>
                    </View>
                    <Text style={{ ...Fonts.black19Bold, marginTop: Sizes.fixPadding }}>
                        ${'59'}
                    </Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={posts}
                keyExtractor={(item) => `${item.ID}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    paddingHorizontal: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 4.0
                }}
            />
        )
    }

    function popularPosts() {
        const image = require('../../../assets/images/category/category_1.jpg');
        const posts = data.topPosts;
        if(loading) return <Text>Loading...</Text>
        if(!loading && posts.length <= 0) return <Text>No items</Text>

        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                onPress={() => navigation.push('postDetail/postDetailScreen', {
                    id: item.ID
                })}
                activeOpacity={0.9}
                style={[
                    styles.popularTipsContainerStyle,
                    {
                        width: (width / columns) - 15,  // Adjust width based on columns
                        marginRight: (index + 1) % columns === 0 ? 0 : 10, // Gap between items horizontally
                        marginBottom: 10, // Gap between items vertically
                    }
                ]}
            >
                <Image
                    source={item?.post_image ?? image}
                    resizeMode="cover"
                    style={styles.popularTipsImageStyle}
                />
                <View style={styles.popularTipsInformationContainerStyle}>
                    <Text style={{ ...Fonts.gray15Regular }}>
                        {item.post_title}
                    </Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <ScrollView>
            <FlatList
                data={posts}
                key={`flatlist-columns-${columns}`} // Use a unique key based on columns
                keyExtractor={(item) => `${item.ID}-${columns}`}
                renderItem={renderItem}
                numColumns={columns} // Use the columns state here
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true} // Enable nested scrolling
                scrollEnabled={false} // Disable FlatList's own scrolling
                contentContainerStyle={{
                    paddingHorizontal: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 4.0,
                }}
            />
            </ScrollView>

        )
    }

    function newCourses() {
        const image = require('../../../assets/images/category/category_1.jpg');
        const posts = data.topPosts;
        if(loading) return <Text>Loading...</Text>
        if(!loading && posts.length <= 0) return <Text>No items</Text>

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('courseDetail/courseDetailScreen',
                    {
                        image: image,
                        id: item.ID,
                        courseName: item.post_title,
                        content: item.post_content,
                        courseCategory: JSON.parse(item.categories).length > 0 ? JSON.parse(item.categories)[0] : "",
                        courseRating: '5.0',
                        courseNumberOfRating: '667',
                        coursePrice: '567',
                    }
                )}
                style={styles.popularCoursesContainerStyle}>
                <Image
                    source={item?.post_image ?? image}
                    resizeMode="cover"
                    style={styles.popularCoursesImageStyle}
                />
                <View style={styles.popularCoursesInformationContainerStyle}>
                    <Text style={{ ...Fonts.gray15Regular }}>
                        {item.post_title}
                    </Text>
                    <Text style={{ ...Fonts.black17Bold, marginVertical: Sizes.fixPadding - 5.0 }}>
                        {JSON.parse(item.categories).length > 0 ? JSON.parse(item.categories)[0] : ""}
                    </Text>
                    <View style={{ backgroundColor: 'gray', height: 0.2, }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding - 5.0 }}>
                        <Text style={{ ...Fonts.black15Bold }}>{'5.0'}</Text>
                        <MaterialIcons name="star" size={17} color="black" />
                        <Text style={{ ...Fonts.black15Bold, marginLeft: Sizes.fixPadding - 5.0 }}>
                            ({'459'})
                        </Text>
                    </View>
                    <Text style={{ ...Fonts.black19Bold, marginTop: Sizes.fixPadding }}>
                        ${'54'}
                    </Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={posts}
                keyExtractor={(item) => `${item.ID}-'newCourse`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    paddingHorizontal: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 4.0
                }}
            />
        )
    }

    function instructors() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('instructor/instructorScreen', {
                    name: item.instructorName,
                    rating: item.instructorRating,
                    image: item.image,
                })}
                style={styles.instructorsContainerStyle}>
                <Image source={item.image}
                    style={{ height: 120.0, width: 120.0, borderRadius: 60.0 }}
                    resizeMode="cover"
                />
                <Text style={{ ...Fonts.black17Bold, marginTop: Sizes.fixPadding + 7.0 }}>
                    {item.instructorName}
                </Text>
                <Text style={{ ...Fonts.gray15Regular, marginVertical: Sizes.fixPadding - 5.0 }}>
                    {item.instructorRole}
                </Text>
                <View style={{ backgroundColor: "gray", height: 0.2, marginVertical: Sizes.fixPadding - 5.0 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizes.fixPadding - 5.0 }}>
                    <Text style={{ ...Fonts.black15Bold }}>{item.instructorRating}</Text>
                    <MaterialIcons name="star" size={17} color="black" />
                    <Text style={{ ...Fonts.black15Bold, marginLeft: Sizes.fixPadding - 5.0 }}>
                        ({item.instructorNumberOfRating} Reviews)
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={instructorsList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{
                    paddingHorizontal: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 4.0
                }}
            />
        )
    }
}

const categoryList = [
    {
        id: '1',
        categoryName: 'Art & Photography',
        categoryImage: require('../../../assets/images/category/category_1.jpg'),
    },
    {
        id: '2',
        categoryName: 'Health & Fitness',
        categoryImage: require('../../../assets/images/category/category_2.jpg'),
    },
    {
        id: '3',
        categoryName: 'Business & Marketing',
        categoryImage: require('../../../assets/images/category/category_3.jpg'),
    },
    {
        id: '4',
        categoryName: 'Computer Science',
        categoryImage: require('../../../assets/images/category/category_4.jpg'),
    },
    {
        id: '5',
        categoryName: '3D Printing Concept',
        categoryImage: require('../../../assets/images/category/category_5.jpg'),
    },
    {
        id: '6',
        categoryName: 'Electronic',
        categoryImage: require('../../../assets/images/category/category_6.jpg'),
    }
];

const popularCoursesList = [
    {
        courseId: 3,
        image: require("../../../assets/images/new_course/new_course_3.png"),
        courseName: "Console Development Basics with Unity",
        courseCategory: "Computer Science",
        courseRating: "4.0",
        courseNumberOfRating: "4",
        coursePrice: "49"
    },
    {
        courseId: 1,
        image: require("../../../assets/images/new_course/new_course_1.png"),
        courseName: "Design Instruments for Communication",
        courseCategory: "Business & Marketing",
        courseRating: "4.0",
        courseNumberOfRating: "5",
        coursePrice: "59"
    },
    {
        courseId: 4,
        image: require("../../../assets/images/new_course/new_course_4.png"),
        courseName: "How to be a DJ? Make Electronic Music",
        courseCategory: "Electronic",
        courseRating: "4.8",
        courseNumberOfRating: "9",
        coursePrice: "59"
    },
    {
        courseId: 2,
        image: require("../../../assets/images/new_course/new_course_2.png"),
        courseName: "Weight Training Courses with Any Di",
        courseCategory: "Health & Fitness",
        courseRating: "4.5",
        courseNumberOfRating: "7",
        coursePrice: "64"
    },
];

const newCoursesList = [
    {
        courseId: 1,
        image: require("../../../assets/images/new_course/new_course_1.png"),
        courseName: "Design Instruments for Communication",
        courseCategory: "Business & Marketing",
        courseRating: "4.0",
        courseNumberOfRating: "5",
        coursePrice: "59"
    },
    {
        courseId: 2,
        image: require("../../../assets/images/new_course/new_course_2.png"),
        courseName: "Weight Training Courses with Any Di",
        courseCategory: "Health & Fitness",
        courseRating: "4.5",
        courseNumberOfRating: "7",
        coursePrice: "64"
    },
    {
        courseId: 3,
        image: require("../../../assets/images/new_course/new_course_3.png"),
        courseName: "Console Development Basics with Unity",
        courseCategory: "Computer Science",
        courseRating: "4.0",
        courseNumberOfRating: "4",
        coursePrice: "49"
    },
    {
        courseId: 4,
        image: require("../../../assets/images/new_course/new_course_4.png"),
        courseName: "How to be a DJ? Make Electronic Music",
        courseCategory: "Electronic",
        courseRating: "4.8",
        courseNumberOfRating: "9",
        coursePrice: "59"
    }
]

const instructorsList = [
    {
        id: 1,
        image: require("../../../assets/images/user_profile/user_1.jpg"),
        instructorName: "Don Hart",
        instructorRole: "Teacher",
        instructorRating: "4.5",
        instructorNumberOfRating: "7"
    },
    {
        id: 2,
        image: require("../../../assets/images/user_profile/user_3.jpg"),
        instructorName: "Dawn Morales",
        instructorRole: "Marketing Consultant",
        instructorRating: "4.9",
        instructorNumberOfRating: "15"
    },
    {
        id: 3,
        image: require("../../../assets/images/user_profile/user_4.jpg"),
        instructorName: "Allison Perry",
        instructorRole: "C++ Expert",
        instructorRating: "5.0",
        instructorNumberOfRating: "131"
    },
    {
        id: 4,
        image: require("../../../assets/images/user_profile/user_5.jpg"),
        instructorName: "Anita Ruiz",
        instructorRole: "Fitness Instructor",
        instructorRating: "5.0",
        instructorNumberOfRating: "149"
    },

    {
        id: 5,
        image: require("../../../assets/images/user_profile/user_8.jpg"),
        instructorName: "Bob Perez",
        instructorRole: "Flutter Expert",
        instructorRating: "5.0",
        instructorNumberOfRating: "184"
    }
]

function title({ title }) {
    return (
        <View style={{ marginHorizontal: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.black20Bold }}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainerStyle: {
        width: 140.0,
        height: 140.0,
        borderRadius: 70.0,
        overflow: 'hidden',
        marginHorizontal: Sizes.fixPadding,
    },
    categoryBlurContainerStyle: {
        // backgroundColor: "rgba(0, 0, 0, 0.50)",
        width: 140.0,
        height: 140.0,
        borderRadius: 70.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0
    },
    popularCoursesContainerStyle: {
        elevation: 1.0,
        width: 220.0,
        borderRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        marginRight: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    popularTipsContainerStyle: {
        elevation: 1.0,
        // width: 220.0,
        borderRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        // marginRight: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    popularCoursesImageStyle: {
        width: 220.0,
        height: 150.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        borderTopLeftRadius: Sizes.fixPadding * 2.0
    },
    popularTipsContainerStyle: {
        // margin: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    popularTipsImageStyle: {
        width: '100%',
        height: 100, // Set height as needed
    },
    popularTipsInformationContainerStyle: {
        padding: 8,
    },
    popularCoursesInformationContainerStyle: {
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 2.0
    },
    instructorsContainerStyle: {
        alignItems: 'center',
        elevation: 2.0,
        width: 180.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 2.0,
        marginRight: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    categoryListContentStyle: {
        paddingVertical: Sizes.fixPadding * 1.0,
        paddingHorizontal: Sizes.fixPadding,
        justifyContent: "space-between", // Aligns items in rows
    },
    categoryListContainerStyle: {
        flex: 1,
        alignItems: "center",
        margin: 5,
    },
    categoryImageBackgroundStyle: {
        width: '100%',
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    categoryListBlurContainerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // padding: 10,
        // borderRadius: 50,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryTextStyle: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});

export default HomeScreen;