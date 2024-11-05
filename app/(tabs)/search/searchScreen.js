import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import CollapsingToolbar from "../../../component/sliverAppBar";

const SearchScreen = () => {

    const [state, setState] = useState({
        isTextFieldFocus: false
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { isTextFieldFocus } = state;

    return (
        <View style={{ flex: 1 }}>
            <CollapsingToolbar
                element={
                    <View style={styles.textInputContainerStyle}>
                        <MaterialIcons name="search" size={24}
                            color={isTextFieldFocus ? Colors.primaryColor : "gray"}
                            style={{
                                position: 'absolute',
                                left: 10.0,
                            }}
                        />
                        <TextInput
                            placeholder="Try Easy ways write a novel"
                            style={{ marginLeft: Sizes.fixPadding * 6.0, ...Fonts.black15Regular }}
                            onFocus={() => updateState({ isTextFieldFocus: true })}
                            onBlur={() => updateState({ isTextFieldFocus: false })}
                            selectionColor={Colors.primaryColor}
                        />
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolBarMinHeight={40}
                toolbarMaxHeight={230}
                src={require('../../../assets/images/appbar_bg.png')}
            >
                <View style={{
                    paddingBottom: Sizes.fixPadding * 7.0, paddingTop: Sizes.fixPadding * 4.0,
                    paddingHorizontal: Sizes.fixPadding * 2.0
                }}>
                    {popularTagsTitle()}
                    {popularTag({ search: 'Business & Management' })}
                    {popularTag({ search: 'Creative Art & Media' })}
                    {popularTag({ search: 'Health & Psychology' })}
                    {popularTag({ search: 'History' })}
                    {popularTag({ search: 'Languages & Cultures' })}
                    {popularTag({ search: 'Science,Engineering & Maths' })}
                    {popularTag({ search: 'Study Skills' })}
                    {popularTag({ search: 'Tech & Coding' })}
                </View>
            </CollapsingToolbar>
        </View>
    )

    function popularTag({ search }) {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 3.0 }}>
                <Text style={{ ...Fonts.gray19Regular }}>{search}</Text>
                <View style={{ backgroundColor: 'gray', height: 0.3, marginTop: Sizes.fixPadding }}></View>
            </View>
        )
    }

    function popularTagsTitle() {
        return (
            <Text style={{ ...Fonts.black25Bold }}>
                Popular Tags
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    textInputContainerStyle: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: Sizes.fixPadding * 3.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: 'center'
    }
});

export default SearchScreen;