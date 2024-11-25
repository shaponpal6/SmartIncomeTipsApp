import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import CollapsingToolbar from "../../../component/sliverAppBar";
import FindMyIncomeTips from "../../../component/FindMyIncomeTips";
import Logo from "../../../component/Logo";
import TopMenu from "../../../component/TopMenu";
import Button from "../../../component/Button";
import PostList from "../../../component/PostList";
import Loading from '../../../component/Loading';
import ListItemsComponent from "../../../component/ListItemsComponent";
import { useDatabase } from '../../../store/SQLiteDatabaseContext';
import { useLocalSearchParams, useNavigation } from "expo-router";

const SearchScreen = () => {
    const [listData, setListData] = useState([]);
    const [choose, setChoose] = useState({profession: null, interest: null, skills: null});
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState({ search: '', page: 1, limit: 20, postType: 'post'});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();

    const [state, setState] = useState({
        isTextFieldFocus: false
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { isTextFieldFocus } = state;

    async function loadData() {
        try{
            const data = await searchPosts(query);
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
    }, [query]);
    
    useEffect(() => {
        const prepareChoose = (input) => {
            return {
              profession: input.profession?.term_id ? [input.profession.term_id] : [],
              interest: input.interest?.term_id ? [input.interest.term_id] : [],
              skills: input.skills?.term_id ? [input.skills.term_id] : []
            };
          };
        setQuery({...query, ...prepareChoose(choose)});
    }, [choose]);

    const getMoreIdeas = () => {
        loadData({page: page+1})
        setPage(page+1)
    }

    if(loading) {
        return <Loading/>
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
                <PostList posts={listData} />
                {/* <ListItemsComponent title="Hello List" posts={listData} /> */}
                <Button
                    title="Get More Income Ideas"
                    onPress={getMoreIdeas}
                />
            </CollapsingToolbar>
        </View>
    )
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