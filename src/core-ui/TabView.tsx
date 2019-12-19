import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TabView as Tab, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS } from '../general/constants/colors';
import { Text } from 'exoflex';
import { useDimensions } from '../helpers/dimensions';
import { FONT_SIZE } from '../general/constants/fonts';

type Scene = () => JSX.Element;

export type TabRoute = {
  key: string;
  title: string;
  scene: Scene;
};

type Props = {
  routes: Array<TabRoute>;
};

export default function TabView(props: Props) {
  let dimensions = useDimensions();
  const initialLayout = { width: dimensions.width };
  const { routes } = props;
  const [index, setIndex] = useState(0);
  let allRoutes = routes;
  let data: { [key: string]: Scene } = {};
  for (let { key, scene } of allRoutes) {
    data[key] = scene;
  }
  const renderScene = SceneMap(data);
  return (
    <Tab
      renderTabBar={(props) => (
        <TabBar
          {...props}
          renderLabel={({ route }) => (
            <Text weight="500" style={styles.labelStyle}>
              {route.title}
            </Text>
          )}
          scrollEnabled={true}
          tabStyle={styles.tabStyle}
          indicatorStyle={styles.indicatorStyle}
          inactiveColor={COLORS.grey}
          activeColor={COLORS.primaryColor}
          style={styles.tabBar}
        />
      )}
      navigationState={{ index, routes: allRoutes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  tabStyle: {
    width: 'auto',
    marginHorizontal: 6,
  },
  indicatorStyle: {
    backgroundColor: COLORS.primaryColor,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 1,
  },
  labelStyle: {
    fontSize: FONT_SIZE.medium,
  },
});
