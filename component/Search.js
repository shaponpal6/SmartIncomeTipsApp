import React, { useState } from "react";
import { View, StyleSheet, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../constant/styles";

interface SearchProps {
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
}

const Search: React.FC<SearchProps> = ({ placeholder, onChange, onSubmit }) => {
  const [isTextFieldFocus, setIsTextFieldFocus] = useState(false);

  return (
    <View style={styles.textInputContainerStyle}>
      <MaterialIcons
        name="search"
        size={24}
        color={isTextFieldFocus ? Colors.primaryColor : "gray"}
        style={{
          position: 'absolute',
          left: 10.0,
        }}
      />
      <TextInput
        placeholder={placeholder || "Search..."}
        style={{ marginLeft: Sizes.fixPadding * 6.0, ...Fonts.black15Regular }}
        onFocus={() => setIsTextFieldFocus(true)}
        onBlur={() => setIsTextFieldFocus(false)}
        selectionColor={Colors.primaryColor}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  textInputContainerStyle: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: 'center',
    position: 'relative', // To ensure the icon and input align properly
  },
});
