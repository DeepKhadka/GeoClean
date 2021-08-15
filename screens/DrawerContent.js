import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function DrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 3 }}>
        <Image
          source={require("../assets/logo_geoclean.png")}
          style={{
            width: "100%",
            height: "100%",
            marginTop: "5%",
          }}
        />
      </View>
      <View style={{ flex: 7}}>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="home" color="gray" size={size} />
            )}
            label="Home"
            labelStyle={{ color: "black", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("AdminHome");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="calendar" color="gray" size={size} />
            )}
            label="Manage Events"
            labelStyle={{ color: "black", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("EventManagement");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account-group" color="gray" size={size} />
            )}
            label="Manage Volunteers"
            labelStyle={{ color: "black", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("VolunteerManagement");
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-search" color="gray" size={size} />
            )}
            label="View Zones"
            labelStyle={{ color: "black", fontSize: 15, fontWeight: "bold" }}
            onPress={() => {
              props.navigation.navigate("ZoneManagement");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="exit-to-app" color="gray" size={size} />
            )}
            label="Sign Out"
            labelStyle={{ color: "black", fontSize: 15, fontWeight: "bold" }}
            onPress={handleSignout}
          />
        </Drawer.Section>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "black",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 30,
    marginVertical: "10%",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    marginTop: 20,
    flexDirection: "column",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },

  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
