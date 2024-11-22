import { Tabs } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Colors, Fonts, Sizes } from '../../constant/styles';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import MyStatusBar from '../../component/myStatusBar';
import { useFocusEffect } from '@react-navigation/native';
import { SQLiteDatabaseProvider, useDatabase } from '../../store/SQLiteDatabaseContext';

export default function TabLayout() {

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1)
    setTimeout(() => {
      setBackClickCount(0)
    }, 1000)
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <SQLiteDatabaseProvider>
      <View style={{ flex: 1 }}>
        <MyStatusBar />
        <Tabs
          screenOptions={() => ({ headerShown: false })}
          tabBar={props => <MyTabBar {...props} />}
        >
          <Tabs.Screen
            name="home/homeScreen"
            options={{ tabBarLabel: 'Home' }}
          />
          <Tabs.Screen
            name="wishlist/wishListScreen"
            options={{ tabBarLabel: 'Ideas' }}
          />
          <Tabs.Screen
            name="search/searchScreen"
            options={{ tabBarLabel: 'Find My Ideas' }}
          />
          <Tabs.Screen
            name="course/coursesScreen"
            options={{ tabBarLabel: 'Course' }}
          />
          <Tabs.Screen
            name="setting/settingScreen"
            options={{ tabBarLabel: 'Earning' }}
          />
        </Tabs>
        {
          backClickCount == 1
            ?
            <View style={styles.animatedView}>
              <Text style={{ ...Fonts.white15Regular }}>
                Press Back Once Again to Exit
              </Text>
            </View>
            :
            null
        }
      </View>
    </SQLiteDatabaseProvider>
  );

  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <View style={styles.tabBarStyle}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={`${index}`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: isFocused ? 1 : 0.4,
                alignItems: 'center',
              }}
            >
              {
                isFocused
                  ?
                  <View style={styles.focusedTabWrapper}>
                    {index === 1 ? 
                    <MaterialCommunityIcons
                      name={'head-lightbulb'}
                      size={27}
                      color={Colors.orangeColor}
                    />: index === 4 ?
                    <FontAwesome6
                      name={'sack-dollar'}
                      size={27}
                      color={Colors.orangeColor}
                    /> :
                    <MaterialIcons
                      name={
                        index == 0 ? 'home' :
                          index == 1 ? 'favorite-border' :
                            index == 2 ? 'search' :
                              index == 3 ? 'library-books' : 'settings'}
                      size={27}
                      color={Colors.orangeColor}
                    />}
                    <Text
                      numberOfLines={1}
                      style={{
                        ...Fonts.black17Bold,
                        flex: 1,
                        marginLeft: Sizes.fixPadding * 1.0
                      }}
                    >
                      {label}
                    </Text>
                  </View>
                  :
                   index === 1 ? 
                    <MaterialCommunityIcons
                      name={'head-lightbulb'}
                      size={27}
                      color={Colors.orangeColor}
                    />: index === 4 ?
                    <FontAwesome6
                      name={'sack-dollar'}
                      size={27}
                      color={Colors.orangeColor}
                    /> :
                    <MaterialIcons
                      name={
                        index == 0 ? 'home' :
                          index == 1 ? 'favorite-border' :
                            index == 2 ? 'search' :
                              index == 3 ? 'library-books' : 'settings'}
                      size={27}
                      color={Colors.orangeColor}
                    />
              }
            </TouchableOpacity>
          )
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  focusedTabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor,
    // backgroundColor: '#FFEACC',
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 4.0,
  },
  tabBarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    elevation: 5.0,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    height: 65,
    alignItems: 'center'
  },
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 20,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
});