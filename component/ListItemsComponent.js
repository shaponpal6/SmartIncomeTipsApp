import React, { useState, useEffect }  from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Fonts, Sizes, Colors, CommonStyles } from "../constant/styles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Image from './LazyImage';

const { width } = Dimensions.get('window');
const image = require("../assets/images/new_course/new_course_2.png");

const ListItemsComponent = ({title="", posts=[]}) => {
    const [data, setData] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        setData(posts);
    }, [posts]);

    return (
        <View style={{
            paddingBottom: Sizes.fixPadding * 7.0, paddingTop: Sizes.fixPadding * 4.0,
            paddingHorizontal: Sizes.fixPadding * 2.0
        }}>
            <Text style={{ ...Fonts.black25Bold }}>
                {title}
            </Text>
            {data.map((item) => popularTag({ search: item.post_title.replace(/<\/?[^>]+(>|$)|&#\d+;/g, '') }))}
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


}

const styles = StyleSheet.create({
    
});

export default ListItemsComponent
