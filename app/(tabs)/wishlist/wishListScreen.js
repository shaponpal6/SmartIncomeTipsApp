import { SwipeItem, SwipeButtonsContainer } from 'react-native-swipe-item';
import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../../constant/styles";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from "expo-router";
import CollapsingToolbar from "../../../component/sliverAppBar";
import Search from "../../../component/Search";
import { Snackbar } from 'react-native-paper';
import { useDatabase } from '../../../store/SQLiteDatabaseContext';
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";

const { width } = Dimensions.get('window');
const image = require("../../../assets/images/new_course/new_course_2.png");

const wishListData = [
    {
        key: '1',
        image: require('../../../assets/images/new_course/new_course_1.png'),
        subject: 'Design instruments for Communication',
        amount: 59,
        rating: '4.0',
    },
    {
        key: '2',
        image: require('../../../assets/images/new_course/new_course_2.png'),
        subject: 'Weight Training Courses with Any Di',
        amount: 64,
        rating: '4.5',
    },
];

const WishListScreen = () => {
    const [listData, setListData] = useState([]);
    // const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();
    // const { id, category } = useLocalSearchParams();
    
    async function loadData(search="") {
        // console.log('id :>> ', id);
        try{
            const data = await searchPosts({ search: search, page: 1, limit: 10, postType: 'post'});
            // setData(data);
            setListData(data);
            setLoading(false);
        }catch(err){
            setLoading(false);
            console.error('err :>> ', err);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const [showSnackBar, setShowSnackBar] = useState(false);

    

    const rightButton = ({ key }) => (
        <SwipeButtonsContainer>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => deleteRow({ rowKey: key })}
                style={styles.backDeleteContinerStyle}
            >
                <MaterialIcons name="delete" size={25} color={Colors.whiteColor} />
                <Text style={{ ...Fonts.white15Regular }}>Delete</Text>
            </TouchableOpacity>
        </SwipeButtonsContainer >
    );

    const deleteRow = ({ rowKey }) => {
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
        setShowSnackBar(true);
    };

    function renderItem({ item, index }) {
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
            <View key={item.ID}>
                <SwipeItem
                    style={styles.button}
                    rightButtons={rightButton({ key: item.ID })}
                >
                    <View style={styles.wishlistContainerStyle}>
                        <Image
                            source={image}
                            style={styles.wishlistImageStyle}
                            resizeMode="cover"
                        />
                        <View style={styles.wishlistInfoContainerStyle}>
                            <Text style={{ ...Fonts.black17Bold }}>
                                {item.post_title}
                            </Text>
                            <Text numberOfLines={3} style={{ textAlign: 'left' }}>
                                {item.excerpt.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '')}
                            </Text>
                        </View>
                    </View>
                </SwipeItem>
            </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <CollapsingToolbar
            leftItem={
                <Logo text={ "Smart Income Tips"}/>
            }
            rightItem={<TopMenu/>}
                
                element={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ ...Fonts.white60Regular, marginBottom: 30 }}>Income Ideas</Text>
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
                {listData.length == 0 ?
                    <View style={{
                        flex: 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <FontAwesome5 name="heart-broken" size={50} color="gray" />
                        <Text style={{ ...Fonts.gray17Bold, marginTop: Sizes.fixPadding * 2.0 }}>
                            No Items Found
                        </Text>
                    </View>
                    :
                    <View style={styles.container} >
                        {listData.map((item) => renderItem({ item }))}
                    </View>}
            </CollapsingToolbar>
            <Snackbar
                style={styles.snackBarContainerStyle}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                Item Removed
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 100,
        alignSelf: 'center',
        marginVertical: 30,
    },
    wishlistContainerStyle: {
        flexDirection: 'row',
        width: width - 30,
        elevation: 2.0,
        ...CommonStyles.shadow,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding * 2.0,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding
    },
    wishlistImageStyle: {
        height: 110.0,
        width: 110.0,
        borderRadius: Sizes.fixPadding * 2.0,
        marginLeft: Sizes.fixPadding
    },
    wishlistInfoContainerStyle: {
        marginLeft: Sizes.fixPadding,
        width: width - 180,
        marginVertical: 3.0
    },
    backDeleteContinerStyle: {
        height: 110.0,
        width: 110.0,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'red',
        justifyContent: 'center',
        marginVertical: 25.0
    },
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1,
    },
    snackBarContainerStyle: {
        position: 'absolute',
        bottom:-10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
    },
});

export default WishListScreen;