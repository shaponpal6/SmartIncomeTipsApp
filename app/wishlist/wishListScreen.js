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
import { Colors, Fonts, Sizes, CommonStyles } from "../../constant/styles";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from "expo-router";
import CollapsingToolbar from "../../component/sliverAppBar";
import { Snackbar } from 'react-native-paper';
import { useDatabase } from '../../store/SQLiteDatabaseContext';

const { width } = Dimensions.get('window');
const image = require("../../assets/images/new_course/new_course_2.png");

const wishListData = [
    {
        key: '1',
        image: require('../../assets/images/new_course/new_course_1.png'),
        subject: 'Design instruments for Communication',
        amount: 59,
        rating: '4.0',
    },
    {
        key: '2',
        image: require('../../assets/images/new_course/new_course_2.png'),
        subject: 'Weight Training Courses with Any Di',
        amount: 64,
        rating: '4.5',
    },
];

const WishListScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();
    // const { id, category } = useLocalSearchParams();
    
    useEffect(() => {
        async function loadData() {
            // console.log('id :>> ', id);
            try{
                const data = await searchPosts({ page: 1, limit: 10, postType: 'post'});
                setData(data);
                setLoading(false);
            }catch(err){
                setLoading(false);
                console.error('err :>> ', err);
            }
        }
        loadData();
    }, []);

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState(wishListData);

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

    function renderItem({ item }) {
        return (
            <View key={item.key}>
                <SwipeItem
                    style={styles.button}
                    rightButtons={rightButton({ key: item.key })}
                >
                    <View style={styles.wishlistContainerStyle}>
                        <Image
                            source={item.image}
                            style={styles.wishlistImageStyle}
                            resizeMode="cover"
                        />
                        <View style={styles.wishlistInfoContainerStyle}>
                            <Text style={{ ...Fonts.black17Bold }}>
                                {item.subject}
                            </Text>
                            <Text style={{ ...Fonts.black17Bold, marginVertical: Sizes.fixPadding }}>
                                ${item.amount}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...Fonts.gray15Bold, marginRight: Sizes.fixPadding - 5.0 }}>
                                    {item.rating}
                                </Text>
                                <MaterialIcons name="star" size={17} color="black" />
                            </View>
                        </View>
                    </View>
                </SwipeItem>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <CollapsingToolbar
                element={
                    <Text style={{ ...Fonts.black25Bold }}>Wishlist</Text>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={230}
                src={require('../../assets/images/appbar_bg.png')}
            >
                {listData.length == 0 ?
                    <View style={{
                        flex: 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <FontAwesome5 name="heart-broken" size={50} color="gray" />
                        <Text style={{ ...Fonts.gray17Bold, marginTop: Sizes.fixPadding * 2.0 }}>
                            No Item in Wishlist
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