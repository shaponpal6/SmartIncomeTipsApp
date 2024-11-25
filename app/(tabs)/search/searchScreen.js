import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import CollapsingToolbar from "../../../component/sliverAppBar";
import FindMyIncomeTips from "../../../component/FindMyIncomeTips";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Button from "../../../component/Button";
import { useDatabase } from '../../../store/SQLiteDatabaseContext';
import { useLocalSearchParams, useNavigation } from "expo-router";

const SearchScreen = () => {
    const [listData, setListData] = useState([]);
    const [choose, setChoose] = useState({profession: null, interest: null, skills: null});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();

    const [state, setState] = useState({
        isTextFieldFocus: false
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { isTextFieldFocus } = state;

    async function loadData({search="", page=1, limit= 10}) {
        // console.log('id :>> ', id);
        try{
            const data = await searchPosts({ search: search, page: page, limit: limit, postType: 'post'});
            // setData(data);
            setListData(data);
            setLoading(false);
        }catch(err){
            setLoading(false);
            console.error('err :>> ', err);
        }
    }

    useEffect(() => {
        loadData({});
    }, []);

    const getMoreIdeas = () => {
        loadData({page: page+1})
        setPage(page+1)
    }

    return (
        <View style={{ flex: 1 }}>
            <CollapsingToolbar
            leftItem={
                <Logo text={ "Smart Income Tips"}/>
            }
            rightItem={<TopMenu/>}
                element={
                    <View style={styles.textInputContainerStyle}>
                       
                        <FindMyIncomeTips onChange={data=>setChoose(data)}/>
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={380}
                src={require('../../../assets/images/appbar_bg.png')}
            >
                <View style={{
                    paddingBottom: Sizes.fixPadding * 7.0, paddingTop: Sizes.fixPadding * 4.0,
                    paddingHorizontal: Sizes.fixPadding * 2.0
                }}>
                    {popularTagsTitle()}
                    {listData.map((item) => popularTag({ search: item.post_title.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '') }))}
                    {/* {popularTag({ search: 'Business & Management' })} */}
                    <View style={{width: '100%', height:20}}/>
                    <Button
                        title="Get More Income Ideas"
                        onPress={getMoreIdeas}
                    />
                </View>
            </CollapsingToolbar>
        </View>
    )

    function popularTag({ search }) {
        return (
            <View key={search} style={{ marginTop: Sizes.fixPadding + 3.0 }}>
                <Text style={{ ...Fonts.gray19Regular }}>{search}</Text>
                <View style={{ backgroundColor: 'gray', height: 0.3, marginTop: Sizes.fixPadding }}></View>
            </View>
        )
    }

    function popularTagsTitle() {
        return (
            <Text style={{ ...Fonts.black25Bold }}>
                Popular Ideas
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    textInputContainerStyle: {
        backgroundColor: 'transparent',
        width: '100%',
        borderRadius: Sizes.fixPadding * 3.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: 'center'
    }
});

export default SearchScreen;