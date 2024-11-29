import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TimelineItem = ({ percentage, descriptionList }) => (
  <View style={styles.timelineItem}>
    <View style={styles.iconWrapper}>
      <Text style={styles.iconText}>{percentage}</Text>
    </View>
    <View style={styles.contentWrapper}>
      {descriptionList.map((desc, index) => (
        <View style={styles.listItem} key={index}>
          <Icon name="circle" size={20} color="#ff0000" style={styles.listIcon} />
          <Text style={styles.listText}>{desc}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TimelineItem
        percentage="25%"
        descriptionList={[
          "Meet the artist, a live AMA with SHAG will be scheduled and held on discord",
        ]}
      />
      <TimelineItem
        percentage="50%"
        descriptionList={[
          "We will release 5 Qitty Qats from their den (tokens that are held back from the sale) and air drop them to lucky Qitty Qats holders.",
        ]}
      />
      <TimelineItem
        percentage="75%"
        descriptionList={[
          "We will begin the design of our Qitty Qats Merch, which will include a variety of high-end collectibles including, but not limited to prints, clothing, collectibles and more from SHAG.",
        ]}
      />
      <TimelineItem
        percentage="100%"
        descriptionList={[
          "Lets celebrate! We will open the Qathouse and have a rip roaring time celebrating with our members! Details to be revealed!",
          "We will begin the design of our Qitty Qats Merch, which will include a variety of high-end collectibles including, but not limited to prints, clothing, collectibles and more from SHAG.",
          "We will open the Qathouse, which is your pass to the hottest club around. Here we will engage with the community to develop the metaverse world of Qitty Qats with programs and events. Owning a Qitty Qat is your membership card to the world of Qitty Qats.",
          "On October 31st, we will take a snapshot of Qitty Qat holders and on November 2nd we will airdrop new exclusive Qitty Qats. If you own 4 Qitty Qats, you will get 1 exclusive Qitty Qat NFT. If you own 8 Qitty Qats, you will get 1 exclusive Qitty Qat NFT. So, you could possibly get up to 2 exclusive Qitty Qat NFTs air dropped to you on November 2nd!",
          "More surprises to be revealed…",
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  timelineItem: {
    marginBottom: 20,
    borderLeftWidth: 2,
    borderColor: "red",
    paddingLeft: 10,
    position: "relative",
  },
  iconWrapper: {
    backgroundColor: "red",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: -30,
    top: 0,
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
  },
  contentWrapper: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  listIcon: {
    marginRight: 10,
  },
  listText: {
    color: "#fff",
    flex: 1,
  },
});
