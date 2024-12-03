import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  NativeSyntheticEvent, 
  TextInputSubmitEditingEventData 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../constant/styles";

interface SearchProps {
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
  containerStyle?: object;
  inputStyle?: object;
  buttonStyle?: object;
  isLeftIcon?: boolean;
}

const Search: React.FC<SearchProps> = ({
  placeholder,
  onChange,
  onSubmit,
  containerStyle,
  inputStyle,
  buttonStyle,
  isLeftIcon = true,
}) => {
  const [isTextFieldFocus, setIsTextFieldFocus] = useState(false);
  const [text, setText] = useState("");

  const handleTextSubmit = () => {
    if (onSubmit) {
      onSubmit(text);
    }
    setText(""); // Clear the input field after submission
  };

  return (
    <View style={[styles.textInputContainerStyle, containerStyle]}>
      {isLeftIcon && (
        <MaterialIcons
          name="search"
          size={24}
          color={isTextFieldFocus ? Colors.primaryColor : "gray"}
          style={styles.leftIconStyle}
        />
      )}
      <TextInput
        placeholder={placeholder || "Search..."}
        style={[
          styles.textInputStyle,
          { marginLeft: isLeftIcon ? Sizes.fixPadding * 6.0 : 0 },
          inputStyle,
        ]}
        onFocus={() => setIsTextFieldFocus(true)}
        onBlur={() => setIsTextFieldFocus(false)}
        selectionColor={Colors.primaryColor}
        value={text}
        onChangeText={(newText) => {
          setText(newText);
          if (onChange) onChange(newText);
        }}
        onSubmitEditing={() => handleTextSubmit()}
      />
      <TouchableOpacity
        style={[styles.buttonStyle, buttonStyle]}
        onPress={handleTextSubmit}
      >
        <MaterialIcons name="send" size={24} color={Colors.grayColor} />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  textInputContainerStyle: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding,
    maxHeight: 60, // Ensures alignment is good across devices
  },
  textInputStyle: {
    flex: 1,
    ...Fonts.black15Regular,
  },
  leftIconStyle: {
    position: "absolute",
    left: 10,
  },
  buttonStyle: {
    marginLeft: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
    color: "#333",
    backgroundColor: "#333",
    // padding: 1
  },
});
