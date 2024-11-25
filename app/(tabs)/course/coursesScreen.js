import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { Fonts, Sizes, Colors, CommonStyles } from "../../../constant/styles";
import CollapsingToolbar from "../../../component/sliverAppBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Search from "../../../component/Search";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Image from "../../../component/LazyImage";
import PostList from "../../../component/PostList";
import Loading from '../../../component/Loading';

import { useDatabase } from "../../../store/SQLiteDatabaseContext";

const { width } = Dimensions.get("window");

const CoursesScreen = () => {
    const [listData, setListData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const {
        insertDataWithTransaction,
        getPostById,
        getCategories,
        getTags,
        searchPosts,
        homePageData,
    } = useDatabase();
    // const { id, category } = useLocalSearchParams();

    async function loadData(search = "") {
        setLoading(true);
        // console.log('id :>> ', id);
        try {
            const data = await searchPosts({
                search: search,
                page: 1,
                limit: 10,
                postType: "post",
            });
            setData(data);
            setListData(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("err :>> ", err);
        }
    }
    useEffect(() => {
        loadData("");
    }, []);

    if(loading) {
        return <Loading/>
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
            <CollapsingToolbar
                leftItem={<Logo text={"Smart Income Tips"} />}
                rightItem={<TopMenu />}
                element={
                    <View
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    >
                        <Text style={{ ...Fonts.white60Regular, marginBottom: 30 }}>
                            Courses
                        </Text>
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
                src={require("../../../assets/images/appbar_bg.png")}
            >
                <PostList posts={data} />
            </CollapsingToolbar>
        </View>
    );
};

const styles = StyleSheet.create({});

export default CoursesScreen;
