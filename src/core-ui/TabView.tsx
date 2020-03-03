import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { TabView as Tab, SceneMap, TabBar } from 'react-native-tab-view';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { useDimensions } from '../helpers/dimensions';
import { FONT_SIZE } from '../constants/fonts';
import { TabRoute, Scene } from '../types/types';

type Props = {
  initialRouteKey?: string;
  isScrollEnabled: boolean;
  routes: Array<TabRoute>;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TabView(props: Props) {
  let dimensions = useDimensions();
  const initialLayout = { width: dimensions.width };
  const { routes, containerStyle, isScrollEnabled, initialRouteKey } = props;

  let indexInitialRoute = 0;

  let allRoutes = routes;
  if (initialRouteKey) {
    indexInitialRoute = allRoutes.findIndex(
      ({ key }) => key === initialRouteKey,
    );
  }
  let data: { [key: string]: Scene } = {};
  for (let { key, scene } of allRoutes) {
    data[key] = scene;
  }
  const renderScene = SceneMap(data);

  const [index, setIndex] = useState<number>(indexInitialRoute);
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
          scrollEnabled={isScrollEnabled}
          tabStyle={[styles.tabStyle, isScrollEnabled ? { width: 'auto' } : {}]}
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
      style={containerStyle}
    />
  );
}

const styles = StyleSheet.create({
  tabStyle: {
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
